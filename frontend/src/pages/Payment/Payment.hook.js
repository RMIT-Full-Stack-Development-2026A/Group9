import { useState, useEffect, useCallback } from "react";
import * as paymentService from "./Payment.service.js";

export const usePayment = (onUserUpdate) => {
  const [wallet, setWallet] = useState({ balance: 0, isPremium: false });
  const [transactions, setTransactions] = useState([]);
  const [depositAmount, setDepositAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const fetchWallet = useCallback(async () => {
    try {
      const { data } = await paymentService.getWallet();
      setWallet(data);
    } catch {
      // silent
    }
  }, []);

  const fetchTransactions = useCallback(async () => {
    try {
      const { data } = await paymentService.getTransactions();
      setTransactions(data);
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    Promise.all([fetchWallet(), fetchTransactions()]).finally(() =>
      setLoading(false)
    );
  }, [fetchWallet, fetchTransactions]);

  const handleDeposit = useCallback(async () => {
    const amount = parseFloat(depositAmount);
    if (!amount || amount <= 0) {
      setMessage({ type: "error", text: "Enter a valid amount greater than 0." });
      return;
    }
    setActionLoading(true);
    setMessage(null);
    try {
      const { data } = await paymentService.deposit(amount);
      setWallet((w) => ({ ...w, balance: data.balance }));
      setDepositAmount("");
      setMessage({ type: "success", text: `$${amount} deposited successfully!` });
      fetchTransactions();
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Deposit failed." });
    } finally {
      setActionLoading(false);
    }
  }, [depositAmount, fetchTransactions]);

  const handleSubscribe = useCallback(async () => {
    setActionLoading(true);
    setMessage(null);
    try {
      const { data } = await paymentService.subscribe();
      setWallet({ balance: data.balance, isPremium: data.isPremium });
      setMessage({ type: "success", text: "Premium subscription activated! Check your email for confirmation." });
      fetchTransactions();

      // Update user in localStorage and parent state
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          const user = JSON.parse(stored);
          user.isPremium = true;
          localStorage.setItem("user", JSON.stringify(user));
          if (onUserUpdate) onUserUpdate(user);
        } catch { /* ignore */ }
      }
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Subscription failed." });
    } finally {
      setActionLoading(false);
    }
  }, [fetchTransactions, onUserUpdate]);

  return {
    wallet,
    transactions,
    depositAmount,
    setDepositAmount,
    loading,
    actionLoading,
    message,
    handleDeposit,
    handleSubscribe,
  };
};
