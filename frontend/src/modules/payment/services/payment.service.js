import http from "../../../shared/utils/http.helper.js";

export const getWallet = () => http.get("/api/billing/wallet");

export const deposit = (amount) => http.post("/api/billing/wallet/deposit", { amount });

export const subscribeWithWallet = () => http.post("/api/billing/subscribe/wallet");

export const createStripeCheckout = () => http.post("/api/billing/checkout/stripe");

export const getTransactions = () => http.get("/api/billing/transactions");