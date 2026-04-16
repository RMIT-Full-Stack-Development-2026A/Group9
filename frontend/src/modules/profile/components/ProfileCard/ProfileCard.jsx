import styles from './ProfileCard.module.css';
import { useProfile } from '../../hooks/useProfile.js';
import usePayment from '../../../payment/hooks/usePayment.js';
import { useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../../app/providers/AuthProvider.jsx';
import { COUNTRIES } from "../../../../shared/constants/countries.js";
import Button from '../../../../shared/ui/Button/Button.jsx';
import Input from '../../../../shared/ui/Input/Input.jsx';

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

  const {
    wallet,
    depositAmount,
    setDepositAmount,
    loading: walletLoading,
    message: walletMessage,
    handleDeposit,
  } = usePayment();

  // Read tab from location.state (for navigation from Home)
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (location.state && location.state.tab) {
      if (location.state.tab !== activeTab) {
        setActiveTab(location.state.tab);
      }
      // Clear the state after using it so repeated navigation always works
      setTimeout(() => {
        navigate(location.pathname, { replace: true, state: {} });
      }, 0);
    } else {
      const savedTab = localStorage.getItem('profileActiveTab');
      if (savedTab && savedTab !== activeTab) {
        setActiveTab(savedTab);
      }
    }
    // eslint-disable-next-line
  }, [location.state, location.pathname]);

  useEffect(() => {
    if (activeTab) {
      localStorage.setItem('profileActiveTab', activeTab);
    }
  }, [activeTab]);

  if (loading) return <div className={styles.profileLoading}>Loading profile...</div>;
  if (!user) return <div className={styles.profileLoading}>Please log in to view your profile.</div>;

  // Avatar logic: handle base64 avatar from backend or URL (same as Navbar)
  let avatarSrc = "";
  if (user?.avatar) {
    if (typeof user.avatar === "object" && user.avatar.data) {
      avatarSrc = `data:image/png;base64,${user.avatar.data}`;
    } else if (typeof user.avatar === "string") {
      // Only append cache buster for URLs, not base64
      if (user.avatar.startsWith("data:image")) {
        avatarSrc = user.avatar;
      } else {
        avatarSrc = `${user.avatar}?t=${Date.now()}`;
      }
    }
  }
  const isValidImage = avatarSrc && (avatarSrc.startsWith("data:image") || avatarSrc.startsWith("http"));

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
    if (gameType === 'Single Player') return <i className="bi bi-robot" title="Single Player" />;
    if (gameType === 'Two Players') return <i className="bi bi-display" title="Two Players" />;
    return <i className="bi bi-globe2" title="Online Match" />;
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
              {isValidImage ? (
                <img src={avatarSrc} alt="Avatar" className={styles.avatarImg} />
              ) : (
                <span className={styles.avatarLetter}>{user.username?.charAt(0)?.toUpperCase() || '?'}</span>
              )}
            </div>
            <div className={styles.avatarEditIcon}><i className="bi bi-pencil"></i></div>
            <input type="file" accept="image/*" onChange={handleAvatarUpload} hidden />
          </label>
          <div className={styles.profileInfo}>
            <div className={styles.profileNameRow}>
              <h2>{user.username}</h2>
              {(() => {
                // Premium badge logic: show if premiumUntil is a valid future date
                if (user.premiumUntil) {
                  const until = new Date(user.premiumUntil);
                  if (!isNaN(until.getTime()) && until.getTime() > Date.now()) {
                    return (
                      <span className={styles.premiumBadge}>
                        <i className="bi bi-crown" style={{ marginRight: 4 }}></i>
                        <i className="bi bi-gem" style={{ marginRight: 4 }}></i>
                        Premium
                      </span>
                    );
                  }
                }
                return null;
              })()}
            </div>
            <p className={styles.profileEmail}>{user.email}</p>
            <p className={styles.profileCountry}>{user.country}</p>
          </div>
        </div>
        {!(user.premiumUntil && new Date(user.premiumUntil).getTime() > Date.now()) && (
          <Button
            className={styles.goPremiumBtn}
            color="var(--premium-orange)"
            textColor="#FFFF"
            icon={<i className="bi bi-gem" style={{ marginRight: 6 }}></i>}
            type="button"
            onClick={() => navigate('/payment')}
          >
            Go Premium
          </Button>
        )}
      </div>

      <div className={styles.profileTabs}>
        <button className={`${styles.tabBtn} ${activeTab === 'history' ? styles.active : ''}`} onClick={() => setActiveTab('history')}><i className="bi bi-clock-history"></i> History</button>
        <button className={`${styles.tabBtn} ${activeTab === 'edit' ? styles.active : ''}`} onClick={() => setActiveTab('edit')}><i className="bi bi-pencil"></i> Edit Profile</button>
        <button className={`${styles.tabBtn} ${activeTab === 'wallet' ? styles.active : ''}`} onClick={() => setActiveTab('wallet')}><i className="bi bi-wallet2"></i> Wallet</button>
      </div>

      <div className={styles.tabContent}>
        {activeTab === 'edit' && (
          <div className={styles.editPanel}>
            <form className={styles.editForm} onSubmit={handleUpdateProfile}>
              <div className={styles.formGroup}>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleFormChange}
                  required
                  label="Username"
                />
              </div>

              <div className={styles.formGroup}>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                  label="Email"
                />
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
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={handleFormChange}
                  label="Current Password"
                />
              </div>

              <div className={styles.formGroup}>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleFormChange}
                  label="New Password"
                />
              </div>

              <Button
                type="submit"
                className={styles.saveBtn}
                disabled={saving}
                color="var(--cyan)"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </div>
        )}

        {activeTab === 'history' && (

          <div className={styles.historyPanel}>
            {/* First row: search input and button */}
            <div className={styles.searchRow}>
              <div className={styles.searchInputWrapper}>
                <span className={styles.searchIcon}>
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  placeholder="Search by opponent name..."
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearchSubmit()}
                  className={styles.searchInput}
                />
              </div>
              <Button
                className={styles.searchBtn}
                type="button"
                onClick={handleSearchSubmit}
                color="var(--cyan)"
              >
                Search
              </Button>
            </div>

            {/* Second row: filters and actions */}
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
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className={styles.filterDateInput}
              />
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className={styles.filterDateInput}
              />
            </div>
            <div className={styles.filtersRow}>
              <Button
                type="button"
                className={`${styles.filterBtn} ${styles.dateBtn}`}
                onClick={toggleSortOrder}
              >
                Date {filters.sortOrder === 'desc' ? '↓' : '↑'}
              </Button>
              <Button
                type="button"
                className={`${styles.filterBtn} ${styles.clear}`}
                onClick={clearFilters}
              >
                Clear
              </Button>
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
                    <Button className={styles.replayBtn} type="button">▷ Replay</Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'wallet' && (
          <div className={styles.walletPanel}>
            {walletMessage.text && (
              <div className={`${styles.profileMessage} ${styles[walletMessage.type]}`}>{walletMessage.text}</div>
            )}
            <p className={styles.walletLabel}>Current Balance</p>
            <p className={styles.walletBalance}>${wallet.walletBalance}</p>

            <div className={styles.walletDepositRow}>
              <input
                type="number"
                placeholder="Amount (USD)"
                min="1"
                className={styles.walletDepositInput}
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
              />
              <button
                className={styles.walletDepositBtn}
                onClick={handleDeposit}
                disabled={walletLoading}
              >
                Deposit
              </button>
            </div>

            {wallet.premiumUntil && new Date(wallet.premiumUntil).getTime() > Date.now() ? (
              <div className={styles.premiumStatusBar}>
                <i className="bi bi-crown" style={{ marginRight: 6 }}></i>
                Premium Active until {new Date(wallet.premiumUntil).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </div>
            ) : (
              <div className={styles.premiumStatusBarExpired}>
                <i className="bi bi-crown" style={{ marginRight: 6 }}></i>
                Premium Active until &mdash;
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;