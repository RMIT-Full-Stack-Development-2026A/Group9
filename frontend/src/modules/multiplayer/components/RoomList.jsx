import React from 'react';
import RoomCard from './RoomCard';
import styles from './RoomList.module.css';

export default function RoomList({ rooms, loading, error, onJoin, joiningRoomId }) {
	if (loading) {
		return (
			<div className={styles.empty}>
				<i className="bi bi-arrow-repeat spin-icon"></i>
				<span>Loading rooms...</span>
			</div>
		);
	}

	if (error) {
		return (
			<div className={styles.empty}>
				<i className="bi bi-exclamation-triangle"></i>
				<span>{error}</span>
			</div>
		);
	}

	if (!rooms || rooms.length === 0) {
		return (
			<div className={styles.empty}>
				<i className="bi bi-inbox"></i>
				<span>No rooms available. Create one!</span>
			</div>
		);
	}

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
