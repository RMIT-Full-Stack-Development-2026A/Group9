/**
 * ============================================================================
 * USE AI HOOK (The Virtual Opponent)
 * ============================================================================
 * Location: src/modules/game/hooks/useAI.js
 * Purpose: This hook provides the logic for a Single Player mode. It "watches"
 * the board and automatically triggers a move for the 'O' player after a 
 * short delay to simulate "thinking."
 * * Key Responsibilities:
 * 1. Automation: Detecting when it's the AI's turn.
 * 2. Strategy: Implementing algorithms (Random, Defensive, or Minimax).
 * 3. UX: Adding a 'thinking' delay so the AI doesn't move instantly.
 */

import { useEffect, useRef } from "react";

/**
 * Centralized AI-turn orchestrator for the game board.
 * Keeps AI trigger logic out of components and prevents double-fires.
 */
export default function useAI({
	enabled,
	session,
	turn,
	winner,
	draw,
	loading,
	board,
	lastPlayerMoveIdx,
	aiMarker,
	aiLevel,
	onAIMove,
	thinkingDelayMs = 250,
}) {
	const lastAiCompletedAtMoveCountRef = useRef(null);
	const aiRequestInFlightRef = useRef(false);

	useEffect(() => {
		if (!enabled) return;
		if (!session) return;
		if (winner || draw) return;
		if (turn !== "player2") return;
		if (loading) return;
		if (typeof onAIMove !== "function") return;

		const moveCount = Array.isArray(board)
			? board.filter((cell) => cell !== null && cell !== undefined).length
			: 0;

		// Prevent duplicate AI requests from strict mode / re-renders.
		// Retry is allowed if previous call failed for this same moveCount.
		if (aiRequestInFlightRef.current) return;
		if (lastAiCompletedAtMoveCountRef.current === moveCount) return;

		const timer = setTimeout(async () => {
			aiRequestInFlightRef.current = true;
			try {
				const result = await onAIMove(lastPlayerMoveIdx, aiMarker, aiLevel);
				if (result) {
					lastAiCompletedAtMoveCountRef.current = moveCount;
				}
			} finally {
				aiRequestInFlightRef.current = false;
			}
		}, thinkingDelayMs);

		return () => clearTimeout(timer);
	}, [
		enabled,
		session,
		turn,
		winner,
		draw,
		loading,
		board,
		lastPlayerMoveIdx,
		aiMarker,
		aiLevel,
		onAIMove,
		thinkingDelayMs,
	]);
}