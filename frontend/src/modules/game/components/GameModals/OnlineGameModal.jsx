import React, { useState, useContext, useEffect } from "react";
import SimpleModal from "../../../../shared/ui/SimpleModal.jsx";
import styles from "./GameModals.module.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../app/providers/AuthProvider.jsx";
import { adminService } from "../../../admin/services/admin.service.js";

export default function OnlineGameModal({ open, onClose }) {
	const { user } = useContext(AuthContext) || {};
	const navigate = useNavigate();

	const [tab, setTab] = useState("create"); // "create" or "join"
	const [rooms, setRooms] = useState([]);
	const [loadingRooms, setLoadingRooms] = useState(false);
	const [roomsError, setRoomsError] = useState(null);

	// Create room state
	const [boardSize, setBoardSize] = useState("10");
	const [player1Marker, setPlayer1Marker] = useState("X");
	const [creating, setCreating] = useState(false);
	const [createError, setCreateError] = useState(null);

	// Join room state
	const [selectedRoom, setSelectedRoom] = useState(null);
	const [joining, setJoining] = useState(false);
	const [joinError, setJoinError] = useState(null);

	const normalizeAuthUser = (raw) => {
		if (!raw || typeof raw !== "object") return null;
		let candidate = raw;
		if (candidate.data && typeof candidate.data === "object") {
			candidate = candidate.data;
		}
		if (candidate.user && typeof candidate.user === "object") {
			candidate = candidate.user;
		}
		if (candidate.account && typeof candidate.account === "object") {
			const account = candidate.account;
			const profile = candidate.profile && typeof candidate.profile === "object" ? candidate.profile : {};
			return {
				...account,
				avatar: profile.avatar || account.avatar || "",
			};
		}
		return candidate;
	};

	const currentUser = normalizeAuthUser(user);
	const player1DisplayName = currentUser?.username || currentUser?.name || currentUser?.email || "Player 1";

	// Fetch public rooms when join tab is selected
	useEffect(() => {
		if (tab === "join" && open) {
			fetchPublicRooms();
		}
	}, [tab, open]);

	const fetchPublicRooms = async () => {
		try {
			setLoadingRooms(true);
			setRoomsError(null);
			const response = await adminService.getRooms();
			// Filter only waiting rooms
			const waitingRooms = (response.data || response).filter(r => r.status === "waiting" && !r.player2);
			setRooms(waitingRooms);
		} catch (err) {
			setRoomsError(err.message || "Failed to fetch rooms");
			setRooms([]);
		} finally {
			setLoadingRooms(false);
		}
	};

	const handleCreateRoom = async () => {
		try {
			if (!boardSize || !player1Marker) {
				setCreateError("Please select board size and marker");
				return;
			}

			setCreating(true);
			setCreateError(null);

			// Call backend to create room
			const response = await fetch("/api/multiplayer/rooms", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("authToken")}`,
				},
				body: JSON.stringify({
					boardSize: parseInt(boardSize),
					player1Marker,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to create room");
			}

			const data = await response.json();
			const roomId = data.data?.roomId;

			if (!roomId) {
				throw new Error("No room ID returned");
			}

			// Navigate to online arena
			const settings = {
				gameType: "online",
				roomId,
				player1: {
					id: currentUser?._id || currentUser?.id,
					name: player1DisplayName,
					marker: player1Marker,
				},
				boardSize: parseInt(boardSize),
				boardStyle: "Classic",
				firstPlayer: "Player 1",
			};

			onClose && onClose();
			navigate("/online-arena", { state: { settings } });
		} catch (err) {
			setCreateError(err.message);
		} finally {
			setCreating(false);
		}
	};

	const handleJoinRoom = async (room) => {
		try {
			if (!room || !room.roomId) {
				setJoinError("Invalid room");
				return;
			}

			setJoining(true);
			setJoinError(null);

			// Call backend to join room
			const response = await fetch(`/api/multiplayer/rooms/${room.roomId}/join`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("authToken")}`,
				},
			});

			if (!response.ok) {
				throw new Error("Failed to join room");
			}

			const data = await response.json();
			const sessionId = data.data?.sessionId;
			const player2Marker = room.player1Marker === "X" ? "O" : "X";

			if (!sessionId) {
				throw new Error("No session ID returned");
			}

			// Navigate to online arena
			const settings = {
				gameType: "online",
				roomId: room.roomId,
				sessionId,
				player1: {
					id: room.player1.id,
					name: room.player1.name,
					marker: room.player1Marker,
				},
				player2: {
					id: currentUser?._id || currentUser?.id,
					name: player1DisplayName,
					marker: player2Marker,
				},
				boardSize: room.boardSize,
				boardStyle: "Classic",
				firstPlayer: "Player 1",
			};

			onClose && onClose();
			navigate("/online-arena", { state: { settings } });
		} catch (err) {
			setJoinError(err.message);
		} finally {
			setJoining(false);
		}
	};

	return (
		<SimpleModal open={open} onClose={onClose}>
			<div className={styles.modalContent}>
				<h2 className={styles.title}>
					<i className="bi bi-globe" style={{ color: "#06B6D4" }}></i> Online Game
				</h2>

				{/* Tabs */}
				<div className={styles.tabsContainer}>
					<button
						className={`${styles.tabButton} ${tab === "create" ? styles.activeTab : ""}`}
						onClick={() => setTab("create")}
					>
						Create Room
					</button>
					<button
						className={`${styles.tabButton} ${tab === "join" ? styles.activeTab : ""}`}
						onClick={() => setTab("join")}
					>
						Join Room
					</button>
				</div>

				{/* Create Room Tab */}
				{tab === "create" && (
					<div className={styles.tabContent}>
						<label className={styles.label}>Board Size</label>
						<select
							className={styles.input}
							value={boardSize}
							onChange={(e) => setBoardSize(e.target.value)}
						>
							<option value="10">10x10</option>
							<option value="15">15x15</option>
						</select>

						<label className={styles.label}>Your Marker</label>
						<div className={styles.markerGrid}>
							{["X", "O"].map((marker) => (
								<button
									key={marker}
									className={`${styles.markerOption} ${
										player1Marker === marker ? styles.selectedMarker : ""
									}`}
									onClick={() => setPlayer1Marker(marker)}
								>
									{marker}
								</button>
							))}
						</div>

						{createError && <div className={styles.errorMessage}>{createError}</div>}

						<button
							className={styles.startButton}
							onClick={handleCreateRoom}
							disabled={creating || !boardSize}
						>
							{creating ? "Creating..." : "Create & Wait for Opponent"}
						</button>
					</div>
				)}

				{/* Join Room Tab */}
				{tab === "join" && (
					<div className={styles.tabContent}>
						<div className={styles.roomsHeader}>
							<h3>Available Rooms</h3>
							<button
								className={styles.refreshButton}
								onClick={fetchPublicRooms}
								disabled={loadingRooms}
							>
								<i className="bi bi-arrow-clockwise"></i> Refresh
							</button>
						</div>

						{loadingRooms && <div className={styles.loadingMessage}>Loading rooms...</div>}

						{roomsError && <div className={styles.errorMessage}>{roomsError}</div>}

						{joinError && <div className={styles.errorMessage}>{joinError}</div>}

						{rooms.length === 0 && !loadingRooms && !roomsError && (
							<div className={styles.emptyMessage}>No available rooms. Create one to start!</div>
						)}

						<div className={styles.roomsList}>
							{rooms.map((room) => (
								<div
									key={room.roomId}
									className={`${styles.roomCard} ${
										selectedRoom?.roomId === room.roomId ? styles.selectedRoom : ""
									}`}
									onClick={() => setSelectedRoom(room)}
								>
									<div className={styles.roomCardContent}>
										<div className={styles.roomInfo}>
											<h4>{room.player1.name}</h4>
											<span className={styles.boardSizeTag}>{room.boardSize}x{room.boardSize}</span>
										</div>
										<button
											className={styles.joinButton}
											onClick={(e) => {
												e.stopPropagation();
												handleJoinRoom(room);
											}}
											disabled={joining}
										>
											{joining ? "Joining..." : "Join"}
										</button>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</SimpleModal>
	);
}
