import React from 'react';
import RoomCard from '../RoomCard/RoomCard';
import styles from './RoomList.module.css';

// RoomList: presentational list rendering states (loading, error, empty)
export default function RoomList({ rooms, loading, error, onJoin, joiningRoomId }) {
	if (loading) {
		// Loading placeholder while API returns rooms
		return (
			<div className={styles.empty}>
				<i className="bi bi-arrow-repeat spin-icon"></i>
				<span>Loading rooms...</span>
			</div>
		);
	}

	if (error) {
		// Simple error UI
		return (
			<div className={styles.empty}>
				<i className="bi bi-exclamation-triangle"></i>
				<span>{error}</span>
			</div>
		);
	}

	if (!rooms || rooms.length === 0) {
		// Empty state when no rooms are waiting
		return (
			<div className={styles.empty}>
				<i className="bi bi-inbox"></i>
				<span>No rooms available. Create one!</span>
			</div>
		);
	}

	// Render list of RoomCards
	return (
		<div className={styles.roomList}>
			{rooms.map((room) => (
				<RoomCard
					key={room._id}
					room={room}
					onJoin={onJoin}
					joining={joiningRoomId === room._id}
				/>
			))}
		</div>
	);
}
