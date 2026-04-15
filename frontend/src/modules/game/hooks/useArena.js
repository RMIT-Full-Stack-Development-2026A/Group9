import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

export const useArena = (token) => {
    const socketRef = useRef(null);
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        if (!token) return;

        // Connect specifically to get lobby data
        const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
            auth: { token },
        });
        socketRef.current = socket;

        // Ask the server for the list of rooms
        socket.emit("arena:getRooms");

        // Listen for the response
        socket.on("arena:roomsList", (roomList) => {
            // Only show rooms that aren't full (less than 2 players)
            const availableRooms = roomList.filter(room => room.players < 2);
            setRooms(availableRooms);
        });

        // Cleanup
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [token]);

    return { rooms };
};