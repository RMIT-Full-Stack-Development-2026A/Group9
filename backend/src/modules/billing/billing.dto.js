/**
 * Billing DTOs — present only necessary data in responses (A.3.2).
 * Excludes internal fields from transaction records.
 */

export const toWalletDTO = (user) => ({
  balance: user.walletBalance,
  isPremium: user.isPremium,
});

export const toTransactionDTO = (tx) => {
  const obj = tx.toObject ? tx.toObject() : tx;
  return {
    _id: obj._id,
    type: obj.type,
    amount: obj.amount,
    status: obj.status,
    description: obj.description,
    createdAt: obj.createdAt,
    // userId intentionally excluded — caller already knows their own ID
  };
};
