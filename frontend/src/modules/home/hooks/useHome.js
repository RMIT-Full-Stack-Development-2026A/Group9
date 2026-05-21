
import { useContext } from "react";
import { AuthContext } from "../../../app/providers/AuthProvider.jsx";
import { getStoredUser, getWelcomeLine, isPremiumUser } from "../services/home.service.js";

export function useHome() {
	const { user } = useContext(AuthContext) || {};
	const currentUser = user ?? getStoredUser();
	const welcome = getWelcomeLine(currentUser);
	const showRankings = Boolean(currentUser) && isPremiumUser(currentUser);

	return {
		currentUser,
		welcome,
		showRankings,
	};
}