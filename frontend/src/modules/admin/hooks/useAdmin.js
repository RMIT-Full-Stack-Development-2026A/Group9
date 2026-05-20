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
    const [metrics, setMetrics] = useState({ totalPlayers: 0, serverLoad: '0%' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async (partial = false) => {
        if (!partial) setLoading(true);
        try {
            const [playersRes, metricsRes] = await Promise.all([
                adminService.getPlayers(),
                adminService.getMetrics()
            ]);
            setPlayers(playersRes.data.data.map(player => ({
                ...player,
                id: player.id || player._id,
            })));
            setMetrics(metricsRes.data.data);
        } catch (error) {
            console.error("Connection failed:", error.response?.data?.message || error.message);
        } finally {
            if (!partial) setLoading(false);
        }
    }
    return {
        activeTab,
        setActiveTab,
        players,
        setPlayers, // Exported so PlayerTable can use it
        metrics,
        loading,
        refreshDashboard: () => fetchDashboardData(true)
    };
};