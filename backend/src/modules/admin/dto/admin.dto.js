
export const adminDto = {
    
    toPlayerResponse: (user) => {
        // Use premiumUntil from joined profile if available
        const premiumUntil = user.profile?.premiumUntil;
        return {
            id: (user._id && typeof user._id.toString === 'function') ? user._id.toString() : String(user._id),
            username: user.username,
            email: user.email,
            role: user.role,
            isPremium: premiumUntil ? new Date(premiumUntil) > new Date() : false,
            isActive: user.isActive !== false,
            joinedDate: user.createdAt,
        };
    },

    
    toMetricsResponse: ({ totalPlayers, activeAccounts, inactiveAccounts, premiumUsers }) => {
        return {
            totalPlayers,
            activeAccounts,
            inactiveAccounts,
            premiumUsers,
            serverLoad: `${Math.min(100, Math.round((activeAccounts / 100) * 100))}%`
        };
    }
};