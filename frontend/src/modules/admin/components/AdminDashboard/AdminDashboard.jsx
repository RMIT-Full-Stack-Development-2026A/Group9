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


import Navbar from '../components/Navbar/NavBar.jsx'; 
import PlayerTable from '../components/PlayerTable/PlayerTable.jsx';
import RoomTable from '../components/RoomTable/RoomTable.jsx';
import StatCard from '../components/StateCard/StateCard.jsx';
import { useAdmin } from '../hooks/useAdmin.js';


export default function Admin() {
   
    const { 
        activeTab, 
        setActiveTab, 
        players, 
        setPlayers, 
        rooms, 
        setRooms, 
        metrics, 
        loading 
    } = useAdmin();

    
    if (loading) {
        return (
            <div className="admin-loading" style={{ padding: '2rem', textAlign: 'center' }}>
                <h3>Loading System Data...</h3>
            </div>
        );
    }

   
    return (
        <div className="admin-dashboard-container" style={{ padding: '20px' }}>
            
           
            <header className="admin-header" style={{ marginBottom: '30px' }}>
                <h2 style={{ marginBottom: '20px' }}>Command Center</h2>
                <div className="stats-row" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <StatCard 
                        label="Total Players" 
                        value={metrics.totalPlayers} 
                        color="#4CAF50" 
                    />
                    <StatCard 
                        label="Active Rooms" 
                        value={metrics.activeRooms} 
                        color="#2196F3" 
                    />
                    <StatCard 
                        label="Server Load" 
                        value={metrics.serverLoad} 
                        color="#F44336" 
                    />
                </div>
            </header>

           
            <Navbar 
                activeTab={activeTab} 
                onTabChange={setActiveTab} 
            />

            
            <main className="admin-main-content" style={{ marginTop: '20px' }}>
                {activeTab === 'players' && (
                    <PlayerTable 
                        gamers={players} 
                        setgamers={setPlayers} 
                    />
                )}
                
                {activeTab === 'rooms' && (
                    <RoomTable 
                        curRooms={rooms} 
                        setRooms={setRooms} 
                    />
                )}
            </main>

        </div>
    );
}