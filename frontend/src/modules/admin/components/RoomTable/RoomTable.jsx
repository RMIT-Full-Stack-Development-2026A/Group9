import React, { useState, useEffect, useCallback } from 'react';
import { adminService } from '../../services/admin.service';
import styles from './RoomTable.module.css';

export default function RoomTable() {
	const [rooms, setRooms] = useState([]);
	const [search, setSearch] = useState('');
	const [loading, setLoading] = useState(true);

	const fetchRooms = useCallback(async (query) => {
		setLoading(true);
		try {
			const res = query
				? await adminService.searchRooms(query)
				: await adminService.getRooms();
			setRooms(res.data?.data || res.data || []);
		} catch (err) {
			console.error('Failed to fetch rooms:', err);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchRooms();
		const interval = setInterval(() => fetchRooms(search), 5000);
		return () => clearInterval(interval);
	}, [fetchRooms, search]);

	const handleSearch = (e) => {
		e.preventDefault();
		fetchRooms(search);
	};

	const handleClose = async (roomId) => {
		if (!window.confirm('Close this room?')) return;
		try {
			await adminService.closeRoom(roomId);
			setRooms((prev) => prev.filter((r) => r._id !== roomId));
		} catch (err) {
			console.error('Failed to close room:', err);
		}
	};

	const formatDate = (d) => (d ? new Date(d).toLocaleString() : '—');

	if (loading && rooms.length === 0) {
		return <p className={styles.empty}>Loading rooms...</p>;
	}

	return (
		<div className={styles.container}>
			<form className={styles.searchRow} onSubmit={handleSearch}>
				<input
					type="text"
					placeholder="Search by room number or player name..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className={styles.searchInput}
				/>
				<button type="submit" className={styles.searchBtn}>Search</button>
			</form>

			{rooms.length === 0 ? (
				<p className={styles.empty}>No active rooms found.</p>
			) : (
				<table className={styles.table}>
					<thead>
						<tr>
							<th>Room #</th>
							<th>Player 1</th>
							<th>Player 2</th>
							<th>Status</th>
							<th>Board</th>
							<th>Start Time</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{rooms.map((room) => (
							<tr key={room._id}>
								<td>{room.roomNumber}</td>
								<td>{room.player1?.username || '—'}</td>
								<td>{room.player2?.username || 'Waiting...'}</td>
								<td className={styles[room.status]}>{room.status}</td>
								<td>{room.boardSize}x{room.boardSize}</td>
								<td>{formatDate(room.startTime)}</td>
								<td>
									<button
										className={styles.closeBtn}
										onClick={() => handleClose(room._id)}
									>
										Close
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
}
