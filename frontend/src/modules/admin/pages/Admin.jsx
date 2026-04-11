/**
 * ============================================================================
 * ADMIN DASHBOARD PAGE (The Control Tower)
 * ============================================================================
 * Location: src/pages/Admin.jsx
 * Purpose: This page is the command center for TicTacToang moderators and 
 * administrators. It provides a high-level overview of system health and 
 * tools to manage the player base.
 * * CRITICAL RULE: Ensure this component is wrapped in an Authorization guard 
 * in your router to prevent standard players from accessing it.
 */

import Navbar from '../components/Navbar'; 
import PlayerTable from '../components/PlayerTable';
import RoomTable from '../components/RoomTable';
import StatCard from '../components/StatCard';
import { useAdmin } from '../modules/admin/hooks/useAdmin';


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