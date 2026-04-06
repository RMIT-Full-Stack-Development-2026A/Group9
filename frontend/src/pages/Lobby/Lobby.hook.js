import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import * as gameService from "../GameArena/GameArena.service.js";

export const useLobby = (user) => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [boardSize, setBoardSize] = useState(10);
  const [marker, setMarker] = useState("X");
  const [error, setError] = useState("");

  const fetchRooms = useCallback(async () => {
    try {
      const { data } = await gameService.getWaitingRooms();
      setRooms(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load rooms");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
    const interval = setInterval(fetchRooms, 5000);
    return () => clearInterval(interval);
  }, [fetchRooms]);

  const createRoom = useCallback(async () => {
    setCreating(true);
    setError("");
    try {
      const { data } = await gameService.createRoom({ boardSize, marker });
      navigate(`/game?mode=online&roomId=${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create room");
    } finally {
      setCreating(false);
    }
  }, [boardSize, marker, navigate]);

  const joinRoom = useCallback(async (roomId) => {
    setError("");
    try {
      await gameService.joinRoom(roomId);
      navigate(`/game?mode=online&roomId=${roomId}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to join room");
    }
  }, [navigate]);

  return {
    rooms, loading, creating, error,
    boardSize, setBoardSize,
    marker, setMarker,
    createRoom, joinRoom, fetchRooms,
  };
};
