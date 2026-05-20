import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleModal from '../../../../shared/ui/SimpleModal.jsx';
import { AuthContext } from '../../../../app/providers/AuthProvider.jsx';
import styles from '../../../game/components/GameModals/GameModals.module.css';

export default function CreateRoomModal({ open, onClose }) {
	const { user } = useContext(AuthContext) || {};
	const navigate = useNavigate();

	const [boardSize, setBoardSize] = useState('10x10');
	const [boardStyle, setBoardStyle] = useState('Classic');
	const [marker, setMarker] = useState(null);
	const [firstPlayer, setFirstPlayer] = useState('Me');

	const markerOptions = ['X', 'O', '⭐', '🔥', '💎', '🌙'];
	const boardStyles = ['Classic', 'Retro', 'Space'];
	const boardSizes = ['10x10', '15x15'];
	const firstOptions = ['Me', 'Opponent'];

	const currentUser = user?.data || user?.user || user;
	const playerName = currentUser?.username || currentUser?.email || 'Player';

	const handleCreate = () => {
		const settings = {
			boardSize: boardSize === '10x10' ? 10 : 15,
			boardStyle,
			marker: marker || 'X',
			player1Name: playerName,
			firstPlayer,
		};
		onClose && onClose();
		navigate('/multiplayer/arena/new', { state: { settings } });
	};

	return (
		<SimpleModal open={open} onClose={onClose}>
			<div className={styles.modalContent}>
				<h2 className={styles.title}>
					<i className="bi bi-globe" style={{ color: '#06B6D4' }}></i> Create Online Room
				</h2>

				<label className={styles.label}>Board Size</label>
				<select className={styles.input} value={boardSize} onChange={(e) => setBoardSize(e.target.value)}>
					{boardSizes.map((size) => (
						<option key={size} value={size}>{size}</option>
					))}
				</select>

				<label className={styles.label}>Board Style</label>
				<select className={styles.input} value={boardStyle} onChange={(e) => setBoardStyle(e.target.value)}>
					{boardStyles.map((style) => (
						<option key={style} value={style}>{style}</option>
					))}
				</select>

				<label className={styles.label}>Choose Your Marker</label>
				<div className={styles.markerRow}>
					{markerOptions.map((opt) => (
						<button
							key={opt}
							className={marker === opt ? styles.markerSelected : styles.markerBtn}
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

				<label className={styles.label}>Who Goes First</label>
				<select className={styles.input} value={firstPlayer} onChange={(e) => setFirstPlayer(e.target.value)}>
					{firstOptions.map((opt) => (
						<option key={opt} value={opt}>{opt}</option>
					))}
				</select>

				<button className={styles.startBtn} onClick={handleCreate}>
					Create Room
				</button>
			</div>
		</SimpleModal>
	);
}
