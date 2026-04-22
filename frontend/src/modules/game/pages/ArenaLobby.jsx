import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useArena } from "../hooks/useArena.js";

export default function ArenaLobby() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token"); // Or your auth context
    const { rooms } = useArena(token);
    const [newRoomId, setNewRoomId] = useState("");

    // Route the user to the GameArena page with the selected Room ID
    const handleJoin = (roomId) => {
        navigate(`/game/${roomId}`);
    };

    // Route the user to a brand new Room ID
    const handleCreate = (e) => {
        e.preventDefault();
        if (newRoomId.trim()) {
            navigate(`/game/${newRoomId.trim()}`);
        }
    };

    return (
        <div className="lobby-container" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <h1>TicTacToang Arena</h1>
            
            <div className="create-room-section" style={{ marginBottom: '2rem', padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
                <h2>Create a New Game</h2>
                <form onSubmit={handleCreate} style={{ display: 'flex', gap: '10px' }}>
                    <input 
                        type="text" 
                        placeholder="Enter a custom Room Name..." 
                        value={newRoomId}
                        onChange={(e) => setNewRoomId(e.target.value)}
                        style={{ padding: '0.5rem', flex: 1 }}
                        required
                    />
                    <button type="submit" style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
                        Create Room
                    </button>
                </form>
            </div>

            <div className="active-rooms-section">
                <h2>Joinable Matches</h2>
                {rooms.length === 0 ? (
                    <p>No active rooms waiting for players. Create one above!</p>
                ) : (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {rooms.map((room) => (
                            <li key={room.id} style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                padding: '1rem', 
                                borderBottom: '1px solid #ddd',
                                alignItems: 'center'
                            }}>
                                <span><strong>Room:</strong> {room.id}</span>
                                <span>Players: {room.players}/2</span>
                                <button 
                                    onClick={() => handleJoin(room.id)}
                                    style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
                                >
                                    Join Match
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}