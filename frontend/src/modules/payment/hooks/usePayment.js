import { useState, useEffect, useCallback, useContext } from "react";
import { AuthContext } from "../../../app/providers/AuthProvider.jsx";
import { AUTH_USER_KEY } from "../../../config/api.config.js";
import * as paymentService from "../services/payment.service.js";

/*
  usePayment
  - Hook encapsulating payment-related UI state and actions used by the
	`PaymentForm` component. Responsibilities:
	- Load user's wallet from the backend
	- Handle deposits (add funds)
	- Subscribe to premium using wallet balance
	- Start a Stripe checkout flow
	- Keep AuthContext in sync with wallet/premium changes
*/
export default function usePayment() {
	const authContext = useContext(AuthContext);

	// Local UI state
	const [wallet, setWallet] = useState({ walletBalance: 0, premiumUntil: null });
	const [depositAmount, setDepositAmount] = useState("");
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState({ text: "", type: "" });

	// Helper to show transient messages to the user
	const showMessage = (text, type = "success") => {
		setMessage({ text, type });
		setTimeout(() => setMessage({ text: "", type: "" }), 4000);
	};

	// Sync local changes back into AuthContext + localStorage so other parts
	// of the app see updated wallet/premium data immediately.
	const syncUser = useCallback((updates) => {
		if (!authContext?.user) return;
		const next = { ...authContext.user, ...updates };
		localStorage.setItem(AUTH_USER_KEY, JSON.stringify(next));
		authContext.login(next);
	}, [authContext]);

	// Fetch wallet from API and populate state; shows an error message on failure
	const fetchWallet = useCallback(async () => {
		try {
			const { data } = await paymentService.getWallet();
			setWallet(data.data ?? data);
		} catch {
			showMessage("Failed to load wallet", "error");
		}
	}, []);

	useEffect(() => { fetchWallet(); }, [fetchWallet]);

	// Deposit flow: validate input, call API, update wallet + auth context
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

	// Subscribe using wallet balance: server handles billing logic
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

	// Start Stripe checkout flow; server returns a redirect URL
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