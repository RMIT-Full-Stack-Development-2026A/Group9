import * as billingService from '../services/billing.service.js';

// Example: Expose a public function for other modules
export const createInvoice = (userId, amount, details) => {
	return billingService.createInvoice(userId, amount, details);
};
