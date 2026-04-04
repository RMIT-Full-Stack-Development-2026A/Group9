import * as billingService from "./billing.service.js";
import { toTransactionDTO } from "./billing.dto.js";

export const deposit = async (req, res) => {
  try {
    const result = await billingService.deposit(req.userId, req.body.amount);
    res.json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const subscribe = async (req, res) => {
  try {
    const result = await billingService.subscribe(req.userId);
    res.json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const transactions = await billingService.getTransactions(req.userId);
    res.json(transactions.map(toTransactionDTO));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getWallet = async (req, res) => {
  try {
    const wallet = await billingService.getWallet(req.userId);
    res.json(wallet);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};