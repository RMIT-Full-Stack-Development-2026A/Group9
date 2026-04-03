import { getStoredUser, getWelcomeLine, isPremiumUser } from "./Home.service";

export function useHome() {
	const currentUser = getStoredUser();
	const welcome = getWelcomeLine(currentUser);
	const showRankings = Boolean(currentUser) && isPremiumUser(currentUser);

	return {
		currentUser,
		welcome,
		showRankings,
	};
}

