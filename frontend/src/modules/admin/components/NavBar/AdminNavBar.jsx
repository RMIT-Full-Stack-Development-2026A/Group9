import'./AdminNavBar.css';
const Navbar = ({ activeTab, onTabChange }) => {

    return (
        <nav className="admin-navbar">
            <div className="nav-menu">
                <ul className="nav-list">
                    <li 
                        className={`nav-link ${activeTab === 'players' ? 'active' : ''}`}
                        onClick={() => onTabChange('players')}
                    >
                        Player Management
                    </li>
                    <li 
                        className={`nav-link ${activeTab === 'rooms' ? 'active' : ''}`}
                        onClick={() => onTabChange('rooms')}
                    >
                        Game Rooms
                    </li>
                </ul>
            </div>
        </nav>
    );
};
export default Navbar