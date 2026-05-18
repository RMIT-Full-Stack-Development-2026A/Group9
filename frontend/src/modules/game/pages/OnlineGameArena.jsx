import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../app/providers/useAuth.js";
import { useMultiplayer } from "../hooks/useMultiplayer.js";
import { useChat } from "../hooks/useChat.js";
import ArenaView from "../components/ArenaView/ArenaView.jsx";
import styles from "./ArenaPages.module.css";

export default function OnlineGameArena() {
	const location = useLocation();
	const navigate = useNavigate();
	const { user } = useAuth();

	const settings = location.state?.settings;
	const gameId = settings?.sessionId || settings?.roomId || null;
	const [showChat, setShowChat] = useState(true);
	const [chatInput, setChatInput] = useState("");

	const {
		board,
		boardSize,
		gameState,
		error: multiplayerError,
		isConnected,
		sendMove,
		leaveGame,
	} = useMultiplayer(gameId, user?.id, "X");

	const { messages, sendMessage, error: chatError } = useChat(
		null, // Socket will be provided by useMultiplayer
		gameId,
		user?.id,
		settings?.roomId
	);

	if (!settings) {
		return (
			<div className={styles.errorContainer}>
				<p>Invalid game settings. Redirecting...</p>
			</div>
		);
	}

	const handleCellClick = (idx) => {
		if (!isConnected || gameState.winner || gameState.draw) return;
		sendMove(idx);
	};

	const handleSendChat = () => {
		if (chatInput.trim()) {
			sendMessage(chatInput);
			setChatInput("");
		}
	};

	const handleAbort = () => {
		if (window.confirm("Are you sure you want to leave the game?")) {
			leaveGame();
			navigate("/lobby");
		}
	};

	const errorMessage = multiplayerError || chatError;

	return (
		<div className={styles.arenaContainer}>
			<div className={styles.arenaWrapper}>
				{/* Main Game Area */}
				<div className={styles.gameArea}>
					{!isConnected && (
						<div className={styles.connectionWarning}>
							<i className="bi bi-exclamation-circle"></i> Connecting to game server...
						</div>
					)}

					{errorMessage && (
						<div className={styles.errorBanner}>
							<i className="bi bi-exclamation-triangle"></i> {errorMessage}
						</div>
					)}

					<ArenaView
						matchData={{
							size: boardSize,
							p1Marker: settings.player1?.marker || "X",
							p2Marker: settings.player2?.marker || "O",
							player1Name: settings.player1?.name || "Player 1",
							player2Name: settings.player2?.name || "Opponent",
							player1Avatar: settings.player1?.avatar,
							player2Avatar: settings.player2?.avatar,
							gameType: "online",
						}}
						xIsNext={gameState.turn}
						resultName={gameState.winner || (gameState.draw ? "Draw" : null)}
						isLocked={gameState.isLoading || gameState.winner || gameState.draw}
						onCellClick={handleCellClick}
						onAbort={handleAbort}
						board={board}
						boardSize={boardSize}
					/>

					{gameState.isLoading && (
						<div className={styles.loadingOverlay}>
							<div className={styles.spinner}></div>
							<p>Waiting for opponent...</p>
						</div>
					)}
				</div>

				{/* Chat Sidebar */}
				{showChat && (
					<div className={styles.chatSidebar}>
						<div className={styles.chatHeader}>
							<h4>Chat</h4>
							<button
								className={styles.closeChat}
								onClick={() => setShowChat(false)}
								aria-label="Close chat"
							>
								<i className="bi bi-x"></i>
							</button>
						</div>

						<div className={styles.chatMessages}>
							{messages.length === 0 ? (
								<p className={styles.emptyChat}>No messages yet. Start chatting!</p>
							) : (
								messages.map((msg, idx) => (
									<div key={idx} className={`${styles.message} ${msg.isSystem ? styles.systemMessage : ""}`}>
										{msg.isSystem ? (
											<em>{msg.message}</em>
										) : (
											<>
												<strong>{msg.userId === user?.id ? "You" : "Opponent"}</strong>
												<p>{msg.message}</p>
												<span className={styles.timestamp}>
													{new Date(msg.timestamp).toLocaleTimeString()}
												</span>
											</>
										)}
									</div>
								))
							)}
						</div>

						<div className={styles.chatInput}>
							<input
								type="text"
								placeholder="Type a message..."
								value={chatInput}
								onChange={(e) => setChatInput(e.target.value)}
								onKeyPress={(e) => e.key === "Enter" && handleSendChat()}
								disabled={gameState.winner || gameState.draw}
							/>
							<button onClick={handleSendChat} disabled={!chatInput.trim()}>
								<i className="bi bi-send"></i>
							</button>
						</div>
					</div>
				)}

				{!showChat && (
					<button
						className={styles.openChat}
						onClick={() => setShowChat(true)}
						aria-label="Open chat"
					>
						<i className="bi bi-chat-dots"></i>
						{messages.length > 0 && <span className={styles.badge}>{messages.length}</span>}
					</button>
				)}
			</div>
		</div>
	);
}
