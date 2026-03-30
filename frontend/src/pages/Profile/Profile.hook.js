import { useState, useEffect, useCallback } from "react";
import * as profileService from "./Profile.service.js";

export const useProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Profile form
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    country: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Game history
  const [gameHistory, setGameHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Search & filters
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    gameType: "",
    result: "",
    startDate: "",
    endDate: "",
    sortOrder: "desc",
  });

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 4000);
  };

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await profileService.getProfile();
      setUser(data);
      setFormData((prev) => ({
        ...prev,
        username: data.username || "",
        email: data.email || "",
        country: data.country || "",
      }));
    } catch (error) {
      showMessage(error.response?.data?.message || "Failed to load profile", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchGameHistory = useCallback(async () => {
    try {
      setHistoryLoading(true);
      const params = { ...filters };
      if (search) params.search = search;
      // Remove empty params
      Object.keys(params).forEach((key) => {
        if (!params[key]) delete params[key];
      });
      const { data } = await profileService.getGameHistory(params);
      setGameHistory(data);
    } catch (error) {
      showMessage("Failed to load game history", "error");
    } finally {
      setHistoryLoading(false);
    }
  }, [search, filters]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchGameHistory();
    }
  }, [fetchGameHistory]);

  const handleFormChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      showMessage("New passwords do not match", "error");
      return;
    }

    try {
      setSaving(true);
      const updateData = {
        username: formData.username,
        email: formData.email,
        country: formData.country,
      };
      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const { data } = await profileService.updateProfile(updateData);
      setUser(data);
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      // Update stored user
      localStorage.setItem("user", JSON.stringify(data));
      showMessage("Profile updated successfully");
    } catch (error) {
      showMessage(error.response?.data?.message || "Update failed", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setSaving(true);
      const { data } = await profileService.uploadAvatar(formData);
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      showMessage("Avatar updated successfully");
    } catch (error) {
      showMessage(error.response?.data?.message || "Upload failed", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleSortOrder = () => {
    setFilters((prev) => ({
      ...prev,
      sortOrder: prev.sortOrder === "desc" ? "asc" : "desc",
    }));
  };

  const clearFilters = () => {
    setSearch("");
    setFilters({
      gameType: "",
      result: "",
      startDate: "",
      endDate: "",
      sortOrder: "desc",
    });
  };

  return {
    user,
    loading,
    saving,
    message,
    formData,
    gameHistory,
    historyLoading,
    search,
    filters,
    handleFormChange,
    handleUpdateProfile,
    handleAvatarUpload,
    handleSearch,
    handleFilterChange,
    toggleSortOrder,
    clearFilters,
  };
};
