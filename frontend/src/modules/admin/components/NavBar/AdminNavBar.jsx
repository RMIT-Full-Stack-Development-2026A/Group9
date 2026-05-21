import styles from './AdminNavBar.module.css';

// Simple nav used by the AdminDashboard. Each item is a client-side tab
// that toggles the `activeTab` state in the parent. Kept keyboard-access
// considerations limited — this is a focused internal tool for moderators.
const icons = {
  players: <i className="bi bi-people" style={{ fontSize: 20, color: '#9ca3af' }}></i>
};
const Navbar = ({ activeTab, onTabChange }) => {
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
                    <span style={{ display: 'flex', alignItems: 'center' }}><i className="bi bi-grid-1x2" style={{ fontSize:20, color:'#9ca3af' }}></i></span>
                    Game Rooms
                </li>
            </ul>
        </nav>
    );
};
export default Navbar;