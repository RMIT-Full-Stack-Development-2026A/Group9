import { useState, useEffect, useCallback } from "react";
import * as profileService from "./Profile.service.js";

export const useProfile = (onUserUpdate) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [activeTab, setActiveTab] = useState("history");

  // Profile form
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    country: "",
    currentPassword: "",
    newPassword: "",
  });

  // Game history
  const [gameHistory, setGameHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Search & filters
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
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

  const syncUser = useCallback(
    (nextUser) => {
      setUser(nextUser);
      localStorage.setItem("user", JSON.stringify(nextUser));
      if (onUserUpdate) {
        onUserUpdate(nextUser);
      }
    },
    [onUserUpdate]
  );

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await profileService.getProfile();
      syncUser(data);
      setFormData((prev) => ({
        ...prev,
        username: data.username || "",
        email: data.email || "",
        country: data.country || "",
      }));
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Failed to load profile",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, [syncUser]);

  const fetchGameHistory = useCallback(async () => {
    try {
      setHistoryLoading(true);
      const params = { ...filters };
      if (search) params.search = search;
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
      syncUser(data);
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
      }));
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

    const fd = new FormData();
    fd.append("avatar", file);

    try {
      setSaving(true);
      const { data } = await profileService.uploadAvatar(fd);
      syncUser(data);
      showMessage("Avatar updated successfully");
    } catch (error) {
      showMessage(error.response?.data?.message || "Upload failed", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleSearchSubmit = () => {
    setSearch(searchInput);
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
    setSearchInput("");
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
    activeTab,
    setActiveTab,
    gameHistory,
    historyLoading,
    searchInput,
    setSearchInput,
    filters,
    handleFormChange,
    handleUpdateProfile,
    handleAvatarUpload,
    handleSearchSubmit,
    handleFilterChange,
    toggleSortOrder,
    clearFilters,
  };
};
