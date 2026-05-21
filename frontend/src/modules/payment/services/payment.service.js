import http from "../../../shared/utils/http.helper.js";
import { API_ROUTES } from "../../../config/apiRoutes.js";

/*
	payment.service
	- Thin HTTP adapter for the backend billing endpoints. Each exported
		function returns the `http` promise so callers can await and inspect
		`response.data` or the full response object.
	- Keep business logic out of here; this file intentionally maps routes
		to simple functions for testability and reuse.
*/
export const getWallet = () => http.get(API_ROUTES.billing.wallet);

// Deposit `amount` to the user's wallet
export const deposit = (amount) => http.post(API_ROUTES.billing.deposit, { amount });

// Subscribe using internal wallet balance (server-side billing)
export const subscribeWithWallet = () => http.post(API_ROUTES.billing.subscribeWallet);

// Create a Stripe Checkout session; server returns a redirect URL
export const createStripeCheckout = () => http.post(API_ROUTES.billing.stripeCheckout);

// Retrieve historical transactions for the user
export const getTransactions = () => http.get(API_ROUTES.billing.transactions);
