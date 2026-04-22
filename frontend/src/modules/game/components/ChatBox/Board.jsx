import React, { useState } from "react";

export default function ChatBox({ messages = [], onSendMessage, error }) {
	const [draft, setDraft] = useState("");

	const handleSubmit = (event) => {
		event.preventDefault();
		if (!draft.trim()) {
			return;
		}

		onSendMessage?.(draft);
		setDraft("");
	};

	return (
		<div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: "520px", borderRadius: "20px", background: "rgba(255,255,255,0.95)", boxShadow: "0 18px 40px rgba(15, 23, 42, 0.12)", overflow: "hidden" }}>
			<div style={{ padding: "16px 18px", background: "linear-gradient(135deg, #0f172a, #1d4ed8)", color: "#fff" }}>
				<div style={{ fontSize: "0.8rem", letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.8 }}>Chat</div>
				<div style={{ fontSize: "1.05rem", fontWeight: 700 }}>Match Room</div>
			</div>

			<div style={{ flex: 1, padding: "16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px", background: "#f8fafc" }}>
				{messages.length === 0 ? (
					<div style={{ color: "#64748b", fontSize: "0.95rem" }}>No messages yet. Premium players can chat here.</div>
				) : (
					messages.map((message, index) => (
						<div key={`${message.timestamp || index}-${index}`} style={{ padding: "10px 12px", borderRadius: "14px", background: "white", border: "1px solid #e2e8f0" }}>
							<div style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: "4px" }}>{message.senderId || "System"}</div>
							<div style={{ fontSize: "0.95rem", color: "#0f172a" }}>{message.message}</div>
						</div>
					))
				)}
			</div>

			{error ? (
				<div style={{ padding: "0 16px 12px", color: "#b91c1c", fontSize: "0.9rem" }}>{error}</div>
			) : null}

			<form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px", padding: "16px", borderTop: "1px solid #e2e8f0", background: "#fff" }}>
				<input
					type="text"
					value={draft}
					onChange={(event) => setDraft(event.target.value)}
					placeholder="Type a message..."
					style={{ flex: 1, border: "1px solid #cbd5e1", borderRadius: "999px", padding: "0.8rem 1rem", outline: "none" }}
				/>
				<button type="submit" style={{ border: "none", borderRadius: "999px", padding: "0.8rem 1.2rem", background: "#1d4ed8", color: "white", fontWeight: 700, cursor: "pointer" }}>Send</button>
			</form>
		</div>
	);
}/**
 * ============================================================================
 * CHATBOX BOARD COMPONENT PURPOSE
 * ============================================================================
 * Purpose: UI component for rendering the ChatBox board/container in the Game
 * module. This file should contain React structure and interaction logic only.
 *
 * Teammate guidance:
 * 1) Keep presentational layout and event handlers here.
 * 2) Move API/state orchestration to hooks/services when needed.
 */

