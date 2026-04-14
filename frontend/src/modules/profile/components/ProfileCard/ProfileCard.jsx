import styles from './ProfileCard.module.css';
import { useProfile } from '../../../hooks/useProfile.js';

const COUNTRIES = [
  'Australia','Brazil','Canada','China','France','Germany','India','Indonesia','Japan','South Korea','Mexico','Nigeria','Russia','Singapore','United Kingdom','United States','Vietnam'
];

const ProfileCard = ({ onUserUpdate }) => {
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
  } = useProfile(onUserUpdate);

  if (loading) return <div className={styles.profileLoading}>Loading profile...</div>;
  if (!user) return <div className={styles.profileLoading}>Please log in to view your profile.</div>;

  const avatarSrc = user.avatar || null;

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    const day = d.getDate();
    const mon = d.toLocaleString('en-US', { month: 'short' });
    const year = d.getFullYear();
    const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    return `${day} ${mon} ${year} ${time}`;
  };

  const getGameIcon = (gameType) => {
    if (gameType === 'Single Player') return '🤖';
    if (gameType === 'Two Players') return '🖥️';
    return '🌐';
  };

  const getGameTypeShort = (gameType) => {
    if (gameType === 'Single Player') return 'Single Player';
    if (gameType === 'Two Players') return 'Two Players';
    return 'Online Match';
  };

  return (
    <div className={styles.profilePage}>
      {message.text && (
        <div className={`${styles.profileMessage} ${styles[message.type]}`}>{message.text}</div>
      )}

      <div className={styles.profileCard}>
        <div className={styles.profileCardLeft}>
          <label className={styles.avatarWrapper}>
            <div className={styles.avatarCircle}>
              {avatarSrc ? (
                <img src={avatarSrc} alt="Avatar" className={styles.avatarImg} />
              ) : (
                <span className={styles.avatarLetter}>{user.username?.charAt(0)?.toUpperCase() || '?'}</span>
              )}
            </div>
            <div className={styles.avatarEditIcon}>✏️</div>
            <input type="file" accept="image/*" onChange={handleAvatarUpload} hidden />
          </label>
          <div className={styles.profileInfo}>
            <div className={styles.profileNameRow}>
              <h2>{user.username}</h2>
              {user.isPremium && <span className={styles.premiumBadge}>👑 Premium</span>}
            </div>
            <p className={styles.profileEmail}>{user.email}</p>
            <p className={styles.profileCountry}>{user.country}</p>
          </div>
        </div>
        {!user.isPremium && <button className={styles.goPremiumBtn}>👑 Go Premium</button>}
      </div>

      <div className={styles.profileTabs}>
        <button className={`${styles.tabBtn} ${activeTab === 'history' ? styles.active : ''}`} onClick={() => setActiveTab('history')}>🕘 History</button>
        <button className={`${styles.tabBtn} ${activeTab === 'edit' ? styles.active : ''}`} onClick={() => setActiveTab('edit')}>✏️ Edit Profile</button>
        <button className={`${styles.tabBtn} ${activeTab === 'wallet' ? styles.active : ''}`} onClick={() => setActiveTab('wallet')}>💰 Wallet</button>
      </div>

      <div className={styles.tabContent}>
        {activeTab === 'edit' && (
          <div className={styles.editPanel}>
            <form className={styles.editForm} onSubmit={handleUpdateProfile}>
              <div className={styles.formGroup}>
                <label htmlFor="username">Username</label>
                <input id="username" name="username" type="text" value={formData.username} onChange={handleFormChange} required />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" value={formData.email} onChange={handleFormChange} required />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="country">Country</label>
                <select id="country" name="country" value={formData.country} onChange={handleFormChange}>
                  <option value="">Select country</option>
                  {COUNTRIES.map((c) => (<option key={c} value={c}>{c}</option>))}
                </select>
              </div>

              <p className={styles.passwordHint}>change password (leave blank to keep current)</p>

              <div className={styles.formGroup}>
                <label htmlFor="currentPassword">Current Password</label>
                <input id="currentPassword" name="currentPassword" type="password" value={formData.currentPassword} onChange={handleFormChange} />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="newPassword">New Password</label>
                <input id="newPassword" name="newPassword" type="password" value={formData.newPassword} onChange={handleFormChange} />
              </div>

              <button type="submit" className={styles.saveBtn} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
            </form>
          </div>
        )}

        {activeTab === 'history' && (
          <div className={styles.historyPanel}>
            <div className={styles.searchRow}>
              <div className={styles.searchInputWrapper}>
                <span className={styles.searchIcon}>🔍</span>
                <input type="text" placeholder="Search by opponent name..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()} />
              </div>
              <button className={styles.searchBtn} type="button" onClick={handleSearchSubmit}>Search</button>
            </div>

            <div className={styles.filtersRow}>
              <select name="gameType" value={filters.gameType} onChange={handleFilterChange}>
                <option value="">All Types</option>
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

              <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} />
              <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} />

              <button type="button" className={styles.filterBtn} onClick={toggleSortOrder}>Date {filters.sortOrder === 'desc' ? '↓' : '↑'}</button>
              <button type="button" className={`${styles.filterBtn} ${styles.clear}`} onClick={clearFilters}>Clear</button>
            </div>

            {historyLoading ? (
              <p className={styles.historyEmpty}>Loading game history...</p>
            ) : gameHistory.length === 0 ? (
              <p className={styles.historyEmpty}>No game sessions found.</p>
            ) : (
              <div className={styles.sessionList}>
                {gameHistory.map((session) => (
                  <div className={styles.sessionCard} key={session._id}>
                    <div className={styles.sessionIcon}>{getGameIcon(session.gameType)}</div>
                    <div className={styles.sessionInfo}>
                      <div className={styles.sessionTop}>
                        <span className={styles.sessionOpponent}>vs {session.opponent}</span>
                        <span className={`${styles.resultBadge} ${styles[session.result.toLowerCase()]}`}>{session.result}</span>
                      </div>
                      <div className={styles.sessionMeta}>
                        <span className={styles.metaDot}>●</span>
                        <span>{getGameTypeShort(session.gameType)}</span>
                        <span className={styles.metaSep}>{session.boardSize || '15'}x{session.boardSize || '15'}</span>
                        <span className={styles.metaSep}>{formatDate(session.startTime)}</span>
                      </div>
                    </div>
                    <button className={styles.replayBtn}>▷ Replay</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'wallet' && (
          <div className={styles.walletPanel}>
            <p className={styles.walletPlaceholder}>Wallet feature coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
/**
 * ============================================================================
 * PROFILE CARD COMPONENT (The Player Identity)
 * ============================================================================
 * Location: src/modules/profile/components/ProfileCard.jsx
 * Purpose: This component acts as the visual identity for a player. It
 * displays their "Toang" rank, XP progress, and historical performance.
 * * Key Responsibilities:
 * 1. User Identity: Showing avatar, username, and join date.
 * 2. Rank Visualization: Displaying a progress bar for the next XP tier.
 * 3. Combat Stats: Showing total games played, wins, and losses.
 * 4. Customization: Providing an "Edit Profile" entry point.
 */