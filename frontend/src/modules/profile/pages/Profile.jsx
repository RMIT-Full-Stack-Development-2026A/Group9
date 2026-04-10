import { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../../app/providers/AuthProvider.jsx";
import ProfileCard from "../components/ProfileCard/ProfileCard.jsx";
import EditProfile from "../components/EditProfile/EditProfile.jsx";
import GameHistory from "../components/GameHistory/GameHistory.jsx";
import useProfile from "../hooks/useProfile.js";
import Navbar from "../../../shared/ui/Navbar/Navbar.jsx";
import "./Profile.css";

const TABS = [
	{ key: "history", label: "History", icon: "bi-clock-history" },
	{ key: "edit", label: "Edit Profile", icon: "bi-pencil-fill" },
	{ key: "wallet", label: "Wallet", icon: "bi-wallet2" },
];

export default function Profile() {
	const { userId } = useParams();
	const isOwnProfile = !userId;

	const [activeTab, setActiveTab] = useState(isOwnProfile ? "edit" : "history");
	const auth = useContext(AuthContext);

	const {
		profile,
		loading,
		error,
		saving,
		saveSuccess,
		saveProfile,
		uploadAvatar,
		history,
		historyLoading,
		loadHistory,
	} = useProfile(userId);

	const handleAvatarChange = async (file) => {
		try {
			const result = await uploadAvatar(file);
			// Update auth context so navbar reflects the new avatar
			if (auth?.updateUser && profile) {
				auth.updateUser({ ...auth.user, avatar: result.avatar });
			}
		} catch {
			// Error is already captured by the hook
		}
	};

	const handleSaveProfile = async (formData) => {
		try {
			const updated = await saveProfile(formData);
			// Update auth context
			if (auth?.updateUser) {
				auth.updateUser({
					...auth.user,
					username: updated.username,
					email: updated.email,
					country: updated.country,
				});
			}
		} catch {
			// Error handled by hook
		}
	};

	if (loading) {
		return (
			<>
				<Navbar />
				<div className="profile-page">
					<div className="profile-page__loading">
						<div className="profile-page__spinner"></div>
						<p>Loading profile…</p>
					</div>
				</div>
			</>
		);
	}

	return (
		<>
			<Navbar />
			<div className="profile-page">
				<div className="profile-page__container">
					{/* ── Header Card ──────────────────────────────────── */}
					<ProfileCard profile={profile} onAvatarChange={handleAvatarChange} />

					{/* ── Tabs ─────────────────────────────────────────── */}
					<div className="profile-page__tabs">
						{TABS.filter(tab => isOwnProfile || tab.key === "history").map((tab) => (
							<button
								key={tab.key}
								id={`tab-${tab.key}`}
								className={`profile-page__tab ${activeTab === tab.key ? "profile-page__tab--active" : ""}`}
								onClick={() => setActiveTab(tab.key)}
							>
								<i className={`bi ${tab.icon}`}></i> {tab.label}
							</button>
						))}
					</div>

					{/* ── Tab Content ──────────────────────────────────── */}
					<div className="profile-page__content">
						{activeTab === "edit" && (
							<EditProfile
								profile={profile}
								onSave={handleSaveProfile}
								saving={saving}
								saveSuccess={saveSuccess}
								error={error}
							/>
						)}

						{activeTab === "history" && (
							<GameHistory
								history={history}
								loading={historyLoading}
								onFilter={loadHistory}
							/>
						)}

						{activeTab === "wallet" && (
							<div className="profile-page__wallet">
								<div className="profile-page__wallet-card">
									<i className="bi bi-wallet2"></i>
									<p className="profile-page__wallet-balance">
										${profile?.walletBalance?.toFixed(2) || "0.00"}
									</p>
									<p className="profile-page__wallet-label">Wallet Balance</p>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
}
