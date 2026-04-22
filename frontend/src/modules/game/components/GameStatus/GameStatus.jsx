import React from "react";

export default function GameStatus({ opponentJoined, gameStarted, playerMark }) {
	const label = !opponentJoined
		? "Waiting for a second player"
		: !gameStarted
			? "Choose a mark to begin"
			: `You are playing as ${playerMark || "?"}`;

	return (
		<div style={{ marginBottom: "16px", padding: "16px 18px", borderRadius: "16px", background: "linear-gradient(135deg, #111827, #1f2937)", color: "#f8fafc" }}>
			<div style={{ fontSize: "0.8rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#94a3b8", marginBottom: "6px" }}>
				Arena Status
			</div>
			<div style={{ fontSize: "1.05rem", fontWeight: 700 }}>{label}</div>
		</div>
	);
}