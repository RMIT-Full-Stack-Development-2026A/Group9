import http from "../../../shared/utils/http.helper.js";
import { API_ROUTES } from "../../../config/apiRoutes.js";

export const getWallet = () => http.get(API_ROUTES.billing.wallet);

export const deposit = (amount) => http.post(API_ROUTES.billing.deposit, { amount });

export const subscribeWithWallet = () => http.post(API_ROUTES.billing.subscribeWallet);

export const createStripeCheckout = () => http.post(API_ROUTES.billing.stripeCheckout);

export const getTransactions = () => http.get(API_ROUTES.billing.transactions);
