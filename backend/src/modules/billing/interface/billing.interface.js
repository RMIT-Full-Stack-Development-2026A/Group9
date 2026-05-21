import * as billingService from "../services/billing.service.js";
import { BillingDto } from "../dto/billing.dto.js";

// Thin wrapper around the service for callers that want a direct wallet read.
export const getWallet = (userId) => billingService.getWallet(userId);

// Fetch and DTO-map a user's transaction history for external consumers.
export const getTransactions = async (userId) => {
	const txs = await billingService.getTransactions(userId);
	return txs.map(BillingDto.toTransactionResponse);
};
