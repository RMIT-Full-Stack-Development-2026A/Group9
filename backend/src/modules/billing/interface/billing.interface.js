import * as billingService from "../services/billing.service.js";
import { BillingDto } from "../dto/billing.dto.js";

export const getWallet = (userId) => billingService.getWallet(userId);

export const getTransactions = async (userId) => {
	const txs = await billingService.getTransactions(userId);
	return txs.map(BillingDto.toTransactionResponse);
};
