import { useEffect, useState } from "react";
import * as profileService from "../services/profile.service.js";

/*
  useReplay
  - Encapsulates replay UI state and controls for playing back match moves.
  - Responsibilities:
    - Request replay data for a session from the server.
    - Expose playback controls (step, jump, toggle play) and playback state.
    - Prevent non-premium or aborted matches from opening.
*/
export const useReplay = (showMessage) => {
  /*
    State:
    - replayOpen: whether the modal is visible
    - replayLoading: network request in-flight for moves/session
    - replaySession: metadata about the session (board size, timestamps)
    - replayMoves: ordered array of move objects { notation, marker }
    - replayIndex: current playback index (0 = before first move)
    - replayPlaying: playback boolean that drives the playback loop
  */
  const [replayOpen, setReplayOpen] = useState(false);
  const [replayLoading, setReplayLoading] = useState(false);
  const [replaySession, setReplaySession] = useState(null);
  const [replayMoves, setReplayMoves] = useState([]);
  const [replayIndex, setReplayIndex] = useState(0);
  const [replayPlaying, setReplayPlaying] = useState(false);

  /*
    openReplay(session, isPremiumActive)
    - Validations performed before requesting replay data:
      - Session must have an `_id`.
      - Aborted sessions are not replayable.
      - Replay access is gated to premium users (frontend check here,
        backend enforces real authorization).
    - After validation, fetches the session replay payload from
      `profileService.getSessionReplay` and initializes local playback state.
  */
  const openReplay = async (session, isPremiumActive) => {
    if (!session?._id) return;
    const sessionResult = String(session?.result || session?.status || "").trim().toLowerCase();
    if (sessionResult === "aborted") {
      showMessage("Aborted matches do not have replay", "error");
      return;
    }
    if (!isPremiumActive) {
      showMessage("Replay is available only for Premium users", "error");
      return;
    }
    try {
      setReplayLoading(true);
      const { data } = await profileService.getSessionReplay(session._id);
      // Use the server-provided session metadata when available to keep
      // client-side rendering consistent with backend canonical data.
      setReplaySession(data.session || session);
      setReplayMoves(Array.isArray(data.moves) ? data.moves : []);
      // Reset playback state: start at the beginning and paused
      setReplayIndex(0);
      setReplayPlaying(false);
      setReplayOpen(true);
    } catch (error) {
      showMessage(error?.response?.data?.message || "Failed to open replay", "error");
    } finally {
      setReplayLoading(false);
    }
  };

  const closeReplay = () => {
    setReplayPlaying(false);
    setReplayOpen(false);
  };

  const stepReplayForward = () => {
    setReplayIndex((prev) => Math.min(prev + 1, replayMoves.length));
  };

  const stepReplayBackward = () => {
    setReplayIndex((prev) => Math.max(prev - 1, 0));
  };

  const jumpReplayStart = () => {
    setReplayPlaying(false);
    setReplayIndex(0);
  };

  const jumpReplayEnd = () => {
    setReplayPlaying(false);
    setReplayIndex(replayMoves.length);
  };

  /*
    toggleReplayPlayback()
    - Flip playback between play and pause. The actual timed advancement is
      implemented in the effect below which responds to `replayPlaying`.
  */
  const toggleReplayPlayback = () => {
    setReplayPlaying((prev) => !prev);
  };

  /*
    Playback effect:
    - When `replayOpen` and `replayPlaying` are true, this effect schedules
      a timer to advance the `replayIndex` at a fixed interval (850ms).
    - The interval is deliberately conservative to give users time to see
      each move; it can be exposed as a setting later if needed.
    - When the index reaches the number of moves, playback auto-pauses.
    - The timeout is cleared on effect cleanup to avoid stale updates.
  */
  useEffect(() => {
    if (!replayOpen || !replayPlaying) return;
    if (replayIndex >= replayMoves.length) {
      setReplayPlaying(false);
      return;
    }
    const timer = setTimeout(() => {
      setReplayIndex((prev) => Math.min(prev + 1, replayMoves.length));
    }, 850);
    return () => clearTimeout(timer);
  }, [replayOpen, replayPlaying, replayIndex, replayMoves.length]);

  return {
    replayOpen,
    replayLoading,
    replaySession,
    replayMoves,
    replayIndex,
    replayPlaying,
    openReplay,
    closeReplay,
    stepReplayForward,
    stepReplayBackward,
    jumpReplayStart,
    jumpReplayEnd,
    toggleReplayPlayback,
  };
};
