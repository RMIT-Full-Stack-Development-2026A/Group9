import styles from './AdminNavBar.module.css';
import { useContext } from 'react';
import { AuthContext } from '../../../../app/providers/AuthProvider.jsx';

const icons = {
    players: <i className="bi bi-people" style={{ fontSize: 20, color: '#9ca3af' }}></i>,
    rooms: <i className="bi bi-diagram-3" style={{ fontSize: 20, color: '#9ca3af' }}></i>
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