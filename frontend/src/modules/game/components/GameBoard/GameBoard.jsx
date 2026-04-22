import React from "react";

export default function GameBoard({ board = [], onCellClick }) {
	const size = Math.sqrt(board.length) || 10;

	return (
		<div style={{ display: "grid", gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`, gap: "8px", padding: "12px", background: "#0f172a", borderRadius: "20px" }}>
			{board.map((cell, index) => (
				<button
					key={index}
					type="button"
					onClick={() => onCellClick?.(index)}
					style={{
						aspectRatio: "1",
						borderRadius: "14px",
						border: "1px solid rgba(148, 163, 184, 0.35)",
						background: cell ? "linear-gradient(135deg, #e2e8f0, #cbd5e1)" : "rgba(15, 23, 42, 0.78)",
						color: cell ? "#0f172a" : "#f8fafc",
						fontSize: "1.4rem",
						fontWeight: 800,
						cursor: cell ? "default" : "pointer",
						transition: "transform 120ms ease, box-shadow 120ms ease",
					}}
					disabled={Boolean(cell)}
				>
					{cell || ""}
				</button>
			))}
		</div>
	);
}