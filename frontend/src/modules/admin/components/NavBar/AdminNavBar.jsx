import styles from './AdminNavBar.module.css';
import { useContext } from 'react';
import { AuthContext } from '../../../../app/providers/AuthProvider.jsx';

const icons = {
    players: (
        <svg width="20" height="20" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="7" cy="7" r="4"/><path d="M17 17v-1a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v1"/><circle cx="17" cy="7" r="4"/></svg>
    ),
    rooms: (
        <svg width="20" height="20" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="7" width="7" height="7" rx="2"/><rect x="14" y="7" width="7" height="7" rx="2"/><path d="M7 7V3a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4"/></svg>
    )
};
const Navbar = ({ activeTab, onTabChange }) => {
    // Listen for custom logout event from header button
    if (typeof window !== 'undefined') {
        window.addEventListener('admin-logout', () => {
            const ctx = require('../../../../app/providers/AuthProvider.jsx');
            if (ctx && ctx.AuthContext && ctx.AuthContext._currentValue && ctx.AuthContext._currentValue.logout) {
                ctx.AuthContext._currentValue.logout();
            }
        });
    }

    return (
        <nav className={styles.adminNavbar}>
            <ul className={styles.navList}>
                <li
                    className={activeTab === 'players' ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink}
                    onClick={() => onTabChange('players')}
                >
                    <span style={{ display: 'flex', alignItems: 'center' }}>{icons.players}</span>
                    Player Management
                </li>
                <li
                    className={activeTab === 'rooms' ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink}
                    onClick={() => onTabChange('rooms')}
                >
                    <span style={{ display: 'flex', alignItems: 'center' }}>{icons.rooms}</span>
                    Game Rooms
                </li>
            </ul>
        </nav>
    );
};
export default Navbar;