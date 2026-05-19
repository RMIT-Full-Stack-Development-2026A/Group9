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
import { Outlet } from 'react-router-dom';
import PlayerTable from '../PlayerTable/PlayerTable.jsx';
import StatCard from '../StateCard/StateCard.jsx';
import { useAdmin } from '../../hooks/useAdmin.js';
import styles from './AdminDashboard.module.css';


export default function Admin() {
    const {
        activeTab,
        setActiveTab,
        players,
        setPlayers,
        metrics,
        loading,
        refreshDashboard
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
                        <br />
                    </div>
                    <button
                        className="logoutIconBtn"
                        type="button"
                        onClick={() => window.dispatchEvent(new CustomEvent('admin-logout'))}
                        aria-label="Logout"
                        style={{ marginLeft: 24 }}
                    >
                        <i className="bi bi-box-arrow-right" style={{ fontSize: 22 }}></i>
                    </button>
                </header>
                <AdminNavBar activeTab={activeTab} onTabChange={setActiveTab} />
                {activeTab === 'players' && (
                    <div className={styles.adminStatsRow}>
                        <StatCard label="Total Players" value={metrics.totalPlayers} color="#1ec9a7" bgColor="rgba(30, 201, 167, 0.12)" />
                        <StatCard label="Active Accounts" value={metrics.activeAccounts} color="#4CAF50" bgColor="rgba(76, 175, 80, 0.12)" />
                        <StatCard label="Premium Users" value={metrics.premiumUsers} color="#ffb300" bgColor="rgba(255, 179, 0, 0.12)" />
                        <StatCard label="Inactive Accounts" value={metrics.inactiveAccounts} color="#f44336" bgColor="rgba(244, 67, 54, 0.12)" />
                    </div>
                )}
                <main className={styles.adminMainContent}>
                    {activeTab === 'players' && (
                        <PlayerTable gamers={players} setgamers={setPlayers} refreshDashboard={refreshDashboard} />
                    )}
                    <Outlet />
                </main>
            </div>
        </div>
    );
}