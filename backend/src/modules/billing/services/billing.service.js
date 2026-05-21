import Stripe from "stripe";
import nodemailer from "nodemailer";
import AppError from "../../../shared/errors/AppError.js";
import * as billingRepo from "../repositories/billing.repository.js";
import * as userInterface from "../../user/interface/user.interface.js";

const PREMIUM_PRICE = 10; // USD
const PREMIUM_DURATION_DAYS = 30;

// ── Stripe (lazy init so app boots even without key) ──────────────────
let stripe = null;
// Return a singleton Stripe client. Throws a 503 AppError when the secret
// key is not configured so callers can handle missing configuration.
const getStripe = () => {
	if (!stripe) {
		const key = process.env.STRIPE_SECRET_KEY;
		if (!key) throw new AppError("Stripe is not configured", 503);
		stripe = new Stripe(key);
	}
	return stripe;
};

// // ── Email transporter (lazy) ──────────────────────────────────────────
// let transporter = null;
// // Lazily create and return a nodemailer transport. If email environment
// // variables are missing, sending is skipped by callers; creating the
// // transporter is non-blocking and only happens when first needed.
// const getTransporter = () => {
// 	if (!transporter) {
// 		transporter = nodemailer.createTransport({
// 			host: process.env.EMAIL_HOST || "smtp.gmail.com",
// 			port: Number(process.env.EMAIL_PORT) || 587,
// 			auth: {
// 				user: process.env.EMAIL_USER,
// 				pass: process.env.EMAIL_PASS,
// 			},
// 		});
// 	}
// 	return transporter;
// };

// ── Email transporter (lazy) ──────────────────────────────────────────
let transporter = null;
// Lazily create and return a nodemailer transport. Automatically switches
// to secure connection handling if Port 465 is provided.
const getTransporter = () => {
    if (!transporter) {
        const port = Number(process.env.EMAIL_PORT) || 465;
        transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || "smtp.gmail.com",
            port: port,
            secure: port === 465, // True for 465, false for 587
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
			family: 4
        });
    }
    return transporter;
};

// Send a non-blocking payment confirmation email. Returns quickly when
// email is not configured. Any failures are logged but do not block billing
// flows (best-effort notification).
const sendPaymentEmail = async (email, username) => {
	if (!process.env.EMAIL_USER) return; // skip if not configured
	const from = `"TicTacToang" <${process.env.EMAIL_USER}>`;
	console.log(`[EMAIL DEBUG] Sending payment confirmation FROM: ${from} TO: ${email}`);
	try {
		await getTransporter().sendMail({
			from,
			to: email,
			subject: "Premium Subscription Confirmed!",
			html: `<h2>Hey ${username},</h2>
				   <p>Your premium subscription has been activated for 30 days.</p>
				   <p>Enjoy advanced ranking and match replay features!</p>
				   <p>&mdash; TicTacToang Team</p>`,
		});
		console.log(`[EMAIL DEBUG] Email sent successfully to ${email}`);
	} catch (err) {
		console.error("[EMAIL DEBUG] Email send failed (non-blocking):", err.message);
	}
};

// ── Helpers ───────────────────────────────────────────────────────────
// Compute the new premium expiry date by extending from the later of
// `currentPremiumUntil` (if in future) or now. Returns a Date object
// PREMIUM_DURATION_DAYS ahead of the chosen base date.
const computeNewPremiumUntil = (currentPremiumUntil) => {
	const now = new Date();
	const base = currentPremiumUntil && new Date(currentPremiumUntil) > now
		? new Date(currentPremiumUntil)
		: now;
	return new Date(base.getTime() + PREMIUM_DURATION_DAYS * 24 * 60 * 60 * 1000);
};

// ── Wallet Deposit ────────────────────────────────────────────────────
// Deposit money into a user's wallet and record a completed transaction.
// Throws if amount is not positive. Returns the created transaction and
// the updated wallet balance from the user's profile.
export async function depositToWallet(userId, amount) {
	if (!amount || amount <= 0) throw new AppError("Amount must be positive", 400);

	const tx = await billingRepo.createTransaction({
		userId,
		type: "deposit",
		amount,
		status: "completed",
		description: `Wallet deposit of $${amount}`,
	});

	const profile = await userInterface.addToWallet(userId, amount);
	return { transaction: tx, walletBalance: profile.walletBalance };
}

// ── Wallet Balance ────────────────────────────────────────────────────
// Retrieve wallet balance and premium expiry for a user.
export async function getWallet(userId) {
	const balance = await userInterface.getWalletBalance(userId);
	const premiumUntil = await userInterface.getPremiumUntil(userId);
	return { walletBalance: balance, premiumUntil };
}

