import { useState, useEffect, useCallback } from "react";
import * as adminService from "./Admin.service.js";

export const useAdmin = () => {
  const [tab, setTab] = useState("players");
  const [players, setPlayers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchPlayers = useCallback(async () => {
    try {
      const { data } = await adminService.getAllPlayers();
      setPlayers(data);
    } catch {
      // silent
    }
  }, []);

  const fetchRooms = useCallback(async () => {
    try {
      const params = searchQuery ? { search: searchQuery } : {};
      const { data } = await adminService.getAllGameRooms(params);
      setRooms(data);
    } catch {
      // silent
    }
  }, [searchQuery]);

  useEffect(() => {
    Promise.all([fetchPlayers(), fetchRooms()]).finally(() =>
      setLoading(false)
    );
  }, [fetchPlayers, fetchRooms]);

  const handleToggleStatus = useCallback(
    async (playerId, currentStatus) => {
      try {
        await adminService.togglePlayerStatus(playerId, !currentStatus);
        setPlayers((prev) =>
          prev.map((p) =>
            p._id === playerId ? { ...p, isActive: !currentStatus } : p
          )
        );
      } catch {
        // silent
      }
    },
    []
  );

  const handleCloseRoom = useCallback(
    async (roomId) => {
      try {
        await adminService.closeGameRoom(roomId);
        setRooms((prev) =>
          prev.map((r) =>
            r._id === roomId ? { ...r, status: "closed" } : r
          )
        );
      } catch {
        // silent
      }
    },
    []
  );

  const handleSearchRooms = useCallback(() => {
    fetchRooms();
  }, [fetchRooms]);

  return {
    tab,
    setTab,
    players,
    rooms,
    searchQuery,
    setSearchQuery,
    loading,
    handleToggleStatus,
    handleCloseRoom,
    handleSearchRooms,
  };
};
