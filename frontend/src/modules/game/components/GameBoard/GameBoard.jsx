import React, { useEffect, useState } from "react";
import styles from "./GameBoard.module.css";
import { useGame } from "../../hooks/useGame.js";
import useAI from "../../hooks/useAI.js";

function GameBoard({
	player1,
	player2,
	boardSize,
	boardStyle,
	firstPlayer,
	onAbort,
	onGameEnd,
	aiLevel,
}) {
	const [lastPlayerMoveIdx, setLastPlayerMoveIdx] = useState(null);

	const sessionData = {
		gameType: aiLevel ? "ai" : "classic",
		boardSize,
		player2Name: player2.name,
		firstPlayer,
	};

	const {
		session,
		board,
		turn,
		winner,
		winLine,
		draw,
		loading,
		error,
		startSession,
		playMove,
		playAIMove,
	} = useGame(sessionData);

	useEffect(() => {
		startSession(sessionData);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useAI({
		enabled: Boolean(aiLevel),
		session,
		turn,
		winner,
		draw,
		loading,
		board,
		lastPlayerMoveIdx,
		aiMarker: player2.marker,
		aiLevel,
		onAIMove: playAIMove,
	});

	function handleCellClick(idx) {
		if (loading || winner || !session || board[idx]) return;
		if (aiLevel && turn === "player2") return;

		let marker;
		let playerId;
		if (turn === "player1") {
			marker = player1.marker;
			playerId = player1.id || "player1";
		} else {
			marker = player2.marker;
			playerId = player2.id || "player2";
		}
		if (playerId === "player1") setLastPlayerMoveIdx(idx);
		playMove(idx, marker, playerId);
	}

	return (
		<div>
			<div className={styles.playerInfo}>
				<span className={turn === "player1" ? styles.active : undefined}>
					<img src={player1.avatar} alt="avatar" className={styles.avatar} /> {player1.name} ({player1.marker})
				</span>
				<span>vs</span>
				<span className={turn === "player2" ? styles.active : undefined}>
					<img src={player2.avatar} alt="avatar" className={styles.avatar} /> {player2.name} ({player2.marker})
				</span>
			</div>
			<div className={`${styles.board} board-style-${boardStyle}`} style={{ gridTemplateColumns: `repeat(${boardSize}, 1fr)` }}>
				{Array(boardSize)
					.fill(0)
					.map((_, row) =>
						Array(boardSize)
							.fill(0)
							.map((_, col) => {
								const idx = row * boardSize + col;
								return (
									<div
										key={idx}
										className={`${styles.cell} ${winLine?.includes(idx) ? styles.cellWin : ""}`}
										onClick={() => handleCellClick(idx)}
									>
										{board && board[idx]}
									</div>
								);
							})
					)}
			</div>
			{winner && <div className={styles.result}>{winner === "draw" ? "Draw!" : `${winner} wins!`}</div>}
			{error && <div className={styles.result} style={{ color: "red" }}>{error}</div>}
			<button className={styles.abortBtn} onClick={onAbort}>Abort</button>
		</div>
	);
}

export default GameBoard;