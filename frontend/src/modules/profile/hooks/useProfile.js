import { useState, useEffect, useCallback } from "react";
import * as profileService from "../services/profile.service.js";

/**
 * Hook for managing profile data and game history.
 */
export default function useProfile(userId = null) {
	// ── Profile state ──
	const [profile, setProfile] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [saving, setSaving] = useState(false);
	const [saveSuccess, setSaveSuccess] = useState(false);

	// ── History state ──
	const [history, setHistory] = useState([]);
	const [historyLoading, setHistoryLoading] = useState(false);

	// ── Load profile ──
	const loadProfile = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await profileService.fetchProfile(userId);
			setProfile(data);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}, [userId]);

	// ── Save profile ──
	const saveProfile = useCallback(async (formData) => {
		setSaving(true);
		setSaveSuccess(false);
		setError(null);
		try {
			const updated = await profileService.updateProfile(formData);
			setProfile(updated);
			setSaveSuccess(true);
			setTimeout(() => setSaveSuccess(false), 3000);
			return updated;
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setSaving(false);
		}
	}, []);

	// ── Upload avatar ──
	const uploadAvatar = useCallback(async (file) => {
		setError(null);
		try {
			const result = await profileService.uploadAvatar(file);
			setProfile((prev) => (prev ? { ...prev, avatar: result.avatar } : prev));
			return result;
		} catch (err) {
			setError(err.message);
			throw err;
		}
	}, []);

	// ── Load game history ──
	const loadHistory = useCallback(async (params = {}) => {
		setHistoryLoading(true);
		try {
			const data = await profileService.fetchGameHistory(userId, params);
			setHistory(data);
		} catch (err) {
			setError(err.message);
		} finally {
			setHistoryLoading(false);
		}
	}, [userId]);

	// Auto-load profile on mount
	useEffect(() => {
		loadProfile();
	}, [loadProfile]);

	return {
		profile,
		loading,
		error,
		saving,
		saveSuccess,
		saveProfile,
		uploadAvatar,
		loadProfile,
		history,
		historyLoading,
		loadHistory,
	};
}