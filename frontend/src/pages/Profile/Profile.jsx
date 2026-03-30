import { useProfile } from "./Profile.hook.js";
import { API_BASE_URL } from "../../config/api.config.js";
import "./Profile.css";

const Profile = () => {
  const {
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
  } = useProfile();

  if (loading) return <div className="profile-loading">Loading profile...</div>;
  if (!user) return <div className="profile-loading">Please log in to view your profile.</div>;

  const avatarSrc = user.avatar
    ? `${API_BASE_URL.replace("/api", "")}${user.avatar}`
    : null;

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString();
  };

  return (
    <div className="profile-page">
      {message.text && (
        <div className={`profile-message ${message.type}`}>{message.text}</div>
      )}

      {/* Profile Header */}
      <section className="profile-header">
        <div className="avatar-section">
          <div className="avatar-container">
            {avatarSrc ? (
              <img src={avatarSrc} alt="Avatar" className="avatar-img" />
            ) : (
              <div className="avatar-placeholder">
                {user.username?.charAt(0)?.toUpperCase() || "?"}
              </div>
            )}
          </div>
          <label className="avatar-upload-btn">
            Upload Logo
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              hidden
            />
          </label>
          <p className="avatar-hint">Image will be resized to 200x200px</p>
        </div>

        {/* Profile Edit Form */}
        <form className="profile-form" onSubmit={handleUpdateProfile}>
          <h2>Edit Profile</h2>

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
            <input
              id="country"
              name="country"
              type="text"
              value={formData.country}
              onChange={handleFormChange}
            />
          </div>

          <hr className="form-divider" />
          <h3>Change Password</h3>

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

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleFormChange}
            />
          </div>

          <button type="submit" className="save-btn" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </section>

      {/* Game History */}
      <section className="game-history-section">
        <h2>Game History</h2>

        {/* Search Bar */}
        <div className="history-controls">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by session # or player name..."
              value={search}
              onChange={handleSearch}
            />
          </div>

          {/* Filters */}
          <div className="filters-row">
            <select name="gameType" value={filters.gameType} onChange={handleFilterChange}>
              <option value="">All Game Types</option>
              <option value="single">Single Player</option>
              <option value="local">Two Players</option>
              <option value="online">Online Match</option>
            </select>

            <select name="result" value={filters.result} onChange={handleFilterChange}>
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
              placeholder="Start Date"
            />

            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              placeholder="End Date"
            />

            <button type="button" className="sort-btn" onClick={toggleSortOrder}>
              Date {filters.sortOrder === "desc" ? "↓" : "↑"}
            </button>

            <button type="button" className="clear-btn" onClick={clearFilters}>
              Clear
            </button>
          </div>
        </div>

        {/* History Table */}
        {historyLoading ? (
          <p className="history-loading">Loading game history...</p>
        ) : gameHistory.length === 0 ? (
          <p className="history-empty">No game sessions found.</p>
        ) : (
          <div className="table-wrapper">
            <table className="history-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Game Type</th>
                  <th>Opponent</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {gameHistory.map((session) => (
                  <tr key={session._id}>
                    <td>{session.sessionNumber}</td>
                    <td>{formatDate(session.startTime)}</td>
                    <td>{formatDate(session.endTime)}</td>
                    <td>{session.gameType}</td>
                    <td>{session.opponent}</td>
                    <td>
                      <span className={`result-badge ${session.result.toLowerCase()}`}>
                        {session.result}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default Profile;
