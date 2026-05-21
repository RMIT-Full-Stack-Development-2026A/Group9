import { useState } from 'react';
import { adminService } from '../../services/admin.service';
import styles from './PlayerTable.module.css';

const PlayerTable = ({ gamers, setgamers, refreshDashboard }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const toggleDeactivate = async (pid) => {
        try {
            await adminService.togglePlayerStatus(pid);
            if (typeof refreshDashboard === "function") {
                await refreshDashboard();
            }
        } catch (err) {
            // Keep UI simple: on error, inform the admin and allow retry.
            alert("Failed to update player status.");
        }
    };

    const filteredPlayers = gamers.filter(p => (
        p.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.email.toLowerCase().includes(searchQuery.toLowerCase())
    ));

    // Helper to format date for clarity
    function formatDate(dateStr) {
        if (!dateStr) return '—';
        const d = new Date(dateStr);
        if (isNaN(d)) return dateStr;
        const day = d.getDate().toString().padStart(2, '0');
        const mon = d.toLocaleString('en-US', { month: 'short' });
        const year = d.getFullYear();
        const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
        return `${day} ${mon} ${year}, ${time}`;
    }

    // `filteredPlayers` narrowing: ensures case-insensitive searching by
    // username or email. This client-side filtering is fast for typical
    // admin datasets; if the player list grows very large, consider
    // server-side search with pagination to avoid memory/CPU pressure.

    return (
        <div className={styles.adminCard}>
            <div className={styles.adminCardHeader}>
                <div>
                    <h3 className={styles.adminCardTitle}>All Players</h3>
                    <div className={styles.adminCardSubtitle}>View and manage player accounts</div>
                </div>
                <div className={styles.searchBarContainer}>
                    <span className={styles.searchIcon}>
                        <i className="bi bi-search"></i>
                    </span>
                    <input
                        type="text"
                        className={styles.adminSearchInput}
                        placeholder="Search by username or email..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            <div className={styles.adminTableWrapper}>
                <table className={styles.adminTable}>
                    <thead>
                        <tr>
                            <th className={styles.adminTableThFirst}>Username</th>
                            <th>Email</th>
                            <th>Premium Status</th>
                            <th>Account Status</th>
                            <th>Joined Date</th>
                            <th className={styles.adminTableThLast}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPlayers.map(p => {
                            const playerId = p.id || p._id;
                            return (
                                <tr key={playerId}>
                                    <td className={styles.adminTableUsername}>{p.username}</td>
                                    <td>{p.email}</td>
                                <td>
                                    {p.isPremium ? (
                                        <span className={styles.premiumBadge}>
                                            <i className="bi bi-gem"></i> Premium
                                        </span>
                                    ) : (
                                        <span className={styles.freeBadge}>Free</span>
                                    )}
                                </td>
                                <td>
                                    <span className={styles.statusWrap}>
                                        <span className={`${styles.statusDot} ${p.isActive ? styles.statusActive : styles.statusInactive}`}></span>
                                        {p.isActive ? (
                                            <span className={styles.statusTextActive}>Active</span>
                                        ) : (
                                            <span className={styles.statusTextInactive}>Inactive</span>
                                        )}
                                    </span>
                                </td>
                                <td>{formatDate(p.joinedDate)}</td>
                                <td>
                                    <button
                                        className={`${styles.actionBtn} ${!p.isActive ? styles.reactivate : styles.deactivate}`}
                                        onClick={() => toggleDeactivate(playerId)}
                                    >
                                        {!p.isActive ? (
                                            <>
                                                <i className="bi bi-person-check" style={{ marginRight: 8, fontSize: 22, verticalAlign: 'middle' }}></i>
                                                Reactivate
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-person-x" style={{ marginRight: 8, fontSize: 22, verticalAlign: 'middle' }}></i>
                                                Deactivate
                                            </>
                                        )}
                                    </button>
                                </td>
                            </tr>
                        ); })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PlayerTable;