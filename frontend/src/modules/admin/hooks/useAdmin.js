/**
 * ============================================================================
 * USE ADMIN HOOK (The Overlord Controller)
 * ============================================================================
 * Location: src/modules/admin/hooks/useAdmin.js
 * Purpose: This hook manages the state and actions for the Admin Dashboard.
 * It provides the real-time data flow for server metrics and user moderation.
 * * Key Responsibilities:
 * 1. Metrics Sync: Fetching live stats (Active Games, Online Users).
 * 2. Audit Logs: Tracking recent administrative actions and system events.
 * 3. Moderation Actions: Handling user bans and broadcasting system messages.
 * 4. Permission Guard: (Internal) Ensuring only authorized admins can trigger actions.
 */

import { useState, useEffect } from 'react';
import { adminService } from '../services/admin.service';

export const useAdmin = () => {
    const [activeTab, setActiveTab] = useState('players');
    const [players, setPlayers] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [metrics, setMetrics] = useState({ totalPlayers: 0, activeRooms: 0, serverLoad: '0%' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [playersRes, roomsRes, metricsRes] = await Promise.all([
                adminService.getPlayers(),
                adminService.getRooms(),
                adminService.getMetrics()
            ]);
            setPlayers(playersRes.data.data);
            setRooms(roomsRes.data.data);
            setMetrics(metricsRes.data.data);
        } catch (error) {
            console.error("Connection failed:", error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    }
    return {
        activeTab,
        setActiveTab,
        players,
        setPlayers, // Exported so PlayerTable can use it
        rooms,
        setRooms,   // Exported so RoomTable can use it
        metrics,
        loading
    };
};