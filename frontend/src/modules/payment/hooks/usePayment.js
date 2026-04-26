import { useState, useEffect, useCallback, useContext } from "react";
import { AuthContext } from "../../../app/providers/AuthProvider.jsx";
import { AUTH_USER_KEY } from "../../../config/api.config.js";
import * as paymentService from "../services/payment.service.js";

export default function usePayment() {
	const authContext = useContext(AuthContext);
	const [wallet, setWallet] = useState({ walletBalance: 0, premiumUntil: null });
	const [depositAmount, setDepositAmount] = useState("");
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState({ text: "", type: "" });

	const showMessage = (text, type = "success") => {
		setMessage({ text, type });
		setTimeout(() => setMessage({ text: "", type: "" }), 4000);
	};

	const syncUser = useCallback((updates) => {
		if (!authContext?.user) return;
		const next = { ...authContext.user, ...updates };
		localStorage.setItem(AUTH_USER_KEY, JSON.stringify(next));
		authContext.login(next);
	}, [authContext]);

	const fetchWallet = useCallback(async () => {
		try {
			const { data } = await paymentService.getWallet();
			setWallet(data.data ?? data);
		} catch {
			showMessage("Failed to load wallet", "error");
		}
	}, []);

	useEffect(() => { fetchWallet(); }, [fetchWallet]);

	const handleDeposit = async () => {
		const amt = Number(depositAmount);
		if (!amt || amt <= 0) { showMessage("Enter a valid amount", "error"); return; }
		try {
			setLoading(true);
			const { data } = await paymentService.deposit(amt);
			const result = data.data ?? data;
			setWallet((prev) => ({ ...prev, walletBalance: result.walletBalance }));
			syncUser({ walletBalance: result.walletBalance });
			setDepositAmount("");
			showMessage(`$${amt} deposited successfully`);
		} catch (err) {
			showMessage(err.response?.data?.message || "Deposit failed", "error");
		} finally {
			setLoading(false);
		}
	};

	const handleSubscribeWallet = async () => {
		try {
			setLoading(true);
			const { data } = await paymentService.subscribeWithWallet();
			const result = data.data ?? data;
			setWallet({ walletBalance: result.walletBalance, premiumUntil: result.premiumUntil });
			syncUser({ walletBalance: result.walletBalance, premiumUntil: result.premiumUntil });
			showMessage("Premium activated! Check your email for confirmation.");
		} catch (err) {
			showMessage(err.response?.data?.message || "Subscription failed", "error");
		} finally {
			setLoading(false);
		}
	};

	const handleStripeCheckout = async () => {
		try {
			setLoading(true);
			const { data } = await paymentService.createStripeCheckout();
			const result = data.data ?? data;
			if (result.checkoutUrl) {
				window.location.href = result.checkoutUrl;
			}
		} catch (err) {
			showMessage(err.response?.data?.message || "Stripe checkout failed", "error");
		} finally {
			setLoading(false);
		}
	};

	return {
		wallet,
		depositAmount,
		setDepositAmount,
		loading,
		message,
		handleDeposit,
		handleSubscribeWallet,
		handleStripeCheckout,
	};
}