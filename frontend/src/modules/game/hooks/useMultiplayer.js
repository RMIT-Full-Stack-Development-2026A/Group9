/**
 * ============================================================================
 * USE MULTIPLAYER HOOK (The Real-Time Sync)
 * ============================================================================
 * Location: src/modules/game/hooks/useMultiplayer.js
 * Purpose: This is the "Heart" of the online TicTacToang experience. It 
 * manages the WebSocket connection, synchronizes the board state between 
 * two remote players, and handles match-specific events.
 * * Key Responsibilities:
 * 1. Socket Management: Connecting/Disconnecting from the game namespace.
 * 2. Event Handling: Listening for 'move_made', 'player_joined', and 'game_over'.
 * 3. Latency Compensation: Optimistically updating the local UI before sync.
 * 4. Error Handling: Managing "Opponent Disconnected" scenarios.
 */

import { useEffect, useState, useCallback, useRef } from "react";
import { io } from "socket.io-client";

export const useMultiplayer = (roomId, token) => {
    // 1. Use a Ref for the socket instance to avoid cascading renders
    const socketRef = useRef(null);
    const [board, setBoard] = useState(Array(100).fill(null)); 
    const [error, setError] = useState(null);
    const [opponentJoined, setOpponentJoined] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [playerMark, setPlayerMark] = useState(null); // 'X' or 'O'   

    useEffect(() => {
        if (!roomId || !token) return;

        // 2. Initialize the socket (The External System)
        const socket = io(import.meta.env.REACT_APP_SOCKET_URL || "http://localhost:5000", {
            auth: { token },
        });

        socketRef.current = socket;

        // 3. Subscription logic: call setState ONLY in callbacks
        socket.emit("game:join", { roomId });

        socket.on("game:error", (err) => {
            setError(err.message); // This is okay because it's in a callback
        });

        socket.on("game:playerJoined", (data) => {
            setOpponentJoined(true);
            console.log("System Message:", data.message);
        });

        // Add a new listener in your useEffect
        socket.on("game:start", () => {
            setGameStarted(true);
        // You could also set whose turn it is here
        });

        socket.on("game:move", ({ move }) => {
            setBoard((prev) => {
                const newBoard = [...prev];
                newBoard[move.index] = move.mark;
                return newBoard;
            });

        socket.on("game:stateUpdate", (newState) => {
        // Both players receive the exact same board array from the server
            setBoard(newState.board);
        // You could also track whose turn it is here
        // setTurn(newState.nextTurn);
            });

        });

        socket.on("game:start", (data) => {
            setGameStarted(true);
            
            // Assign the correct mark based on who chose it
            if (socket.id === data.chooserSocketId) {
                setPlayerMark(data.chosenMark);
            } else {
                setPlayerMark(data.opponentMark);
            }
        });

        // Cleanup: Mandatory for external subscriptions
        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, [roomId, token]);

    const chooseMark = useCallback((mark) => {
        if (socketRef.current) {
            setPlayerMark(mark);
                socketRef.current.emit("game:chooseMark", { roomId, mark });
        }
    }, [roomId]);

    // 4. Use the ref to emit events
    const makeMove = useCallback((index) => {
        if (socketRef.current && board[index] === null && gameStarted && playerMark) {
            // Optimistic update
            setBoard((prev) => {
                const newBoard = [...prev];
                newBoard[index] = playerMark;
                return newBoard;
            });

            socketRef.current.emit("game:move", { roomId, move: { index, mark: playerMark } });
        }
    }, [roomId, board, gameStarted, playerMark]);

    return { 
        board, 
        makeMove, 
        error, 
        opponentJoined, 
        gameStarted, 
        playerMark, 
        chooseMark 
    };
};