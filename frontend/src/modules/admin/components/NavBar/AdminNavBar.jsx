import styles from './AdminNavBar.module.css';
import { useContext } from 'react';
import { AuthContext } from '../../../../app/providers/AuthProvider.jsx';

const icons = {
    players: <i className="bi bi-people" style={{ fontSize: 20, color: '#9ca3af' }}></i>,
    rooms: <i className="bi bi-diagram-3" style={{ fontSize: 20, color: '#9ca3af' }}></i>
};
const Navbar = ({ activeTab, onTabChange }) => {
    // Listen for custom logout event from header button
    const { logout } = useContext(AuthContext);
    if (typeof window !== 'undefined') {
        window.addEventListener('admin-logout', () => {
            if (logout) {
                logout();
                window.location.href = '/';
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