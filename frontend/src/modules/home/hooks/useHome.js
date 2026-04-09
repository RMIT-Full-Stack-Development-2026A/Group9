/**
 * ============================================================================
 * USE HOME HOOK (The Lobby Controller)
 * ============================================================================
 * Location: src/modules/home/hooks/useHome.js
 * Purpose: This hook manages the logic for the Home/Lobby dashboard. 
 * It handles the fetching of player stats, global announcements, and 
 * the initiation of matchmaking processes.
 * * Key Responsibilities:
 * 1. Data Loading: Fetching user profile summary (XP, Rank, Win Rate).
 * 2. News Sync: Retrieving latest updates or patch notes from the API.
 * 3. Matchmaking Trigger: Interfacing with the gameApi to join a queue.
 * 4. State Management: Handling loading and error states for the dashboard.
 */

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