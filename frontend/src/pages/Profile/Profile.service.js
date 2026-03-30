import http from "../../utils/http.helper.js";

export const getProfile = () => http.get("/users/profile");

export const updateProfile = (data) => http.put("/users/profile", data);

export const uploadAvatar = (formData) =>
  http.post("/users/profile/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getGameHistory = (params) =>
  http.get("/users/game-history", { params });
