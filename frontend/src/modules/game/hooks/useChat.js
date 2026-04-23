/**
 * ============================================================================
 * USE CHAT HOOK (The Trash Talk Engine)
 * ============================================================================
 * Location: src/modules/game/hooks/useChat.jsx
 * Purpose: This hook manages the real-time communication between players.
 * It's essential for the "Toang" experience—allowing players to celebrate 
 * wins or discuss strategies during the match.
 * * Key Responsibilities:
 * 1. Message Sync: Sending and receiving text messages via WebSockets.
 * 2. History Management: Keeping a local buffer of the last X messages.
 * 3. Notification Logic: Tracking unread messages or "System" alerts.
 * 4. Cleanup: Ensuring listeners are removed when the match ends.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { io } from "socket.io-client";
import { SOCKET_BASE_URL } from "../../../config/api.config.js";

export const useChat = (roomId, token) => {
    // 1. Use a Ref instead of state for the socket instance
    const socketRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [chatError, setChatError] = useState(null);

    useEffect(() => {
        if (!roomId || !token) return;

        // 2. Initialize the external system (Socket)
        const socket = io(SOCKET_BASE_URL, {
            auth: { token },
        });

        socketRef.current = socket;

        // 3. Subscription logic: state updates ONLY happen in callbacks
        socket.emit("chat:join", { roomId });

        socket.on("chat:message", (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        socket.on("chat:error", (err) => {
            setChatError(err?.message || "Chat error");
            setTimeout(() => setChatError(null), 5000);
        });

        // 4. Cleanup on unmount
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [roomId, token]);

    // 5. Interaction: use the ref to send messages
    const sendMessage = useCallback((message) => {
        if (socketRef.current && message.trim()) {
            socketRef.current.emit("chat:send", { roomId, message });
        }
    }, [roomId]);

    return { messages, sendMessage, chatError };
};