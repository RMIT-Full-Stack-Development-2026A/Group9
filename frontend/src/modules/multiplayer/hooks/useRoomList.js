import { useState, useEffect, useCallback } from 'react';
import * as multiplayerApi from '../../services/multiplayer.api.js';

export function useRoomList() {
	const [rooms, setRooms] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchRooms = useCallback(async () => {
		try {
			setError(null);
			const response = await multiplayerApi.getWaitingRooms();
			setRooms(response.data || response || []);
		} catch (err) {
			setError(err.response?.data?.message || err.message);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchRooms();
		// Poll every 5 seconds for new rooms
		const interval = setInterval(fetchRooms, 5000);
		return () => clearInterval(interval);
	}, [fetchRooms]);

	return { rooms, loading, error, refresh: fetchRooms };
}
