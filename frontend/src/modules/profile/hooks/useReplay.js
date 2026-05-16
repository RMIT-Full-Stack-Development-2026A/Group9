import { useEffect, useState } from "react";
import * as profileService from "../services/profile.service.js";

export const useReplay = (showMessage) => {
  const [replayOpen, setReplayOpen] = useState(false);
  const [replayLoading, setReplayLoading] = useState(false);
  const [replaySession, setReplaySession] = useState(null);
  const [replayMoves, setReplayMoves] = useState([]);
  const [replayIndex, setReplayIndex] = useState(0);
  const [replayPlaying, setReplayPlaying] = useState(false);

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
      setReplaySession(data.session || session);
      setReplayMoves(Array.isArray(data.moves) ? data.moves : []);
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

  const toggleReplayPlayback = () => {
    setReplayPlaying((prev) => !prev);
  };

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
