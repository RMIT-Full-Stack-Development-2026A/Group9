import * as billingService from "../services/billing.service.js";

export async function getWallet(req, res, next) {
	try {
		const data = await billingService.getWallet(req.user.id);
		res.status(200).json({ success: true, data });
	} catch (err) {
		next(err);
	}
}

export async function deposit(req, res, next) {
	try {
		const { amount } = req.body;
		const data = await billingService.depositToWallet(req.user.id, Number(amount));
		res.status(200).json({ success: true, data });
	} catch (err) {
		next(err);
	}
}

export async function subscribeWallet(req, res, next) {
	try {
		const data = await billingService.subscribeWithWallet(req.user.id);
		res.status(200).json({ success: true, data });
	} catch (err) {
		next(err);
	}
}

export async function createStripeCheckout(req, res, next) {
	try {
		const data = await billingService.createStripeCheckout(req.user.id);
		res.status(200).json({ success: true, data });
	} catch (err) {
		next(err);
	}
}

export async function stripeWebhook(req, res, next) {
	try {
		await billingService.handleStripeWebhook(
			req.body,
			req.headers["stripe-signature"]
		);
		res.status(200).json({ received: true });
	} catch (err) {
		next(err);
	}
}

export async function getTransactions(req, res, next) {
	try {
		const data = await billingService.getTransactions(req.user.id);
		res.status(200).json({ success: true, data });
	} catch (err) {
		next(err);
	}
}