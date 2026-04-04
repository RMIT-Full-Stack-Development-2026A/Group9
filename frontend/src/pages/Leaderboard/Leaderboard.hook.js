import { useState, useEffect, useCallback } from "react";
import * as leaderboardService from "./Leaderboard.service.js";

export const useLeaderboard = () => {
  const [ranks, setRanks] = useState([]);
  const [sortBy, setSortBy] = useState("wins");
  const [loading, setLoading] = useState(true);
  const [myRank, setMyRank] = useState(null);

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await leaderboardService.getLeaderboard(sortBy);
      setRanks(data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [sortBy]);

  const fetchMyRank = useCallback(async () => {
    try {
      const { data } = await leaderboardService.getMyRank();
      setMyRank(data);
    } catch {
      // not logged in or error
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  useEffect(() => {
    fetchMyRank();
  }, [fetchMyRank]);

  return { ranks, sortBy, setSortBy, loading, myRank };
};