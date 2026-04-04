import { usePayment } from "./Payment.hook.js";
import Button from "../../components/Button/Button.jsx";
import "./Payment.css";

const Payment = ({ onUserUpdate }) => {
  const {
    wallet, transactions, depositAmount, setDepositAmount,
    loading, actionLoading, message, handleDeposit, handleSubscribe,
  } = usePayment(onUserUpdate);

  if (loading) return <p className="payment-loading">Loading...</p>;

  return (
    <div className="payment-page">
      <h2 className="payment-title">Wallet & Premium</h2>

      {message && (
        <div className={`payment-msg payment-msg--${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Wallet Card */}
      <div className="wallet-card">
        <div className="wallet-balance">
          <span className="wallet-label">Balance</span>
          <span className="wallet-amount">${wallet.balance.toFixed(2)}</span>
        </div>
        <div className="wallet-status">
          {wallet.isPremium ? (
            <span className="badge badge--premium">★ Premium</span>
          ) : (
            <span className="badge badge--free">Free</span>
          )}
        </div>
      </div>

      {/* Deposit */}
      <div className="payment-section">
        <h3>Deposit Funds</h3>
        <div className="deposit-row">
          <span className="deposit-dollar">$</span>
          <input
            type="number"
            className="deposit-input"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
          <Button
            variant="primary"
            onClick={handleDeposit}
            disabled={actionLoading}
          >
            {actionLoading ? "Processing..." : "Deposit"}
          </Button>
        </div>
        <div className="deposit-quick">
          {[5, 10, 25, 50].map((amt) => (
            <button
              key={amt}
              className="quick-btn"
              onClick={() => setDepositAmount(String(amt))}
            >
              ${amt}
            </button>
          ))}
        </div>
      </div>

      {/* Premium Subscription */}
      {!wallet.isPremium && (
        <div className="payment-section premium-section">
          <h3>Premium Subscription</h3>
          <p className="premium-desc">
            Unlock game replay and premium features for <strong>$10.00</strong>.
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={handleSubscribe}
            disabled={actionLoading || wallet.balance < 10}
          >
            {actionLoading ? "Processing..." : "Subscribe - $10.00"}
          </Button>
          {wallet.balance < 10 && (
            <p className="premium-warn">
              Insufficient balance. Please deposit at least ${(10 - wallet.balance).toFixed(2)} more.
            </p>
          )}
        </div>
      )}

      {/* Transaction History */}
      <div className="payment-section">
        <h3>Transaction History</h3>
        {transactions.length === 0 ? (
          <p className="tx-empty">No transactions yet.</p>
        ) : (
          <div className="tx-list">
            {transactions.map((tx) => (
              <div key={tx._id} className="tx-item">
                <div className="tx-info">
                  <span className={`tx-type ${tx.type}`}>
                    {tx.type === "deposit" ? "↑ Deposit" : "★ Subscription"}
                  </span>
                  <span className="tx-desc">{tx.description}</span>
                </div>
                <div className="tx-meta">
                  <span className="tx-amount">${tx.amount.toFixed(2)}</span>
                  <span className="tx-date">
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;
