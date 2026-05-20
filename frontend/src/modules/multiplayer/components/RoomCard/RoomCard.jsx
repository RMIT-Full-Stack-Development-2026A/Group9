import React from 'react';
import styles from './RoomCard.module.css';

const MARKER_ICONS = {
	'X': '❌',
	'O': '⭕',
	'⭐': '⭐',
	'🔥': '🔥',
	'💎': '💎',
	'🌙': '🌙',
};

export default function RoomCard({ room, onJoin, joining }) {
	if (!room) return null;

	const player1 = room.player1 || {};
	const timeAgo = room.createdAt ? getTimeAgo(room.createdAt) : '';

	return (
		<div className={styles.roomCard}>
			<div className={styles.left}>
				<div className={styles.avatar}>
					{player1.avatar ? (
						<img src={player1.avatar} alt="" />
					) : (
						(player1.username || 'P')[0].toUpperCase()
					)}
				</div>
				<div className={styles.info}>
					<div className={styles.playerName}>{player1.username || 'Unknown'}</div>
					<div className={styles.details}>
						{room.boardSize}x{room.boardSize} &middot;{' '}
						{MARKER_ICONS[room.player1Marker] || room.player1Marker}
						{timeAgo && <> &middot; {timeAgo}</>}
					</div>
				</div>
			</div>
			<button className={styles.joinBtn} onClick={() => onJoin(room)} disabled={joining}>
				{joining ? 'Joining...' : 'Join'}
			</button>
		</div>
	);
}

function getTimeAgo(dateStr) {
	const diff = Date.now() - new Date(dateStr).getTime();
	const mins = Math.floor(diff / 60000);
	if (mins < 1) return 'just now';
	if (mins < 60) return `${mins}m ago`;
	const hours = Math.floor(mins / 60);
	if (hours < 24) return `${hours}h ago`;
	return `${Math.floor(hours / 24)}d ago`;
}
