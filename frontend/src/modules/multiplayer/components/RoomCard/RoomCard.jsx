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
	const statusLabel = room.status ? String(room.status).toLowerCase() : 'waiting';
	const gameTypeLabel = room.gameType || 'classic';

	return (
		<div className={styles.roomCard}>
			<div className={styles.topRow}>
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
						<div className={styles.detailRow}>
							<span className={styles.badge}>{capitalize(statusLabel)}</span>
							<span>{room.boardSize}x{room.boardSize}</span>
							<span>{gameTypeLabel}</span>
							{timeAgo && <span>{timeAgo}</span>}
						</div>
					</div>
				</div>
				<button className={styles.joinBtn} onClick={() => onJoin(room)} disabled={joining}>
					{joining ? 'Joining...' : 'Join'}
				</button>
			</div>
			<div className={styles.bottomRow}>
				<div className={styles.roomId}>
					Room: <span>{room._id}</span>
				</div>
			</div>
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

function capitalize(value) {
	return String(value).charAt(0).toUpperCase() + String(value).slice(1);
}
