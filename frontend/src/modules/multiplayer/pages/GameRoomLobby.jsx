import React, { useState, useContext, useCallback, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../app/providers/AuthProvider.jsx';
import RoomList from '../components/RoomList/RoomList';
import CreateRoomModal from '../components/CreateRoomModal/CreateRoomModal';
import JoinRoomModal from '../components/JoinRoomModal/JoinRoomModal';
import * as multiplayerApi from '../services/multiplayer.api.js';
import styles from './GameRoomLobby.module.css';

/*
  GameRoomLobby
  - Lobby page where authenticated users can see waiting rooms, create
	a new room, or join an existing one. Handles polling for rooms and
	direct-join by ID.
*/
export default function GameRoomLobby() {
	const { isAuthenticated, user } = useContext(AuthContext) || {};
	const navigate = useNavigate();
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [rooms, setRooms] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [joiningRoomId, setJoiningRoomId] = useState(null);
	const [joinRoom, setJoinRoom] = useState(null);
	const [roomIdInput, setRoomIdInput] = useState('');
	const [joinError, setJoinError] = useState('');
	const [joinLoading, setJoinLoading] = useState(false);

	// Redirect admins to admin UI
	if (user?.role === 'admin') {
		return <Navigate to="/admin" replace />;
	}

	// Fetch currently waiting rooms from the API
	const fetchRooms = useCallback(async () => {
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

	useEffect(() => {
		// Ensure user is logged in
		if (!isAuthenticated) {
			navigate('/login');
			return;
		}
		fetchRooms();
		const interval = setInterval(fetchRooms, 5000);
		return () => clearInterval(interval);
	}, [isAuthenticated, navigate, fetchRooms]);

	const handleJoin = (room) => {
		// Open join modal for selected room
		setJoiningRoomId(room._id);
		setJoinRoom(room);
	};

	const handleJoinById = async () => {
		const roomId = roomIdInput?.trim();
		if (!roomId) {
			setJoinError('Please enter a room ID to join.');
			return;
		}

		setJoinError('');
		setJoinLoading(true);
		try {
			const response = await multiplayerApi.getRoom(roomId);
			const room = response?.data || response;
			if (!room || !room._id) {
				throw new Error('Room not found');
			}
			setJoiningRoomId(room._id);
			setJoinRoom(room);
		} catch (err) {
			setJoinError(err.response?.data?.message || err.message || 'Room not found');
		} finally {
			setJoinLoading(false);
		}
	};

	return (
		<div className={styles.lobby}>
			<div className={styles.header}>
				<div className={styles.titleBlock}>
					<span className={styles.titleIcon}>
						<i className="bi bi-people-fill"></i>
					</span>
					<h1 className={styles.title}>Lobby</h1>
					<p className={styles.subtitle}>Join an open room or create your own</p>
				</div>

				<div className={styles.actionRow}>
					<button
						type="button"
						className={styles.refreshBtn}
						onClick={fetchRooms}
						disabled={loading}
					>
						<i className={`bi ${loading ? 'bi-arrow-repeat' : 'bi-arrow-clockwise'} ${loading ? styles.spinIcon : ''}`}></i>
						Refresh
					</button>
					<button className={styles.createBtn} type="button" onClick={() => setShowCreateModal(true)}>
						<i className="bi bi-plus-lg"></i> Create Room
					</button>
				</div>
			</div>

			<div className={styles.joinRow}>
				<input
					className={styles.joinInput}
					type="text"
					value={roomIdInput}
					onChange={(event) => setRoomIdInput(event.target.value)}
					placeholder="Paste a Room ID to join directly..."
				/>
				<button
					type="button"
					className={styles.joinDirectBtn}
					onClick={handleJoinById}
					disabled={joinLoading}
				>
					{joinLoading ? 'Joining...' : 'Join'}
				</button>
			</div>
			{joinError && <div className={styles.joinError}>{joinError}</div>}

			<RoomList
				rooms={rooms}
				loading={loading}
				error={error}
				onJoin={handleJoin}
				joiningRoomId={joiningRoomId}
			/>

			<CreateRoomModal open={showCreateModal} onClose={() => setShowCreateModal(false)} />
			<JoinRoomModal
				open={!!joinRoom}
				onClose={() => { setJoinRoom(null); setJoiningRoomId(null); }}
				room={joinRoom}
			/>
		</div>
	);
}
