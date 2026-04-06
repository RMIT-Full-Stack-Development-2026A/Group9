import * as billingRepository from "./billing.repository.js";
import * as userFacade from "../users/user.facade.js";
import { AppError } from "../../shared/errors/AppError.js";
import nodemailer from "nodemailer";

const SUBSCRIPTION_FEE = 10;

/**
 * Deposit money into wallet (Req 5.1.1)
 */
export const deposit = async (userId, amount) => {
  if (!amount || amount <= 0) {
    throw new AppError("Deposit amount must be greater than 0.", 400);
  }

  const user = await userFacade.getUserById(userId);
  if (!user) throw new AppError("User not found.", 404);

  const newBalance = user.walletBalance + amount;
  await userFacade.updateWalletBalance(userId, newBalance);

  const transaction = await billingRepository.createTransaction({
    userId,
    type: "deposit",
    amount,
    status: "completed",
    description: `Deposited $${amount} into wallet`,
  });

  return { balance: newBalance, transaction };
};

/**
 * Subscribe to premium using wallet (Req 5.1.1)
 */
export const subscribe = async (userId) => {
  const user = await userFacade.getUserById(userId);
  if (!user) throw new AppError("User not found.", 404);

  if (user.isPremium) {
    throw new AppError("You are already a premium member.", 400);
  }

  if (user.walletBalance < SUBSCRIPTION_FEE) {
    throw new AppError(
      `Insufficient wallet balance. You need $${SUBSCRIPTION_FEE} but only have $${user.walletBalance}. Please deposit more funds.`,
      400
    );
  }

  const newBalance = user.walletBalance - SUBSCRIPTION_FEE;
  await userFacade.updateWalletBalance(userId, newBalance);
  await userFacade.setPremiumStatus(userId, true);

  const transaction = await billingRepository.createTransaction({
    userId,
    type: "subscription",
    amount: SUBSCRIPTION_FEE,
    status: "completed",
    description: "Monthly premium subscription",
  });

  // Send email notification (Req 5.1.2)
  sendPaymentEmail(user.email, user.username, SUBSCRIPTION_FEE).catch((err) =>
    console.error("Failed to send payment email:", err.message)
  );

  return { balance: newBalance, isPremium: true, transaction };
};

/**
 * Get transaction history
 */
export const getTransactions = async (userId) => {
  return billingRepository.findTransactionsByUser(userId);
};

/**
 * Get wallet balance
 */
export const getWallet = async (userId) => {
  const user = await userFacade.getUserById(userId);
  if (!user) throw new AppError("User not found.", 404);
  return { balance: user.walletBalance, isPremium: user.isPremium };
};

/**
 * Send payment confirmation email (Req 5.1.2)
 */
async function sendPaymentEmail(to, username, amount) {
  // Uses environment variables for SMTP config.
  // Falls back gracefully if not configured.
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.log(`[Email] SMTP not configured. Would send payment confirmation to ${to}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port: parseInt(port) || 587,
    secure: false,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: `"TicTacToang" <${user}>`,
    to,
    subject: "Payment Confirmation - Premium Subscription",
    html: `
      <h2>Payment Successful!</h2>
      <p>Hi ${username},</p>
      <p>Your premium subscription payment of <strong>$${amount}</strong> has been successfully processed.</p>
      <p>You now have access to all premium features including game replay.</p>
      <p>Thank you for subscribing!</p>
      <p>— TicTacToang Team</p>
    `,
  });
}