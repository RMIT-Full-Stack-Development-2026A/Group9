import { useState } from 'react';
import styles from './PlayerTable.module.css';

const PlayerTable = ({ gamers, setgamers }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const toggleDeactivate = (pid) => {
        const updateGamers = gamers.map(p => {
            if (p.id === pid) {
                return { ...p, isDeactivated: !p.isDeactivated };
            }
            return p;
        });
        setgamers(updateGamers);
    };

    const filteredPlayers = gamers.filter(p => (
        p.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.email.toLowerCase().includes(searchQuery.toLowerCase())
    ));

    return (
        <div className={styles.adminCard}>
            <div className={styles.adminCardHeader}>
                <div>
                    <h3 className={styles.adminCardTitle}>All Players</h3>
                    <div className={styles.adminCardSubtitle}>View and manage player accounts</div>
                </div>
                <input
                    type="text"
                    className={styles.adminSearchInput}
                    placeholder="Search by username or email..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
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
                        {filteredPlayers.map(p => (
                            <tr key={p.id}>
                                <td className={styles.adminTableUsername}>{p.username}</td>
                                <td>{p.email}</td>
                                <td>
                                    {p.isPremium ? (
                                        <span className={styles.premiumBadge}>★ Premium</span>
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
                                <td>{p.joinedDate}</td>
                                <td>
                                    <button
                                        className={`${styles.actionBtn} ${p.isDeactivated ? styles.reactivate : styles.deactivate}`}
                                        onClick={() => toggleDeactivate(p.id)}
                                    >
                                        {p.isDeactivated ? 'Reactivate' : 'Deactivate'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PlayerTable;