import { useState, useEffect, useCallback, useContext, useMemo } from "react";
import { AuthContext } from "../../../app/providers/AuthProvider.jsx";
import * as profileService from "../services/profile.service.js";
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from "../../../config/api.config.js";
import { useReplay } from "./useReplay.js";

export const useProfile = (onUserUpdate) => {
  const authContext = useContext(AuthContext);
  // Only show loading if there is no user in context
  const [loading, setLoading] = useState(!authContext?.user);
  // Track background fetch for subtle spinner if needed
  const [backgroundFetching, setBackgroundFetching] = useState(false);
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

  const replay = useReplay(showMessage);

  const syncUser = useCallback(
    (nextUser) => {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(nextUser));
      if (authContext && typeof authContext.login === "function") {
        authContext.login(nextUser);
      }
      if (onUserUpdate) {
        onUserUpdate(nextUser);
      }
    },
    [onUserUpdate, authContext]
  );

  const fetchProfile = useCallback(async () => {
    try {
      // Only set loading=true if there is no user data
      if (!authContext?.user) {
        setLoading(true);
      } else {
        setBackgroundFetching(true);
      }
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
      if (!authContext?.user) {
        setLoading(false);
      } else {
        setBackgroundFetching(false);
      }
    }
  }, [syncUser, authContext]);

  const fetchGameHistory = useCallback(async () => {
    try {
      setHistoryLoading(true);
      const params = { ...filters };
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
  }, [filters]);

  useEffect(() => {
    // If user exists, render immediately and fetch latest profile in background
    if (authContext?.user) {
      setLoading(false);
      setBackgroundFetching(true);
      fetchProfile().finally(() => setBackgroundFetching(false));
    } else {
      setLoading(true);
      fetchProfile().finally(() => setLoading(false));
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
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
      await profileService.uploadAvatar(fd);
      // Always fetch the latest profile after avatar upload
      const { data } = await profileService.getProfile();
      syncUser(data);
      setFormData((prev) => ({
        ...prev,
        username: data.username || "",
        email: data.email || "",
        country: data.country || "",
      }));
      showMessage("Avatar updated successfully");
    } catch (error) {
      showMessage(error.response?.data?.message || "Upload failed", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleSearchInputChange = (value) => {
    setSearchInput(value);
    setSearch(value);
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

  const getSessionToken = useCallback((game = {}) => {
    const id = String(game?._id || "").trim();
    if (!id) return "";
    return `#${id.slice(-4).toUpperCase()}`;
  }, []);

  const filteredGameHistory = useMemo(() => {
    const query = String(search || "").trim().toLowerCase();
    if (!query) return gameHistory;

    return gameHistory.filter((game) => {
      const token = getSessionToken(game).toLowerCase();
      const opponent = String(game?.opponent || "").toLowerCase();
      return token.includes(query) || opponent.includes(query);
    });
  }, [gameHistory, search, getSessionToken]);

  return {
    user: authContext.user,
    loading,
    saving,
    message,
    formData,
    activeTab,
    setActiveTab,
    gameHistory: filteredGameHistory,
    historyLoading,
    searchInput,
    setSearchInput,
    filters,
    handleFormChange,
    handleUpdateProfile,
    handleAvatarUpload,
    handleSearchInputChange,
    handleFilterChange,
    toggleSortOrder,
    clearFilters,
    getSessionToken,
    ...replay,
  };
};
