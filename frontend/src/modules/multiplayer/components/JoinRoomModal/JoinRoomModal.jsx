import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleModal from '../../../../shared/ui/SimpleModal.jsx';
import styles from '../../../game/components/GameModals/GameModals.module.css';

const ALL_MARKERS = ['X', 'O', '⭐', '🔥', '💎', '🌙'];

export default function JoinRoomModal({ open, onClose, room }) {
	const navigate = useNavigate();
	const [marker, setMarker] = useState(null);

	if (!room) return null;

	const player1Marker = room.player1Marker || 'X';
	// Available markers exclude the one player 1 already picked
	const availableMarkers = ALL_MARKERS.filter((m) => m !== player1Marker);

	const handleJoin = () => {
		const chosenMarker = marker || availableMarkers[0];
		onClose && onClose();
		navigate(`/multiplayer/arena/${room._id}`, {
			state: { room, action: 'join', marker: chosenMarker },
		});
	};

	return (
		<SimpleModal open={open} onClose={onClose}>
			<div className={styles.modalContent}>
				<h2 className={styles.title}>
					<i className="bi bi-box-arrow-in-right" style={{ color: '#06B6D4' }}></i> Join Room
				</h2>

				<p style={{ color: 'var(--text-muted)', marginBottom: 16, textAlign: 'center' }}>
					vs <strong>{room.player1?.username || 'Unknown'}</strong>
					{' '}&middot;{' '}{room.boardSize}x{room.boardSize}
				</p>

				<label className={styles.label}>
					Choose Your Marker (Player 1 uses {player1Marker})
				</label>
				<div className={styles.markerRow}>
					{availableMarkers.map((opt) => (
						<button
							key={opt}
							className={marker === opt ? styles.markerSelected2 : styles.markerBtn}
							onClick={() => setMarker(opt)}
							type="button"
						>
							{opt}
						</button>
					))}
				</div>
				<div style={{ marginTop: 8, textAlign: 'center', color: '#06B6D4', fontWeight: 500 }}>
					{marker ? `Your marker: ${marker}` : 'Pick your marker'}
				</div>

				<button className={styles.startBtn} onClick={handleJoin}>
					Join Room
				</button>
			</div>
		</SimpleModal>
	);
}
