import React, { useState } from "react";
import LocalGameModal from "../components/GameModals/LocalGameModal.jsx";
import AIGameModal from "../components/GameModals/AIGameModal.jsx";
import OnlineGameModal from "../components/GameModals/OnlineGameModal.jsx";
import styles from "./GameLobby.module.css";

export default function GameLobby() {
	const [showLocalModal, setShowLocalModal] = useState(false);
	const [showAIModal, setShowAIModal] = useState(false);
	const [showOnlineModal, setShowOnlineModal] = useState(false);

	return (
		<div className={styles.lobbyContainer}>
			<div className={styles.lobbyContent}>
				<h1 className={styles.title}>
					<i className="bi bi-controller" style={{ marginRight: "10px" }}></i>
					Choose Game Mode
				</h1>

				<div className={styles.gameModesGrid}>
					{/* Local Game Mode */}
					<div className={styles.gameModeCard}>
						<div className={styles.modeIcon}>
							<i className="bi bi-display"></i>
						</div>
						<h2>Local Game</h2>
						<p>Play against another player on the same device</p>
						<button
							className={styles.modeButton}
							onClick={() => setShowLocalModal(true)}
						>
							<i className="bi bi-play-fill"></i> Start Local Game
						</button>
					</div>

					{/* AI Game Mode */}
					<div className={styles.gameModeCard}>
						<div className={styles.modeIcon}>
							<i className="bi bi-robot"></i>
						</div>
						<h2>AI Game</h2>
						<p>Challenge the AI with difficulty levels: Easy, Medium, Hard</p>
						<button
							className={styles.modeButton}
							onClick={() => setShowAIModal(true)}
						>
							<i className="bi bi-play-fill"></i> Start AI Game
						</button>
					</div>

					{/* Online Game Mode */}
					<div className={styles.gameModeCard}>
						<div className={styles.modeIcon}>
							<i className="bi bi-globe"></i>
						</div>
						<h2>Online Game</h2>
						<p>Play against another player online in real-time</p>
						<button
							className={styles.modeButton}
							onClick={() => setShowOnlineModal(true)}
						>
							<i className="bi bi-play-fill"></i> Start Online Game
						</button>
					</div>
				</div>
			</div>

			{/* Modals */}
			<LocalGameModal
				open={showLocalModal}
				onClose={() => setShowLocalModal(false)}
			/>
			<AIGameModal
				open={showAIModal}
				onClose={() => setShowAIModal(false)}
			/>
			<OnlineGameModal
				open={showOnlineModal}
				onClose={() => setShowOnlineModal(false)}
			/>
		</div>
	);
}
