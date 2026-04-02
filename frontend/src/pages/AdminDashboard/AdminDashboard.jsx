import { useState } from "react";
import PlayerTable from "./PlayerTable/PlayerTable";
import StatCard from "./StatCard/StatCard";
import players from "./PlayerTable/players";
import rooms from "./RoomTable/rooms";
import './AdminDashboard.css';
import Navbar from "./Navbar/Navbar";
import RoomTable from "./RoomTable/RoomTable";
const AdminDashboard = () => {

    const[curRooms,setRooms] = useState(rooms);

    const [gamers, setGamers] = useState(players);

    const [currentTab, setCurrentTab] = useState("players");

    const totalPlayers = gamers.length;
    const activeAccounts = gamers.filter(p => !p.isDeactivated).length;
    const premiumUsers = gamers.filter(p => p.isPremium).length;
    const inactiveAccounts = gamers.filter(p => p.isDeactivated).length;

    const totalRooms = curRooms.length;
    const totalPlayerOnline= gamers.filter(p => !p.isDeactivated).length;
    const avarageSessinTime = (rooms.reduce(((sum , r) => sum + r.duration ),0))/rooms.length;
    const gameToday = gamers.filter(p => p.isDeactivated).length;

    return (
        <div className="dashboard">
            <h5 className="pageTitle">Admin Dashboard</h5>
            <Navbar activeTab={currentTab} onTabChange={setCurrentTab} />
            <div className="content-container">
                {currentTab === "players" ? (
                    <>
                        <div className="stats-grid">
                            <StatCard label="Total Players" value={totalPlayers} />
                            <StatCard label="Active Accounts" value={activeAccounts} color="#2ecc71" />
                            <StatCard label="Premium Users" value={premiumUsers} color="#f1c40f" />
                            <StatCard label="Inactive Accounts" value={inactiveAccounts} color="#95a5a6" />
                        </div>

                        <PlayerTable gamers={gamers} setGamers={setGamers} />

                    </>
                ) : (
                    <div>
                        <>

                        <div className="stats-grid">
                            <StatCard label="Total Rooms" value={totalRooms} />
                            <StatCard label="Total Online Player" value={totalPlayerOnline} color="#2ecc71" />
                            <StatCard label="Average Session Time" value={avarageSessinTime} color="#f1c40f" />
                            <StatCard label="Game Today" value={gameToday} color="#95a5a6" />
                        </div>

                        <RoomTable curRooms={curRooms} setRooms={setRooms} />
                        </>
                    </div>
                )}

            </div>



        </div>
    );
};

export default AdminDashboard