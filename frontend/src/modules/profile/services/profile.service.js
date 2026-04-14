/**
 * ============================================================================
 * PROFILE SERVICE (The Identity Logic)
 * ============================================================================
 * Location: src/modules/profile/services/profile.service.js
 * Purpose: This service handles the logic for managing player identity and 
 * formatting historical match data. It bridges the gap between raw player 
 * records and the "Toang" social features.
 * * Key Responsibilities:
 * 1. Data Validation: Checking username availability and avatar file types.
 * 2. History Formatting: Processing match logs into "Won", "Lost", or "Drew" labels.
 * 3. Achievement Logic: (Future) Checking if a player has unlocked specific badges.
 * 4. Image Handling: Optimizing or choosing default avatars based on rank.
 */

import http from "../../../shared/utils/http.helper.js";

export const getProfile = () => http.get("/api/users/profile");

export const updateProfile = (data) => http.put("/api/users/profile", data);


export const uploadAvatar = (formData) =>
  http.post("/api/users/profile/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });


export const getGameHistory = (params) =>
  http.get("/api/users/game-history", { params });