import { useState } from 'react';
import { abortSession, createSession, makeAIMove, makeMove } from '../services/game.api.js';
import { buildSessionPayload, normalizeBackendGameType } from '../services/game.service.js';

/*
	useGame hook
	- Orchestrates the lifecycle of a single game session (create, move, AI
		move, abort). It keeps local UI state (board, turn, winner, loading,
		error) and exposes imperative actions that pages/components call.
	- Responsibilities and design notes:
		* All server interactions are wrapped with consistent loading/error
			state updates so the UI can disable interactions when necessary.
		* The hook returns the raw session and board state from the backend
			which makes it simpler to render replay/history views.
		* The hook intentionally does not implement optimistic updates — the
			server is the source of truth for board state to avoid divergence
			between clients in multiplayer scenarios.
*/
export function useGame(initialSessionData) {
	const [session, setSession] = useState(null);
	const [board, setBoard] = useState([]);
	const [turn, setTurn] = useState('player1'); // 'player1' | 'player2'
	const [winner, setWinner] = useState(null);
	const [winLine, setWinLine] = useState(null);
	const [draw, setDraw] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// Start a new session by sending normalized payload to backend.
	async function startSession(sessionData = initialSessionData) {
		console.log("startSession called with:", sessionData);
		setLoading(true);
		setError(null);
		try {
			const payload = buildSessionPayload(sessionData);
			const res = await createSession(payload);
			setSession(res.data.session);
			setBoard(res.data.session.board);
			// Who moves first is provided by the UI settings; default to player1
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

	// Play a move by sending the index and marker to the server, then
	// updating local UI state from the returned canonical board.
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

	// Ask the server to compute the AI's move and apply it. The helper returns
	// the server response to allow callers to inspect AI reasoning if needed.
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

	// Abort the current session and clear winners/draw flags locally.
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