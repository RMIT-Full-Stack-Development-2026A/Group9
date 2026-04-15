/**
 * ============================================================================
 * ADMIN DASHBOARD COMPONENT (The Overlord Console)
 * ============================================================================
 * Location: src/modules/admin/components/AdminDashboard.jsx
 * Purpose: This is the high-level command center for TicTacToang moderators.
 * It provides a bird's-eye view of server health, player activity, and 
 * suspicious behavior (anti-cheat).
 * * Key Responsibilities:
 * 1. System Metrics: Real-time display of active matches and socket connections.
 * 2. User Management: Tools to search, warn, or ban players.
 * 3. Game Monitoring: Viewing live "Toang" matches to ensure fair play.
 * 4. Database Stats: Overview of total users, matches played, and XP distributed.
 */



import AdminNavBar from '../NavBar/AdminNavBar.jsx';
import PlayerTable from '../PlayerTable/PlayerTable.jsx';
import RoomTable from '../RoomTable/RoomTable.jsx';
import StatCard from '../StateCard/StateCard.jsx';
import GameRoomStatCard from '../StateCard/GameRoomStatCard.jsx';
import { useAdmin } from '../../hooks/useAdmin.js';
import styles from './AdminDashboard.module.css';


export default function Admin() {
    const {
        activeTab,
        setActiveTab,
        players,
        setPlayers,
        rooms,
        setRooms,
        metrics,
        loading
    } = useAdmin();

    if (loading) {
        return (
            <div className={styles.adminLoading}>
                <h3>Loading System Data...</h3>
            </div>
        );
    }

    return (
        <div className={styles.adminDashboardBg}>
            <div className={styles.adminDashboardWrapper}>
                <header className={styles.adminHeader}>
                    <div className={styles.adminHeaderLeft}>
                        <img src="/logo.png" alt="Admin" className={styles.adminLogo} />
                        <span className={styles.adminTitle}>Admin Dashboard</span>
                        <span className={styles.adminBadge}>ADMIN</span>
                    </div>
                    <button
                        className="logoutIconBtn"
                        type="button"
                        onClick={() => { if (window.confirm('Log out of admin dashboard?')) window.dispatchEvent(new CustomEvent('admin-logout')); }}
                        aria-label="Logout"
                        style={{ marginLeft: 24 }}
                    >
                        <i className="bi bi-box-arrow-right" style={{ fontSize: 22 }}></i>
                    </button>
                </header>
                <AdminNavBar activeTab={activeTab} onTabChange={setActiveTab} />
                                {activeTab === 'players' && (
                                    <div className={styles.adminStatsRow}>
                                            <StatCard label="Total Players" value={metrics.totalPlayers} color="#1ec9a7" />
                                            <StatCard label="Active Accounts" value={metrics.activeAccounts} color="#4CAF50" />
                                            <StatCard label="Premium Users" value={metrics.premiumUsers} color="#ffb300" />
                                            <StatCard label="Inactive Accounts" value={metrics.inactiveAccounts} color="#f44336" />
                                    </div>
                                )}
                                {activeTab === 'rooms' && (
                                    <div className={styles.adminStatsRow}>
                                            <GameRoomStatCard label="Active Rooms" value={metrics.activeRooms} color="#fff" />
                                            <GameRoomStatCard label="Total Players Online" value={metrics.totalPlayersOnline} color="#00d1ff" />
                                            <GameRoomStatCard label="Avg. Session Time" value={metrics.avgSessionTime} color="#ff9800" />
                                            <GameRoomStatCard label="Games Today" value={metrics.gamesToday} color="#bfc9db" />
                                    </div>
                                )}
                <main className={styles.adminMainContent}>
                    {activeTab === 'players' && (
                        <PlayerTable gamers={players} setgamers={setPlayers} />
                    )}
                    {activeTab === 'rooms' && (
                        <RoomTable curRooms={rooms} setRooms={setRooms} />
                    )}
                </main>
            </div>
        </div>
    );
}