// ── Subscribe via Wallet ──────────────────────────────────────────────
// Create a premium subscription using the user's wallet balance.
// - Ensures sufficient balance
// - Deducts the premium price, extends premiumUntil, records a completed
//   transaction, and triggers a non-blocking email notification.
export async function subscribeWithWallet(userId) {
	const balance = await userInterface.getWalletBalance(userId);
	if (balance < PREMIUM_PRICE) {
		throw new AppError(`Insufficient wallet balance. Need $${PREMIUM_PRICE}, have $${balance}`, 402);
	}

	const currentPremium = await userInterface.getPremiumUntil(userId);
	const newPremiumUntil = computeNewPremiumUntil(currentPremium);

	await userInterface.deductFromWallet(userId, PREMIUM_PRICE);
	const profile = await userInterface.setPremiumUntil(userId, newPremiumUntil);

	const tx = await billingRepo.createTransaction({
		userId,
		type: "subscription",
		amount: PREMIUM_PRICE,
		status: "completed",
		description: `Premium subscription via wallet until ${newPremiumUntil.toISOString().slice(0, 10)}`,
	});

	// Send email notification (non-blocking)
	const account = await userInterface.findUserById(userId);
	if (account?.email) {
		sendPaymentEmail(account.email, account.username);
	}

	return {
		transaction: tx,
		walletBalance: profile.walletBalance,
		premiumUntil: profile.premiumUntil,
	};
}

// ── Create Stripe Checkout Session ────────────────────────────────────
// Create a Stripe Checkout session and record a pending transaction.
// Returns an object containing the `checkoutUrl` to redirect the client.
export async function createStripeCheckout(userId) {
	const s = getStripe();

	const account = await userInterface.findUserById(userId);
	if (!account) throw new AppError("User not found", 404);

	const session = await s.checkout.sessions.create({
		mode: "payment",
		payment_method_types: ["card"],
		customer_email: account.email,
		line_items: [
			{
				price_data: {
					currency: "usd",
					product_data: { name: "TicTacToang Premium (30 days)" },
					unit_amount: PREMIUM_PRICE * 100,
				},
				quantity: 1,
			},
		],
		metadata: { userId: String(userId) },
		success_url: `${process.env.CLIENT_URL || "http://localhost:5173"}/profile?tab=wallet&payment=success`,
		cancel_url: `${process.env.CLIENT_URL || "http://localhost:5173"}/payment?payment=cancelled`,
	});

	// Create pending transaction
	await billingRepo.createTransaction({
		userId,
		type: "subscription",
		amount: PREMIUM_PRICE,
		status: "pending",
		description: `Stripe checkout ${session.id}`,
	});

	return { checkoutUrl: session.url };
}

// ── Stripe Webhook Handler ────────────────────────────────────────────
// Handle Stripe webhook raw body and signature verification.
// - Validates the signature using the configured webhook secret
// - Processes `checkout.session.completed` events by extending premium
//   status, marking pending transactions completed, and sending emails.
export async function handleStripeWebhook(rawBody, signature) {
	console.log("[WEBHOOK DEBUG] Received webhook event, signature present:", !!signature);
	const s = getStripe();
	const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
	if (!endpointSecret) throw new AppError("Webhook secret not configured", 503);

	let event;
	try {
		event = s.webhooks.constructEvent(rawBody, signature, endpointSecret);
	} catch (err) {
		console.error("[WEBHOOK DEBUG] Signature verification failed:", err.message);
		throw new AppError(`Webhook signature verification failed: ${err.message}`, 400);
	}

	console.log(`[WEBHOOK DEBUG] Event type: ${event.type}`);

	if (event.type === "checkout.session.completed") {
		const session = event.data.object;
		const sessionId = session.id;
		const userId = session.metadata?.userId;
		console.log(`[WEBHOOK DEBUG] checkout.session.completed for userId: ${userId}, sessionId: ${sessionId}`);
		if (!userId) return;

		const currentPremium = await userInterface.getPremiumUntil(userId);
		const newPremiumUntil = computeNewPremiumUntil(currentPremium);
		await userInterface.setPremiumUntil(userId, newPremiumUntil);
		console.log(`[WEBHOOK DEBUG] Premium set until: ${newPremiumUntil.toISOString()}`);

		// Mark matching pending Stripe transaction as completed
		const pendingTx = await billingRepo.findLatestPendingSubscriptionBySessionId(sessionId);
		if (pendingTx?._id) {
			await billingRepo.updateTransactionStatus(pendingTx._id, "completed");
			console.log(`[WEBHOOK DEBUG] Transaction ${pendingTx._id} marked completed`);
		} else {
			console.warn(`[WEBHOOK DEBUG] No pending transaction found for Stripe session ${sessionId}`);
		}

		// Send email notification
		const account = await userInterface.findUserById(userId);
		if (account?.email) {
			sendPaymentEmail(account.email, account.username);
		}
	}
}

// ── Transaction History ───────────────────────────────────────────────
// Return the transaction history for a user (most recent first)
export async function getTransactions(userId) {
	const txs = await billingRepo.findTransactionsByUser(userId);
	return txs;
}