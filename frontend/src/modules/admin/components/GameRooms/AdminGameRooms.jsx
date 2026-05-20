import { useEffect, useState } from 'react';
import styles from './AdminGameRooms.module.css';
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

export default function AdminGameRooms({ rooms: initialRooms = [], refreshRooms }) {
    const [rooms, setRooms] = useState(initialRooms);
    const [q, setQ] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setRooms(initialRooms);
    }, [initialRooms]);

    const doRefresh = async () => {
        if (refreshRooms) return refreshRooms();
        setLoading(true);
        try {
            const res = await http.get(API_ROUTES.multiplayer.roomsActive);
            setRooms(res.data || res);
        } catch (err) {
            console.error('Failed to load rooms', err);
        } finally { setLoading(false); }
    }

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
        <section className={styles.wrapper}>
            <div className={styles.headerRow}>
                <h3>Online Game Rooms</h3>
                <div className={styles.controls}>
                    <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by room number or player..." />
                    <button onClick={doRefresh} className="btn primary">Refresh</button>
                </div>
            </div>
            <div className={styles.card}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Room Number</th>
                            <th>Player 1</th>
                            <th>Player 2</th>
                            <th>Start Time</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && <tr><td colSpan={6}>Loading...</td></tr>}
                        {!loading && filtered.length === 0 && <tr><td colSpan={6}>No active rooms</td></tr>}
                        {filtered.map(room => (
                            <tr key={room._id}>
                                <td>{room.roomNumber}</td>
                                <td>{room.player1?.username || '-'}</td>
                                <td>{room.player2?.username || '-'}</td>
                                <td>{formatTime(room.startTime)}</td>
                                <td>{room.status || '-'}</td>
                                <td>
                                    <button className="btn danger" onClick={() => handleClose(room._id)}>Close</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
