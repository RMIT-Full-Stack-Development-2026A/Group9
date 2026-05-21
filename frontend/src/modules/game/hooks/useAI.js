import { useEffect, useRef } from "react";

/**
 * useAI
 * - Orchestrates when the AI should play to avoid embedding timing and
 *   duplicate-call logic inside UI components.
 * - Guards:
 *   1. Only triggers when `enabled` and session exists.
 *   2. Skips when there is a winner/draw or when it's not the AI's turn.
 *   3. Prevents duplicate in-flight requests via `aiRequestInFlightRef`.
 *   4. Prevents re-playing the same move count using
 *      `lastAiCompletedAtMoveCountRef` (useful with React strict mode).
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
	const sessionId = session?._id || null;

	// Reset per-session AI trigger guards so a new game starts cleanly.
	useEffect(() => {
		lastAiCompletedAtMoveCountRef.current = null;
		aiRequestInFlightRef.current = false;
	}, [sessionId, enabled]);

	useEffect(() => {
		if (!enabled) return;
		if (!session) return;
		if (winner || draw) return;
		if (turn !== "player2") return; // AI is always player2 in this design
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
					// Mark completed move count so subsequent renders won't re-fire
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