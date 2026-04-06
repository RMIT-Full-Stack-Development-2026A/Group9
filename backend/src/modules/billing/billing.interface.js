import * as billingService from "./billing.service.js";

/**
 * Billing module interface — the only entry point for other modules.
 * Other modules must NOT import billing services, repositories, or models directly.
 * (Architecture requirement A.3.1)
 */

export const deposit = (userId, amount) => billingService.deposit(userId, amount);

export const subscribe = (userId) => billingService.subscribe(userId);

export const getWallet = (userId) => billingService.getWallet(userId);

export const getTransactions = (userId) => billingService.getTransactions(userId);
