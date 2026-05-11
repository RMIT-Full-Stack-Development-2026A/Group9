import { useState } from 'react';
import { abortSession, createSession, makeAIMove, makeMove } from '../services/game.api.js';
import { buildSessionPayload, normalizeBackendGameType } from '../services/game.service.js';

// useGame hook: wires up backend session and move logic
export function useGame(initialSessionData) {
	const [session, setSession] = useState(null);
	const [board, setBoard] = useState([]);
	const [turn, setTurn] = useState('player1'); // 'player1' | 'player2'
	const [winner, setWinner] = useState(null);
	const [winLine, setWinLine] = useState(null);
	const [draw, setDraw] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// Start a new session
	async function startSession(sessionData = initialSessionData) {
		console.log("startSession called with:", sessionData);
		setLoading(true);
		setError(null);
		try {
			const payload = buildSessionPayload(sessionData);
			const res = await createSession(payload);
			setSession(res.data.session);
			setBoard(res.data.session.board);
			setTurn(sessionData?.firstPlayer === "Player 2" ? "player2" : "player1");
			setWinner(null);
			setWinLine(null);
			setDraw(false);
		} catch (err) {
			console.error("[useGame] createSession failed:", err?.response?.data || err);
			setError(
				err?.response?.data?.message ||
					err?.response?.data?.error ||
					err.message ||
					"Failed to create session"
			);
		} finally {
			setLoading(false);
		}
	}

	// Make a move
	async function playMove(idx, marker, playerId = "player1") {
		if (!session || winner || draw || loading) return;
		setLoading(true);
		setError(null);
		try {
			const res = await makeMove({
				sessionId: session._id,
				idx,
				marker,
				playerId,
			});
			setBoard(res.data.board);
			setWinner(res.data.winner);
			setWinLine(res.data.winLine || null);
			setDraw(res.data.draw);
			setTurn((prev) => (prev === "player1" ? "player2" : "player1"));
		} catch (err) {
			setError(
				err?.response?.data?.message ||
					err?.response?.data?.error ||
					err.message ||
					"Failed to make move"
			);
		} finally {
			setLoading(false);
		}
	}

	// Ask backend to compute + apply AI move
	async function playAIMove(lastPlayerMoveIdx, marker, aiLevel) {
		if (!session) return null;
		setLoading(true);
		setError(null);
		try {
			const res = await makeAIMove({
				sessionId: session._id,
				lastPlayerMoveIdx,
				marker,
				aiLevel,
			});
			setBoard(res.data.board);
			setWinner(res.data.winner);
			setWinLine(res.data.winLine || null);
			setDraw(res.data.draw);
			setTurn((prev) => (prev === "player1" ? "player2" : "player1"));
			return res.data;
		} catch (err) {
			setError(
				err?.response?.data?.message ||
					err?.response?.data?.error ||
					err.message ||
					"Failed to make AI move"
			);
			return null;
		} finally {
			setLoading(false);
		}
	}

	// Abort the current session on the backend
	async function abortCurrentSession() {
		if (!session) return null;
		setLoading(true);
		setError(null);
		try {
			const res = await abortSession({ sessionId: session._id });
			setSession(res.data.session || session);
			setWinner(null);
			setWinLine(null);
			setDraw(false);
			return res.data;
		} catch (err) {
			setError(
				err?.response?.data?.message ||
					err?.response?.data?.error ||
					err.message ||
					"Failed to abort session"
			);
			return null;
		} finally {
			setLoading(false);
		}
	}

	return {
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
		abortCurrentSession,
	};
}