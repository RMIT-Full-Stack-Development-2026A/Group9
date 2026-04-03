import { useAuth } from "../../context/authContext";
import { getStoredUser, getWelcomeLine, isPremiumUser } from "./Home.service";

export function useHome() {
	const { user } = useAuth();
	const currentUser = user ?? getStoredUser();
	const welcome = getWelcomeLine(currentUser);
	const showRankings = Boolean(currentUser) && isPremiumUser(currentUser);

	return {
		currentUser,
		welcome,
		showRankings,
	};
}

