import styles from "./PaymentForm.module.css";
import usePayment from "../../hooks/usePayment.js";

export default function PaymentForm() {
	const {
		wallet,
		depositAmount,
		setDepositAmount,
		loading,
		message,
		handleDeposit,
		handleSubscribeWallet,
		handleStripeCheckout,
	} = usePayment();

	return (
		<div className={styles.premiumPage}>
			{message.text && (
				<div className={`${styles.premiumMessage} ${styles[message.type]}`}>{message.text}</div>
			)}

			<div className={styles.starIcon}>
				<i className="bi bi-star-fill"></i>
			</div>
			<h1>Go Premium</h1>
			<p className={styles.premiumSubtitle}>Unlock the full TicTacToang experience for just $10/month</p>

			<div className={styles.featuresCard}>
				<h2>Premium Features</h2>
				<div className={styles.featureItem}>
					<i className={`bi bi-check-circle-fill ${styles.featureCheck}`}></i>
					Match replay with Pause / Resume / Forward / Backward
				</div>
				<div className={styles.featureItem}>
					<i className={`bi bi-check-circle-fill ${styles.featureCheck}`}></i>
					Advanced Ranking System <i className="bi bi-trophy" style={{ color: "var(--orange)" }}></i>
				</div>
			</div>

			<div className={styles.paymentRow}>
				{/* ── Pay with Wallet ─────────────────────────────────────── */}
				<div className={styles.paymentCard}>
					<div className={styles.paymentCardTitle}>
						<i className="bi bi-wallet2"></i> Pay with Wallet
					</div>

					<div className={styles.balanceRow}>
						<span className={styles.balanceLabel}>Balance</span>
						<span className={styles.balanceAmount}>${wallet.walletBalance}</span>
					</div>

					<div className={styles.depositRow}>
						<input
							type="number"
							placeholder="Deposit amount"
							min="1"
							className={styles.depositInput}
							value={depositAmount}
							onChange={(e) => setDepositAmount(e.target.value)}
						/>
						<button
							className={styles.addBtn}
							onClick={handleDeposit}
							disabled={loading}
						>
							Add
						</button>
					</div>

					<button
						className={styles.subscribeBtn}
						onClick={handleSubscribeWallet}
						disabled={loading}
					>
						Subscribe ($10)
					</button>
				</div>

				{/* ── Pay with Stripe ─────────────────────────────────────── */}
				<div className={styles.paymentCard}>
					<div className={styles.paymentCardTitle}>
						<i className="bi bi-credit-card"></i> Pay with Stripe
					</div>
					<p className={styles.stripeDesc}>Secure payment via Stripe.</p>

					<div className={styles.stripeIcons}>
						<i className="bi bi-credit-card-2-front"></i>
						<i className="bi bi-lock-fill"></i>
						<i className={`bi bi-check-circle-fill ${styles.checkIcon}`}></i>
					</div>

					<button
						className={styles.stripeBtn}
						onClick={handleStripeCheckout}
						disabled={loading}
					>
						Pay with Stripe ($10)
					</button>
					<p className={styles.stripeNote}>You'll be redirected to Stripe's secure checkout</p>
				</div>
			</div>
		</div>
	);
}