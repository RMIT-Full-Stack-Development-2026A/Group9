import { useCallback, useEffect, useState } from 'react';
import * as api from './adminGameRooms.api.js';

export function useAdminGameRooms(initialRooms = [], parentRefresh) {
    const [rooms, setRooms] = useState(initialRooms || []);
    const [q, setQ] = useState('');

    const fetchRooms = useCallback(async () => {
        try {
            const data = await api.fetchActiveRooms();
            setRooms(Array.isArray(data) ? data : (data?.rooms ?? []));
        } catch (err) {
            console.error('Failed to fetch rooms', err);
        }
    }, []);

    useEffect(() => {
        if (!initialRooms || initialRooms.length === 0) {
            const t = setTimeout(() => { fetchRooms(); }, 0);
            return () => clearTimeout(t);
        }
        // No synchronous setState here — initialRooms is already used by useState initializer
    }, [initialRooms, fetchRooms]);

    const refresh = useCallback(async () => {
        await fetchRooms();
        if (typeof parentRefresh === 'function') parentRefresh();
    }, [fetchRooms, parentRefresh]);

    const handleClose = useCallback(async (roomId) => {
        if (!confirm('Close this room?')) return;
        try {
            await api.closeRoom(roomId);
            setRooms(r => r.filter(x => x._id !== roomId));
        } catch (err) {
            console.error('Close failed', err);
        }
    }, []);

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

    return {
        rooms,
        filtered,
        q,
        setQ,
        refresh,
        handleClose,
    };
}
