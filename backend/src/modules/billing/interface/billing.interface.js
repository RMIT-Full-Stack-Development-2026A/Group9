import * as billingService from "../services/billing.service.js";

export const getWallet = (userId) => billingService.getWallet(userId);

export const getTransactions = (userId) => billingService.getTransactions(userId);
