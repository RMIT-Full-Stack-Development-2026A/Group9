/**
 * ============================================================================
 * PROFILE PAGE (The Trophy Case)
 * ============================================================================
 * Location: src/pages/Profile.jsx
 * Purpose: This page serves as the personal dashboard for the player. It 
 * displays their career statistics, XP progress, and allows them to 
 * customize their identity (avatar, bio).
 * * Key Responsibilities:
 * 1. Data Fetching: Loading the user's profile data from the profile module.
 * 2. Visual Progress: Displaying the XP bar and Leveling milestones.
 * 3. Settings Integration: Providing a portal to the ProfileEdit module.
 * 4. Match History: Listing recent games played (Win/Loss/Draw).
 */

import ProfileCard from "../components/ProfileCard/ProfileCard";

export default function Profile() {
	return <ProfileCard />;
}