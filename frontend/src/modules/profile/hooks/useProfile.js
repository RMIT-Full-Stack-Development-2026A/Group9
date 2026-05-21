import { useState, useEffect, useCallback, useContext, useMemo } from "react";
import { AuthContext } from "../../../app/providers/AuthProvider.jsx";
import * as profileService from "../services/profile.service.js";
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from "../../../config/api.config.js";
import { useReplay } from "./useReplay.js";

/*
  useProfile
  - Central hook for the Profile UI. Responsibilities:
    - Load and sync the authenticated user's profile data
    - Manage profile edit form state and submit updates
    - Fetch and filter game history (with search + filters)
    - Integrate replay controls via `useReplay`
    - Provide utility helpers used by `ProfileCard` (e.g., `getSessionToken`)
  - Note: the hook keeps the AuthContext in sync and writes the updated
    user to localStorage so the rest of the app sees updated data.
*/
export const useProfile = (onUserUpdate) => {
  const authContext = useContext(AuthContext);
  // Show initial loading only when user is missing from context
  const [loading, setLoading] = useState(!authContext?.user);
  // For subtle background refresh indicators when user exists
  const [backgroundFetching, setBackgroundFetching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [activeTab, setActiveTab] = useState("history");

  // Profile edit form state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    country: "",
    currentPassword: "",
    newPassword: "",
  });

  // Game history and loading
  const [gameHistory, setGameHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Search & filter controls for history list
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

  // Keep local auth user in sync (localStorage + AuthContext + optional callback)
  /*
    syncUser(nextUser)
    - Purpose: canonicalize an updated user object across the app after any
      profile-changing operation (profile update, avatar upload, etc.).
    - Side-effects:
      1. Writes the user JSON to `localStorage` under `AUTH_USER_KEY` so
         other tabs or simple reads can access the latest value.
      2. Calls `authContext.login(nextUser)` when available to update
         in-memory AuthContext (triggers UI updates across the app).
      3. Invokes `onUserUpdate` callback when provided (component-level
         hook consumer can react to changes).
    - Notes: this function is `useCallback`-wrapped to keep stable identity
      for dependents.
  */
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

  /*
    fetchProfile()
    - Fetches the authenticated user's profile from the backend and seeds
      the local form state used by the profile edit UI.
    - Loading semantics:
      - If there is no `authContext.user`, this call sets `loading=true` to
        show the global loading UI.
      - If a cached user exists, it sets `backgroundFetching=true` so the
        UI can indicate a subtle refresh without blocking the screen.
    - On success the returned user is synced via `syncUser` and the
      `formData` values are populated for editing.
    - Errors surface as a transient `message` using `showMessage`.
  */
  const fetchProfile = useCallback(async () => {
    try {
      // Only set loading=true initially if there is no user cached
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

  /*
    fetchGameHistory()
    - Retrieves the user's game history using the current `filters`.
    - The hook strips empty filter params before sending the request so the
      server receives only the meaningful keys.
    - Response is assigned to `gameHistory` and `historyLoading` toggles
      during the request lifecycle.
    - This function is `useCallback`-wrapped and used by an effect that
      triggers when filters change (or when a token is present).
  */
  const fetchGameHistory = useCallback(async () => {
    try {
      setHistoryLoading(true);
      const { result: _result, ...params } = { ...filters };
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
    // Initial load behavior
    // - If an authenticated user exists in context, show that cached
    //   information immediately and perform a background refresh so the
    //   UI appears responsive.
    // - If no user exists (cold start), block the UI with `loading=true`
    //   until the profile request completes.
    if (authContext?.user) {
      setLoading(false);
      setBackgroundFetching(true);
      fetchProfile().finally(() => setBackgroundFetching(false));
    } else {
      setLoading(true);
      fetchProfile().finally(() => setLoading(false));
    }
    // Intentionally run only once on mount; fetchProfile is stable via
    // useCallback. ESLint rule disabled above to avoid noisy dependency
    // arrays influencing behavior.
    // eslint-disable-next-line
  }, []);

  // Load history only when token is present
  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      fetchGameHistory();
    }
  }, [fetchGameHistory]);

  /*
    handleFormChange(e)
    - Simple helper used by controlled inputs in the Edit Profile tab.
    - Copies previous `formData` and updates the field with the input's
      `name` attribute. Keeps form inputs tightly bound to state.
  */
  const handleFormChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /*
    handleUpdateProfile(e)
    - Form submit handler. Builds a minimal `updateData` payload and
      conditionally includes password change fields only when `newPassword`
      is provided.
    - On success: syncs the returned user (so avatar, username, etc. are
      immediately available app-wide), clears password inputs, and shows a
      success message.
    - Errors are surfaced via `showMessage`.
  */
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

  /*
    handleAvatarUpload(e)
    - Accepts a file input event, uploads the selected avatar as
      multipart/form-data, then fetches the latest profile to ensure the
      app has the server-generated avatar (which may be transformed or
      stored as base64/url).
    - We intentionally re-fetch the whole profile after upload instead of
      trusting the avatar upload response alone to keep client/server
      state consistent.
  */
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

  /*
    handleSearchInputChange(value)
    - Keeps the typed value in `searchInput` for the UI and mirrors it to
      `search` which drives the `filteredGameHistory` memoized filter.
    - This separation allows the UI to show the typed input while the
      debounced or immediate search value can be managed separately if
      needed in the future.
  */
  const handleSearchInputChange = (value) => {
    setSearchInput(value);
    setSearch(value);
  };

  /*
    handleFilterChange(e)
    - Generic onChange handler for filter inputs. Merges the new filter key
      into `filters` while preserving other filter values.
  */
  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Toggle date sort order between `desc` and `asc` used by history fetch
  const toggleSortOrder = () => {
    setFilters((prev) => ({
      ...prev,
      sortOrder: prev.sortOrder === "desc" ? "asc" : "desc",
    }));
  };

  // Reset search and filters to defaults
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

  /*
    getSessionToken(game)
    - Utility to produce a compact session label used in the UI. Prefer a
      numeric `sessionNumber` when present (shows full number like `#123`),
      otherwise derive a short token from the last 4 chars of the session
      `_id` for human-friendly display.
  */
  const getSessionToken = useCallback((game = {}) => {
    const num = game?.sessionNumber;
    if (num != null) return `#${num}`;
    const id = String(game?._id || "").trim();
    return id ? `#${id.slice(-4).toUpperCase()}` : "";
  }, []);

  /*
    filteredGameHistory (memoized)
    - Applies client-side filtering for the history list using two
      dimensions:
      1. `filters.result` — allow filtering by result (win/lose/draw/aborted)
      2. `search` — live token/opponent search across the session token or
         opponent name
    - Using `useMemo` avoids recalculating the filtered list unless
      `gameHistory`, `search`, or `filters.result` change.
  */
  const filteredGameHistory = useMemo(() => {
    const query = String(search || "").trim().toLowerCase();
    const resultFilter = String(filters.result || "").trim().toLowerCase();

    return gameHistory.filter((game) => {
      if (resultFilter) {
        const gameResult = String(game?.result || "").trim().toLowerCase();
        if (gameResult !== resultFilter) return false;
      }

      if (!query) return true;

      const token = getSessionToken(game).toLowerCase();
      const opponent = String(game?.opponent || "").toLowerCase();
      return token.includes(query) || opponent.includes(query);
    });
  }, [gameHistory, search, filters.result, getSessionToken]);

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
