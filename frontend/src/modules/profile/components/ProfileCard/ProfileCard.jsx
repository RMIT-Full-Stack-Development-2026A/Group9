import { useRef } from "react";
import "./ProfileCard.css";

export default function ProfileCard({ profile, onAvatarChange }) {
	const fileRef = useRef(null);

	const isPremium =
		profile?.premiumUntil && new Date(profile.premiumUntil).getTime() > Date.now();

	const initials = (profile?.username || "?").charAt(0).toUpperCase();

	const handleFileChange = (e) => {
		const file = e.target.files?.[0];
		if (file && onAvatarChange) {
			onAvatarChange(file);
		}
	};

	return (
		<div className="profile-card">
			<div className="profile-card__avatar-wrap" onClick={() => fileRef.current?.click()}>
				{profile?.avatar ? (
					<img
						src={profile.avatar}
						alt={profile.username}
						className="profile-card__avatar-img"
					/>
				) : (
					<div className="profile-card__avatar-placeholder">{initials}</div>
				)}
				<div className="profile-card__avatar-overlay">
					<i className="bi bi-camera-fill"></i>
				</div>
				<input
					ref={fileRef}
					type="file"
					accept="image/*"
					hidden
					onChange={handleFileChange}
				/>
			</div>

			<div className="profile-card__info">
				<div className="profile-card__name-row">
					<h2 className="profile-card__username">{profile?.username}</h2>
					{isPremium && <span className="profile-card__badge">⭐ Premium</span>}
				</div>
				<p className="profile-card__email">{profile?.email}</p>
				<p className="profile-card__country">
					<i className="bi bi-geo-alt-fill"></i> {profile?.country || "Not set"}
				</p>
			</div>
		</div>
	);
}