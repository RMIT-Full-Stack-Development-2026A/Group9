import { useProfile } from "./Profile.hook.js";
import "./Profile.css";

const COUNTRIES = [
  "Australia", "Brazil", "Canada", "China", "France", "Germany",
  "India", "Indonesia", "Japan", "South Korea", "Mexico", "Nigeria",
  "Russia", "Singapore", "United Kingdom", "United States", "Vietnam",
];

const Profile = ({ onUserUpdate }) => {
  const {
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
  } = useProfile();

  if (loading) return <div className="profile-loading">Loading profile...</div>;
  if (!user)
    return <div className="profile-loading">Please log in to view your profile.</div>;

  const avatarSrc = user.avatar || null;

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    const day = d.getDate();
    const mon = d.toLocaleString("en-US", { month: "short" });
    const year = d.getFullYear();
    const time = d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return `${day} ${mon} ${year} ${time}`;
  };

  const getGameIcon = (gameType) => {
    if (gameType === "Single Player") return "🤖";
    if (gameType === "Two Players") return "🖥️";
    return "🌐";
  };

  const getGameTypeShort = (gameType) => {
    if (gameType === "Single Player") return "Single Player";
    if (gameType === "Two Players") return "Two Players";
    return "Online Match";
  };

  const handleProfileSubmit = async (e) => {
    await handleUpdateProfile(e);
    if (onUserUpdate) {
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          onUserUpdate(JSON.parse(stored));
        } catch {
          /* ignore */
        }
      }
    }
  };

  return (
    <div className="profile-page">
      {message.text && (
        <div className={`profile-message ${message.type}`}>{message.text}</div>
      )}

      {/* Profile Header Card */}
      <div className="profile-card">
        <div className="profile-card-left">
          <label className="avatar-wrapper">
            <div className="avatar-circle">
              {avatarSrc ? (
                <img src={avatarSrc} alt="Avatar" className="avatar-img" />
              ) : (
                <span className="avatar-letter">
                  {user.username?.charAt(0)?.toUpperCase() || "?"}
                </span>
              )}
            </div>
            <div className="avatar-edit-icon">✏️</div>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              hidden
            />
          </label>
          <div className="profile-info">
            <div className="profile-name-row">
              <h2>{user.username}</h2>
              {user.isPremium && (
                <span className="premium-badge">👑 Premium</span>
              )}
            </div>
            <p className="profile-email">{user.email}</p>
            <p className="profile-country">{user.country}</p>
          </div>
        </div>
        {!user.isPremium && (
          <button className="go-premium-btn">👑 Go Premium</button>
        )}
      </div>

      {/* Tabs */}
      <div className="profile-tabs">
        <button
          className={`tab-btn ${activeTab === "history" ? "active" : ""}`}
          onClick={() => setActiveTab("history")}
        >
          🕘 History
        </button>
        <button
          className={`tab-btn ${activeTab === "edit" ? "active" : ""}`}
          onClick={() => setActiveTab("edit")}
        >
          ✏️ Edit Profile
        </button>
        <button
          className={`tab-btn ${activeTab === "wallet" ? "active" : ""}`}
          onClick={() => setActiveTab("wallet")}
        >
          💰 Wallet
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {/* ===== EDIT PROFILE TAB ===== */}
        {activeTab === "edit" && (
          <div className="edit-panel">
            <form className="edit-form" onSubmit={handleProfileSubmit}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="country">Country</label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleFormChange}
                >
                  <option value="">Select country</option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <p className="password-hint">
                change password (leave blank to keep current)
              </p>

              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={handleFormChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleFormChange}
                />
              </div>

              <button type="submit" className="save-btn" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        )}

        {/* ===== HISTORY TAB ===== */}
        {activeTab === "history" && (
          <div className="history-panel">
            {/* Search */}
            <div className="search-row">
              <div className="search-input-wrapper">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search by opponent name..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
                />
              </div>
              <button
                className="search-btn"
                type="button"
                onClick={handleSearchSubmit}
              >
                Search
              </button>
            </div>

            {/* Filters */}
            <div className="filters-row">
              <select
                name="gameType"
                value={filters.gameType}
                onChange={handleFilterChange}
              >
                <option value="">All Types</option>
                <option value="single">Single Player</option>
                <option value="local">Two Players</option>
                <option value="online">Online Match</option>
              </select>

              <select
                name="result"
                value={filters.result}
                onChange={handleFilterChange}
              >
                <option value="">All Results</option>
                <option value="win">Win</option>
                <option value="lose">Lose</option>
                <option value="draw">Draw</option>
                <option value="aborted">Aborted</option>
              </select>

              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
              />

              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
              />

              <button
                type="button"
                className="filter-btn"
                onClick={toggleSortOrder}
              >
                Date {filters.sortOrder === "desc" ? "↓" : "↑"}
              </button>

              <button
                type="button"
                className="filter-btn clear"
                onClick={clearFilters}
              >
                Clear
              </button>
            </div>

            {/* Sessions */}
            {historyLoading ? (
              <p className="history-empty">Loading game history...</p>
            ) : gameHistory.length === 0 ? (
              <p className="history-empty">No game sessions found.</p>
            ) : (
              <div className="session-list">
                {gameHistory.map((session) => (
                  <div className="session-card" key={session._id}>
                    <div className="session-icon">
                      {getGameIcon(session.gameType)}
                    </div>
                    <div className="session-info">
                      <div className="session-top">
                        <span className="session-opponent">
                          vs {session.opponent}
                        </span>
                        <span
                          className={`result-badge ${session.result.toLowerCase()}`}
                        >
                          {session.result}
                        </span>
                      </div>
                      <div className="session-meta">
                        <span className="meta-dot">●</span>
                        <span>{getGameTypeShort(session.gameType)}</span>
                        <span className="meta-sep">
                          {session.boardSize || "15"}x{session.boardSize || "15"}
                        </span>
                        <span className="meta-sep">
                          {formatDate(session.startTime)}
                        </span>
                      </div>
                    </div>
                    <button className="replay-btn">▷ Replay</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== WALLET TAB ===== */}
        {activeTab === "wallet" && (
          <div className="wallet-panel">
            <p className="wallet-placeholder">Wallet feature coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
