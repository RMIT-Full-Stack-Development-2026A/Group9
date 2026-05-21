import styles from './ProfileCard.module.css';
import { useProfile } from '../../hooks/useProfile.js';
import usePayment from '../../../payment/hooks/usePayment.js';
import { useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../../app/providers/AuthProvider.jsx';
import { COUNTRIES } from "../../../../shared/constants/countries.js";
import Button from '../../../../shared/ui/Button/Button.jsx';
import Input from '../../../../shared/ui/Input/Input.jsx';
import ReplayModal from '../ReplayModal/ReplayModal.jsx';

/*
  ProfileCard
  - Purpose: present the user's profile dashboard composed by two hooks:
      `useProfile` (loads and manages profile & history state)
      `usePayment` (wallet / premium controls)
  - Key responsibilities:
      * Show profile summary (avatar, name, email, country)
      * Provide three main tabs: History, Edit Profile, Wallet
      * Surface transient UI messages and loading states
      * Open the replay modal (via `useReplay` returned from `useProfile`)
  - Important: this component is intentionally a hybrid — it wires
    container hooks to presentational pieces (inputs, buttons, modal).
    Keep UI-only concerns here; business logic and side-effects live in
    the hooks to make the component simpler to reason about and test.
*/
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
    handleSearchInputChange,
    handleFilterChange,
    toggleSortOrder,
    clearFilters,
    getSessionToken,
    replayOpen,
    replayLoading,
    replaySession,
    replayMoves,
    replayIndex,
    replayPlaying,
    openReplay,
    closeReplay,
    stepReplayForward,
    stepReplayBackward,
    jumpReplayStart,
    jumpReplayEnd,
    toggleReplayPlayback,
  } = useProfile(onUserUpdate);

  const {
    wallet,
    depositAmount,
    setDepositAmount,
    loading: walletLoading,
    message: walletMessage,
    handleDeposit,
    handleSubscribeWallet,
  } = usePayment();

  // Read requested tab from location.state (useful when navigating from elsewhere)
  // Explanation:
  // - Other parts of the app (for example a notification or call-to-action)
  //   may navigate to `/profile` and set `state.tab` to preselect a tab.
  // - We consume that value once on mount and then clear it (replace
  //   history state) to avoid re-triggering when the user navigates again.
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
      // Restore tab preference from localStorage for a persistent UX
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

  // Short-circuit rendering while profile data is loading or absent
  if (loading) return <div className={styles.profileLoading}>Loading profile...</div>;
  if (!user) return <div className={styles.profileLoading}>Please log in to view your profile.</div>;

  // Avatar handling: backend may return either:
  // - an object with `{ data: base64 }` for inline images, or
  // - a string URL (which we append a cache-busting query param to).
  // We intentionally avoid touching the server-side representation and
  // only craft a browser-friendly `avatarSrc` for the <img> element.
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
    // Small visual affordances to help users quickly identify session type
    if (gameType === 'Single Player') return <i className="bi bi-robot" title="Single Player" />;
    if (gameType === 'Two Players') return <i className="bi bi-display" title="Two Players" />;
    return <i className="bi bi-globe2" title="Online Match" />;
  };

  const getGameIconTone = (gameType) => {
    if (gameType === 'Single Player') return styles.sessionIconAi;
    if (gameType === 'Two Players') return styles.sessionIconLocal;
    return styles.sessionIconOnline;
  };

  const getGameTypeShort = (gameType) => {
    if (gameType === 'Single Player') return 'Single Player';
    if (gameType === 'Two Players') return 'Two Players';
    return 'Online Match';
  };

  const getSessionTokenLabel = (session) => getSessionToken(session);

  // Wallet/premium check (derived from payment hook)
  const isPremiumActive =
    Boolean(wallet?.premiumUntil) &&
    new Date(wallet.premiumUntil).getTime() > Date.now();

  const isAbortedSession = (session) => {
    const result = String(session?.result || session?.status || "").trim().toLowerCase();
    return result === 'aborted';
  };

  const getBadgeText = (session) => {
    const gameType = session?.gameType || '';
    const result = String(session?.result || "").trim();
    
    // For local multiplayer (Two Players), dynamically determine the winner
    if (getGameTypeShort(gameType) === 'Two Players') {
      if (result.toLowerCase() === 'win') {
        return 'P1 Win';
      } else if (result.toLowerCase() === 'lose') {
        return 'P2 Win';
      }
      // For Draw and Aborted, keep as-is
    }
    
    // For all other game types, return the result as-is
    return result;
  };

  // Main render: split into three vertical sections for clarity:
  // 1) Profile summary card (left)
  // 2) Tab selector (History / Edit / Wallet)
  // 3) Tab content area (controlled by `activeTab`)
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
            {/* Header row: name + optional premium badge */}
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
            {/* Secondary metadata: email and country */}
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

      {/* Tab selector — persisted selection is handled in effects above */}
      <div className={styles.profileTabs}>
        <button className={`${styles.tabBtn} ${activeTab === 'history' ? styles.active : ''}`} onClick={() => setActiveTab('history')}><i className="bi bi-clock-history"></i> History</button>
        <button className={`${styles.tabBtn} ${activeTab === 'edit' ? styles.active : ''}`} onClick={() => setActiveTab('edit')}><i className="bi bi-pencil"></i> Edit Profile</button>
        <button className={`${styles.tabBtn} ${activeTab === 'wallet' ? styles.active : ''}`} onClick={() => setActiveTab('wallet')}><i className="bi bi-wallet2"></i> Wallet</button>
      </div>

      <div className={styles.tabContent}>
        {/* Tab content area — rendered conditionally based on `activeTab` */}
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

              {/* Password change hint: empty fields mean 'no change' */}
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
            {/* First row: live search input */}
            <form
              className={styles.searchRow}
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <div className={styles.searchInputWrapper}>
                <span className={styles.searchIcon}>
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="search"
                  placeholder="Search by session ID or player name..."
                  value={searchInput}
                  onChange={e => handleSearchInputChange(e.target.value)}
                  className={styles.searchInput}
                  enterKeyHint="search"
                />
              </div>
              <div className={styles.searchHint}>Search updates instantly as you type.</div>
            </form>

            {/* Second row: filters and actions */}
            <div className={styles.filtersRow}>
              <select name="gameType" value={filters.gameType} onChange={handleFilterChange}>
                <option value="">All Types</option>
                <option value="single">Single Player</option>
                <option value="local">Two Player</option>
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
                    {/* Visual icon + tone for quick scanning */}
                    <div className={`${styles.sessionIcon} ${getGameIconTone(session.gameType)}`}>
                      {getGameIcon(session.gameType)}
                    </div>
                    <div className={styles.sessionInfo}>
                      <div className={styles.sessionTop}>
                        <span className={styles.sessionOpponent}>vs {session.opponent}</span>
                        <span className={`${styles.resultBadge} ${styles[session.result.toLowerCase()]}`}>{getBadgeText(session)}</span>
                      </div>
                      <div className={styles.sessionMeta}>
                        {/* Compact token, type, board size, and timestamps */}
                        <span className={styles.sessionToken}>{getSessionTokenLabel(session)}</span>
                        <span>{getGameTypeShort(session.gameType)}</span>
                        <span className={styles.metaSep}>{session.boardSize || '10'}x{session.boardSize || '10'}</span>
                        <span className={styles.metaSep}>{formatDate(session.startTime)}</span>
                        <span className={styles.metaSep}>{session.endTime ? formatDate(session.endTime) : 'In progress'}</span>
                      </div>
                    </div>
                    {!isAbortedSession(session) && (
                      <Button
                        className={styles.replayBtn}
                        type="button"
                        onClick={() => openReplay(session, isPremiumActive)}
                        disabled={replayLoading}
                      >
                        ▷ Replay
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <ReplayModal
          open={replayOpen}
          session={replaySession}
          moves={replayMoves}
          replayIndex={replayIndex}
          replayPlaying={replayPlaying}
          onClose={closeReplay}
          onJumpStart={jumpReplayStart}
          onStepBack={stepReplayBackward}
          onTogglePlay={toggleReplayPlayback}
          onStepForward={stepReplayForward}
          onJumpEnd={jumpReplayEnd}
        />

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

            {isPremiumActive ? (
              <div className={styles.premiumStatusBar}>
                <i className="bi bi-gem" style={{ marginRight: 6 }}></i> 
                Premium Active until {new Date(wallet.premiumUntil).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </div>
            ) : (
              <>
                <p className={styles.premiumCostText}>
                  Premium costs: <strong>$10 / month</strong>
                </p>
                <button
                  type="button"
                  className={styles.subscribeWalletBtn}
                  onClick={handleSubscribeWallet}
                  disabled={walletLoading}
                >
                  <i className="bi bi-gem" style={{ marginRight: 6 }}></i>
                  {walletLoading ? "Subscribing..." : "Subscribe with Wallet ($10)"}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;