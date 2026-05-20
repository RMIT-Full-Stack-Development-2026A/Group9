import { useEffect, useState } from 'react';
// legacy module styles removed; layout now reuses PlayerTable styles
import playerStyles from '../PlayerTable/PlayerTable.module.css';
import { API_ROUTES } from '../../../../config/apiRoutes.js';
import { http } from '../../../../shared/utils/http.helper.js';

const formatTime = (iso) => {
    if (!iso) return '-';
    try {
        const d = new Date(iso);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
        return iso;
    }
}

const formatDate = (iso) => {
    if (!iso) return '-';
    try {
        const d = new Date(iso);
        return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    } catch { return iso; }
}

const formatDuration = (startIso, endIso) => {
    if (!startIso) return '-';
    const start = new Date(startIso).getTime();
    const end = endIso ? new Date(endIso).getTime() : Date.now();
    const diff = Math.max(0, end - start);
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    const rem = mins % 60;
    return `${hrs}h ${rem}m`;
}

export default function AdminGameRooms({ rooms: initialRooms = [] }) {
    const [rooms, setRooms] = useState(initialRooms);
    const [q, setQ] = useState('');

    useEffect(() => {
        setRooms(initialRooms);
    }, [initialRooms]);

    // Refresh is handled by parent hook via `refreshRooms` if provided

    const handleClose = async (roomId) => {
        if (!confirm('Close this room?')) return;
        try {
            await http.post(API_ROUTES.multiplayer.closeRoom(roomId));
            setRooms(r => r.filter(x => x._id !== roomId));
        } catch (err) { console.error('Close failed', err); }
    }

    const filtered = rooms.filter(r => {
        if (!q) return true;
        const s = q.toLowerCase();
        const roomNumber = r.roomNumber == null ? '' : String(r.roomNumber);
        const player1Name = r.player1?.username ? String(r.player1.username) : '';
        const player2Name = r.player2?.username ? String(r.player2.username) : '';
        return roomNumber.toLowerCase().includes(s) ||
            player1Name.toLowerCase().includes(s) ||
            player2Name.toLowerCase().includes(s);
    });

    return (
        <div className={playerStyles.adminCard}>
            <div className={playerStyles.adminCardHeader}>
                <div>
                    <h3 className={playerStyles.adminCardTitle}>Online Game Rooms</h3>
                    <div className={playerStyles.adminCardSubtitle}>Monitor and manage active game sessions</div>
                </div>
                <div className={playerStyles.searchBarContainer}>
                    <span className={playerStyles.searchIcon}><i className="bi bi-search"></i></span>
                    <input
                        type="text"
                        className={playerStyles.adminSearchInput}
                        placeholder="Search by room number or player..."
                        value={q}
                        onChange={e => setQ(e.target.value)}
                    />
                </div>
            </div>

            <div className={playerStyles.adminTableWrapper}>
                <table className={playerStyles.adminTable}>
                    <thead>
                        <tr>
                            <th className={playerStyles.adminTableThFirst}>Room Number</th>
                            <th>Player 1</th>
                            <th>Player 2</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Duration</th>
                            <th className={playerStyles.adminTableThLast}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 && <tr><td colSpan={7}>No active rooms</td></tr>}
                        {filtered.map(room => (
                            <tr key={room._id}>
                                <td className={playerStyles.adminTableUsername}>#{room.roomNumber || (room._id?.slice?.(0,8) || '-')}</td>
                                <td>
                                    <div>{room.player1?.username || 'Unknown'}</div>
                                    <div style={{ color: 'var(--color-muted)', fontSize: 12 }}>{room.player1?.email || ''}</div>
                                </td>
                                <td>
                                    <div>{room.player2?.username || '-'}</div>
                                    <div style={{ color: 'var(--color-muted)', fontSize: 12 }}>{room.player2?.email || ''}</div>
                                </td>
                                <td>{formatDate(room.startTime)}<div style={{ color: 'var(--color-muted)', fontSize: 12 }}>{formatTime(room.startTime)}</div></td>
                                <td>{formatDate(room.endTime)}<div style={{ color: 'var(--color-muted)', fontSize: 12 }}>{formatTime(room.endTime)}</div></td>
                                <td>{formatDuration(room.startTime, room.endTime)}</td>
                                <td>
                                    <button
                                        className={`${playerStyles.actionBtn} ${playerStyles.deactivate}`}
                                        onClick={() => handleClose(room._id)}
                                    >
                                        <i className="bi bi-x-lg" style={{ marginRight: 8 }}></i>
                                        Close
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
