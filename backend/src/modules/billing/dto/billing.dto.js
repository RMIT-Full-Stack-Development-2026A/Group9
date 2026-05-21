export const BillingDto = {
	// Convert a transaction document into the API response shape.
	toTransactionResponse: (tx) => ({
		_id: tx._id,
		type: tx.type,
		amount: tx.amount,
		status: tx.status,
		description: tx.description,
		createdAt: tx.createdAt,
	}),

	// Convert wallet/profile data into a minimal billing response.
	toWalletResponse: (profile) => ({
		walletBalance: profile?.walletBalance ?? 0,
		premiumUntil: profile?.premiumUntil ?? null,
	}),
};