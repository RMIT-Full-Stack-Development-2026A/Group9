import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../app/providers/AuthProvider.jsx';
import RoomList from '../components/RoomList';
import CreateRoomModal from '../components/CreateRoomModal';
import * as multiplayerApi from '../services/multiplayer.api.js';
import styles from './GameRoomLobby.module.css';

export default function GameRoomLobby() {
	const { isAuthenticated } = useContext(AuthContext) || {};
	const navigate = useNavigate();
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [rooms, setRooms] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [joiningRoomId, setJoiningRoomId] = useState(null);

	const fetchRooms = React.useCallback(async () => {
		try {
			setError(null);
			const response = await multiplayerApi.getWaitingRooms();
			const data = Array.isArray(response) ? response : (response?.data || []);
			setRooms(data);
		} catch (err) {
			setError(err.response?.data?.message || err.message);
		} finally {
			setLoading(false);
		}
	}, []);

	React.useEffect(() => {
		if (!isAuthenticated) {
			navigate('/login');
			return;
		}
		fetchRooms();
		const interval = setInterval(fetchRooms, 5000);
		return () => clearInterval(interval);
	}, [isAuthenticated, navigate, fetchRooms]);

	const handleJoin = async (room) => {
		setJoiningRoomId(room._id);
		try {
			navigate(`/multiplayer/arena/${room._id}`, {
				state: { room, action: 'join' },
			});
		} catch (err) {
			setError(err.response?.data?.message || err.message);
		} finally {
			setJoiningRoomId(null);
		}
	};

	return (
		<div className={styles.lobby}>
			<div className={styles.header}>
				<h1 className={styles.title}>
					<i className="bi bi-globe" style={{ color: '#06B6D4' }}></i> Online Arena
				</h1>
				<button className={styles.createBtn} onClick={() => setShowCreateModal(true)}>
					<i className="bi bi-plus-lg"></i> Create Room
				</button>
			</div>

			<p className={styles.subtitle}>Join a room or create your own to play against others in real-time</p>

			<RoomList
				rooms={rooms}
				loading={loading}
				error={error}
				onJoin={handleJoin}
				joiningRoomId={joiningRoomId}
			/>

			<CreateRoomModal open={showCreateModal} onClose={() => setShowCreateModal(false)} />
		</div>
	);
}
