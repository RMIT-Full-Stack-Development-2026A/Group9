import styles from './AdminNavBar.module.css';
import { useContext } from 'react';
import { AuthContext } from '../../../../app/providers/AuthProvider.jsx';

const icons = {
	players: <i className="bi bi-people" style={{ fontSize: 20, color: '#9ca3af' }}></i>,
	rooms: <i className="bi bi-globe" style={{ fontSize: 20, color: '#9ca3af' }}></i>,
};

const TABS = [
	{ key: 'players', label: 'Player Management', icon: icons.players },
	{ key: 'rooms', label: 'Game Rooms', icon: icons.rooms },
];

const Navbar = ({ activeTab, onTabChange }) => {
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
				{TABS.map((tab) => (
					<li
						key={tab.key}
						className={
							activeTab === tab.key
								? `${styles.navLink} ${styles.navLinkActive}`
								: styles.navLink
						}
						onClick={() => onTabChange(tab.key)}
					>
						<span style={{ display: 'flex', alignItems: 'center' }}>
							{tab.icon}
						</span>
						{tab.label}
					</li>
				))}
			</ul>
		</nav>
	);
};
export default Navbar;
