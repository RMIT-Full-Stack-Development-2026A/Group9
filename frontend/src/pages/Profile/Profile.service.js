import http from "../../utils/http.helper.js";
import { USER_ROUTES } from "../../config/api.config.js";

export const getProfile = () => http.get(USER_ROUTES.PROFILE);

export const updateProfile = (data) => http.put(USER_ROUTES.PROFILE, data);

export const uploadAvatar = (formData) =>
  http.post(USER_ROUTES.AVATAR, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getGameHistory = (params) =>
  http.get(USER_ROUTES.GAME_HISTORY, { params });
