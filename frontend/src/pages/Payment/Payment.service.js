import http from "../../utils/http.helper.js";
import { BILLING_ROUTES } from "../../config/api.config.js";

export const getWallet = () => http.get(BILLING_ROUTES.WALLET);
export const deposit = (amount) => http.post(BILLING_ROUTES.DEPOSIT, { amount });
export const subscribe = () => http.post(BILLING_ROUTES.SUBSCRIBE);
export const getTransactions = () => http.get(BILLING_ROUTES.TRANSACTIONS);
