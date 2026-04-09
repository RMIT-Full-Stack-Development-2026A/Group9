import { useState, useEffect } from "react";
import "./EditProfile.css";

const COUNTRIES = [
	"Vietnam", "Australia", "Canada", "Singapore", "Japan", "South Korea",
	"United States", "United Kingdom", "Germany", "France", "Brazil", "India",
	"Thailand", "Indonesia", "Philippines", "Malaysia", "New Zealand",
];

export default function EditProfile({ profile, onSave, saving, saveSuccess, error }) {
	const [form, setForm] = useState({
		username: "",
		email: "",
		country: "",
		currentPassword: "",
		newPassword: "",
	});

	useEffect(() => {
		if (profile) {
			setForm({
				username: profile.username || "",
				email: profile.email || "",
				country: profile.country || "",
				currentPassword: "",
				newPassword: "",
			});
		}
	}, [profile]);

	const handleChange = (e) => {
		setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const payload = {};
		if (form.username !== profile.username) payload.username = form.username;
		if (form.email !== profile.email) payload.email = form.email;
		if (form.country !== profile.country) payload.country = form.country;
		if (form.newPassword) {
			payload.currentPassword = form.currentPassword;
			payload.newPassword = form.newPassword;
		}

		if (Object.keys(payload).length === 0) return;
		onSave(payload);
	};

	return (
		<form className="edit-profile" onSubmit={handleSubmit}>
			<div className="edit-profile__group">
				<label className="edit-profile__label">Username</label>
				<input
					id="edit-username"
					className="edit-profile__input"
					name="username"
					value={form.username}
					onChange={handleChange}
					autoComplete="username"
				/>
			</div>

			<div className="edit-profile__group">
				<label className="edit-profile__label">Email</label>
				<input
					id="edit-email"
					className="edit-profile__input"
					name="email"
					type="email"
					value={form.email}
					onChange={handleChange}
					autoComplete="email"
				/>
			</div>

			<div className="edit-profile__group">
				<label className="edit-profile__label">Country</label>
				<select
					id="edit-country"
					className="edit-profile__input"
					name="country"
					value={form.country}
					onChange={handleChange}
				>
					<option value="">Select country</option>
					{COUNTRIES.map((c) => (
						<option key={c} value={c}>{c}</option>
					))}
				</select>
			</div>

			<p className="edit-profile__hint">Change password (leave blank to keep current)</p>

			<div className="edit-profile__group">
				<label className="edit-profile__label edit-profile__label--warn">Current Password</label>
				<input
					id="edit-current-password"
					className="edit-profile__input"
					name="currentPassword"
					type="password"
					value={form.currentPassword}
					onChange={handleChange}
					autoComplete="current-password"
				/>
			</div>

			<div className="edit-profile__group">
				<label className="edit-profile__label edit-profile__label--warn">New Password</label>
				<input
					id="edit-new-password"
					className="edit-profile__input"
					name="newPassword"
					type="password"
					value={form.newPassword}
					onChange={handleChange}
					autoComplete="new-password"
				/>
			</div>

			{error && <p className="edit-profile__error">{error}</p>}
			{saveSuccess && <p className="edit-profile__success">Profile saved successfully!</p>}

			<button
				id="save-profile-btn"
				className="edit-profile__btn"
				type="submit"
				disabled={saving}
			>
				{saving ? "Saving…" : "Save Changes"}
			</button>
		</form>
	);
}
