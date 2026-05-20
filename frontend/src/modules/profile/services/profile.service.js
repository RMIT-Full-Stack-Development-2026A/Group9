import http from "../../../shared/utils/http.helper.js";
import { API_ROUTES } from "../../../config/apiRoutes.js";

export const getProfile = () => http.get(API_ROUTES.users.profile);

export const updateProfile = (data) => http.put(API_ROUTES.users.profile, data);

export const uploadAvatar = (formData) =>
	http.post(API_ROUTES.users.avatar, formData, {
		headers: { "Content-Type": "multipart/form-data" },
	});

export const getGameHistory = (params) =>
	http.get(API_ROUTES.users.gameHistory, { params });

export const getSessionReplay = (sessionId) =>
	http.get(API_ROUTES.game.replay(sessionId));
