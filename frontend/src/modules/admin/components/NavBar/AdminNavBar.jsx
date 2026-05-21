import styles from './AdminNavBar.module.css';

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