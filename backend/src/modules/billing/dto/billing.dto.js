export const BillingDto = {
	toTransactionResponse: (tx) => ({
		_id: tx._id,
		type: tx.type,
		amount: tx.amount,
		status: tx.status,
		description: tx.description,
		createdAt: tx.createdAt,
	}),

	toWalletResponse: (profile) => ({
		walletBalance: profile?.walletBalance ?? 0,
		premiumUntil: profile?.premiumUntil ?? null,
	}),
};