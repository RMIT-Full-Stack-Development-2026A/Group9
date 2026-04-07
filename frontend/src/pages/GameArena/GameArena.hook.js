import { useState, useCallback, useEffect, useRef } from "react";
import * as gameService from "./GameArena.service.js";
import { connectSocket, disconnectSocket } from "../../services/socket.service.js";

const WIN_LENGTH = 5;

const DIRECTIONS = [
  [0, 1], [1, 0], [1, 1], [1, -1],
];

const BOARD_STYLES = [
  { name: "Classic", bg: "#1a2332", border: "#2d3a4a", cellBg: "#0f1724" },
  { name: "Forest", bg: "#1a2e1a", border: "#2d4a2d", cellBg: "#0f1f0f" },
  { name: "Ocean", bg: "#1a2333", border: "#2d3a5a", cellBg: "#0f1730" },
];

const AVAILABLE_MARKERS = ["X", "O", "△", "□", "◇", "★"];

export const useGameArena = (user) => {
  // Setup state
  const [gamePhase, setGamePhase] = useState("setup"); // setup | playing | ended
  const [gameMode, setGameMode] = useState("local"); // local | single | online
  const [boardSize, setBoardSize] = useState(10);
  const [boardStyle, setBoardStyle] = useState(0);
  const [player1Marker, setPlayer1Marker] = useState("X");
  const [player2Marker, setPlayer2Marker] = useState("O");
  const [player2Name, setPlayer2Name] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [firstPlayer, setFirstPlayer] = useState("player1");

  // Game state
  const [board, setBoard] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [winner, setWinner] = useState(null);
  const [winningCells, setWinningCells] = useState(null);
  const [isDraw, setIsDraw] = useState(false);
  const [isAborted, setIsAborted] = useState(false);
  const [moveCount, setMoveCount] = useState(0);
  const [sessionId, setSessionId] = useState(null);
  const [showWinAnimation, setShowWinAnimation] = useState(false);
  const [lastMove, setLastMove] = useState(null);
  const [aiThinking, setAiThinking] = useState(false);

  // Online state
  const [roomId, setRoomId] = useState(null);
  const [roomData, setRoomData] = useState(null);
  const [myPlayerNumber, setMyPlayerNumber] = useState(null);
  const [waitingForOpponent, setWaitingForOpponent] = useState(false);
  const [opponentLeft, setOpponentLeft] = useState(false);

  const moveCountRef = useRef(0);
  const boardRef = useRef([]);
  const socketRef = useRef(null);
  const myPlayerNumberRef = useRef(null);
  const roomIdRef = useRef(null);
  const gamePhaseRef = useRef("setup");

  // Keep refs in sync
  useEffect(() => { boardRef.current = board; }, [board]);
  useEffect(() => { myPlayerNumberRef.current = myPlayerNumber; }, [myPlayerNumber]);
  useEffect(() => { roomIdRef.current = roomId; }, [roomId]);
  useEffect(() => { gamePhaseRef.current = gamePhase; }, [gamePhase]);

  const createEmptyBoard = useCallback((size) => {
    return Array.from({ length: size }, () => Array(size).fill(null));
  }, []);

  const checkWin = useCallback((board, row, col, marker) => {
    const size = board.length;
    for (const [dr, dc] of DIRECTIONS) {
      const cells = [[row, col]];
      for (let i = 1; i < WIN_LENGTH; i++) {
        const r = row + dr * i;
        const c = col + dc * i;
        if (r < 0 || r >= size || c < 0 || c >= size || board[r][c] !== marker) break;
        cells.push([r, c]);
      }
      for (let i = 1; i < WIN_LENGTH; i++) {
        const r = row - dr * i;
        const c = col - dc * i;
        if (r < 0 || r >= size || c < 0 || c >= size || board[r][c] !== marker) break;
        cells.push([r, c]);
      }
      if (cells.length >= WIN_LENGTH) return cells;
    }
    return null;
  }, []);

  const isBoardFull = useCallback((board) => {
    return board.every((row) => row.every((cell) => cell !== null));
  }, []);

  // Start game
  const startGame = useCallback(async () => {
    const newBoard = createEmptyBoard(boardSize);
    setBoard(newBoard);
    setCurrentPlayer(firstPlayer === "player1" ? 1 : 2);
    setWinner(null);
    setWinningCells(null);
    setIsDraw(false);
    setIsAborted(false);
    setMoveCount(0);
    moveCountRef.current = 0;
    setShowWinAnimation(false);
    setLastMove(null);
    setGamePhase("playing");

    try {
      const { data } = await gameService.createSession({
        gameType: gameMode,
        boardSize,
        difficulty: gameMode === "single" ? difficulty : undefined,
        player2Name: gameMode === "local" ? (player2Name || "Player 2") : undefined,
      });
      setSessionId(data._id);
    } catch {
      // Game can still work locally without session recording
    }
  }, [boardSize, firstPlayer, gameMode, difficulty, player2Name, createEmptyBoard]);

  // Start the online game (called when both players are ready)
  const startOnlineGame = useCallback((room) => {
    const newBoard = createEmptyBoard(room.boardSize);
    setBoard(newBoard);
    boardRef.current = newBoard;
    setCurrentPlayer(1);
    setWinner(null);
    setWinningCells(null);
    setIsDraw(false);
    setIsAborted(false);
    setMoveCount(0);
    moveCountRef.current = 0;
    setShowWinAnimation(false);
    setLastMove(null);
    setWaitingForOpponent(false);
    setGamePhase("playing");
    gamePhaseRef.current = "playing";

    gameService.createSession({
      gameType: "online",
      boardSize: room.boardSize,
    }).then(({ data }) => setSessionId(data._id)).catch(() => {});
  }, [createEmptyBoard]);

  // Initialize online game from room ID
  const initOnlineGame = useCallback(async (roomIdParam) => {
    if (!user?._id) return;

    const s = connectSocket(user._id, user.username);
    socketRef.current = s;

    setRoomId(roomIdParam);
    roomIdRef.current = roomIdParam;
    setGameMode("online");

    try {
      const { data: room } = await gameService.getRoom(roomIdParam);
      setRoomData(room);

      const isPlayer1 = room.player1?._id === user._id;
      const playerNum = isPlayer1 ? 1 : 2;
      setMyPlayerNumber(playerNum);
      myPlayerNumberRef.current = playerNum;

      setBoardSize(room.boardSize);
      setPlayer1Marker(room.player1Marker || "X");
      setPlayer2Marker(room.player2Marker || (room.player1Marker === "X" ? "O" : "X"));

      s.emit("game:join", { roomId: roomIdParam, userId: user._id, username: user.username });

      if (room.status === "waiting") {
        setWaitingForOpponent(true);
      } else {
        startOnlineGame(room);
      }
    } catch (err) {
      console.error("Failed to init online game:", err);
    }
  }, [user, startOnlineGame]);

  // Socket event listeners for online mode
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || gameMode !== "online" || !roomId) return;

    const handlePlayerJoined = async () => {
      setWaitingForOpponent(false);
      try {
        const { data: room } = await gameService.getRoom(roomIdRef.current);
        setRoomData(room);
        setPlayer2Marker(room.player2Marker || "O");
        if (gamePhaseRef.current !== "playing") {
          startOnlineGame(room);
        }
      } catch {
        /* fallback */
      }
    };

    const handleMoveMade = ({ row, col, marker, moveNumber }) => {
      const currentBoard = boardRef.current;
      const newBoard = currentBoard.map((r) => [...r]);
      newBoard[row][col] = marker;
      setBoard(newBoard);
      boardRef.current = newBoard;

      moveCountRef.current = moveNumber;
      setMoveCount(moveNumber);
      setLastMove({ row, col });

      const winResult = checkWin(newBoard, row, col, marker);
      if (winResult) {
        const opponentNum = myPlayerNumberRef.current === 1 ? 2 : 1;
        setWinner(opponentNum);
        setWinningCells(winResult);
        setShowWinAnimation(true);
        setGamePhase("ended");
        gamePhaseRef.current = "ended";
      } else if (isBoardFull(newBoard)) {
        setIsDraw(true);
        setGamePhase("ended");
        gamePhaseRef.current = "ended";
      } else {
        setCurrentPlayer(myPlayerNumberRef.current);
      }
    };

    const handleEnded = ({ result, winningCells: wc }) => {
      if (gamePhaseRef.current === "ended") return;
      if (result === "draw") {
        setIsDraw(true);
      }
      setGamePhase("ended");
      gamePhaseRef.current = "ended";
    };

    const handleAborted = () => {
      if (gamePhaseRef.current === "ended") return;
      setIsAborted(true);
      setGamePhase("ended");
      gamePhaseRef.current = "ended";
    };

    const handlePlayerLeft = () => {
      setOpponentLeft(true);
      if (gamePhaseRef.current === "playing") {
        setIsAborted(true);
        setGamePhase("ended");
        gamePhaseRef.current = "ended";
      }
    };

    socket.on("game:playerJoined", handlePlayerJoined);
    socket.on("game:moveMade", handleMoveMade);
    socket.on("game:ended", handleEnded);
    socket.on("game:aborted", handleAborted);
    socket.on("game:playerLeft", handlePlayerLeft);

    return () => {
      socket.off("game:playerJoined", handlePlayerJoined);
      socket.off("game:moveMade", handleMoveMade);
      socket.off("game:ended", handleEnded);
      socket.off("game:aborted", handleAborted);
      socket.off("game:playerLeft", handlePlayerLeft);
    };
  }, [roomId, gameMode, checkWin, isBoardFull, startOnlineGame]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socketRef.current && roomIdRef.current) {
        socketRef.current.emit("game:leave", { roomId: roomIdRef.current });
      }
      disconnectSocket();
      socketRef.current = null;
    };
  }, []);

  // Make a move
  const makeMove = useCallback(async (row, col) => {
    if (gamePhase !== "playing" || winner || isDraw || isAborted) return;
    if (board[row][col] !== null) return;
    if (gameMode === "single" && currentPlayer === 2 && !aiThinking) return; // AI's turn, wait
    if (gameMode === "online" && currentPlayer !== myPlayerNumber) return;

    const marker = currentPlayer === 1 ? player1Marker : player2Marker;
    const newBoard = board.map((r) => [...r]);
    newBoard[row][col] = marker;
    setBoard(newBoard);

    moveCountRef.current += 1;
    const newMoveCount = moveCountRef.current;
    setMoveCount(newMoveCount);
    setLastMove({ row, col });

    // Online mode: emit move
    if (gameMode === "online" && socketRef.current && roomId) {
      socketRef.current.emit("game:move", { roomId, row, col, marker, moveNumber: newMoveCount });
    }

    // Record move
    if (sessionId) {
      gameService.recordMove({
        gameId: sessionId,
        playerId: currentPlayer === 1 ? "player1" : (gameMode === "single" ? "ai" : "player2"),
        marker,
        row,
        col,
        moveNumber: newMoveCount,
        boardSize,
      }).catch(() => {});
    }

    // Check win
    const winResult = checkWin(newBoard, row, col, marker);
    if (winResult) {
      setWinner(currentPlayer);
      setWinningCells(winResult);
      setShowWinAnimation(true);

      if (gameMode === "online" && socketRef.current && roomId) {
        socketRef.current.emit("game:end", { roomId, winnerId: currentPlayer, result: "win", winningCells: winResult });
      }

      if (sessionId) {
        // Resolve the winning user's real MongoDB _id.
        // - Player 1 is always the authenticated user.
        // - Player 2 in online mode is a real user whose ID comes from roomData.
        // - Player 2 in single/local mode has no user account (AI or guest).
        let winnerId;
        if (currentPlayer === 1) {
          winnerId = user?._id;
        } else if (gameMode === "online") {
          winnerId = roomData?.player2?._id;
        }
        gameService.endSession(sessionId, {
          winnerId,
          result: "win",
        }).catch(() => {});
      }
      setGamePhase("ended");
      gamePhaseRef.current = "ended";
      return;
    }

    // Check draw
    if (isBoardFull(newBoard)) {
      setIsDraw(true);
      if (gameMode === "online" && socketRef.current && roomId) {
        socketRef.current.emit("game:end", { roomId, result: "draw" });
      }
      if (sessionId) {
        gameService.endSession(sessionId, { result: "draw" }).catch(() => {});
      }
      setGamePhase("ended");
      gamePhaseRef.current = "ended";
      return;
    }

    // Switch player
    setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
  }, [board, currentPlayer, gamePhase, winner, isDraw, isAborted, player1Marker, player2Marker, sessionId, boardSize, gameMode, aiThinking, checkWin, isBoardFull, myPlayerNumber, roomId]);

  // AI move
  useEffect(() => {
    if (gameMode !== "single" || currentPlayer !== 2 || gamePhase !== "playing" || winner || isDraw) return;

    setAiThinking(true);
    const timer = setTimeout(async () => {
      try {
        const { data: aiMove } = await gameService.getAIMove({
          board,
          aiMarker: player2Marker,
          playerMarker: player1Marker,
          difficulty,
          lastMove,
        });

        if (aiMove && board[aiMove.row][aiMove.col] === null) {
          const newBoard = board.map((r) => [...r]);
          newBoard[aiMove.row][aiMove.col] = player2Marker;
          setBoard(newBoard);

          moveCountRef.current += 1;
          const newMoveCount = moveCountRef.current;
          setMoveCount(newMoveCount);
          setLastMove({ row: aiMove.row, col: aiMove.col });

          if (sessionId) {
            gameService.recordMove({
              gameId: sessionId,
              playerId: "ai",
              marker: player2Marker,
              row: aiMove.row,
              col: aiMove.col,
              moveNumber: newMoveCount,
              boardSize,
            }).catch(() => {});
          }

          const winResult = checkWin(newBoard, aiMove.row, aiMove.col, player2Marker);
          if (winResult) {
            setWinner(2);
            setWinningCells(winResult);
            setShowWinAnimation(true);
            if (sessionId) {
              gameService.endSession(sessionId, { result: "win" }).catch(() => {});
            }
            setGamePhase("ended");
          } else if (isBoardFull(newBoard)) {
            setIsDraw(true);
            if (sessionId) {
              gameService.endSession(sessionId, { result: "draw" }).catch(() => {});
            }
            setGamePhase("ended");
          } else {
            setCurrentPlayer(1);
          }
        }
      } catch {
        // Fallback: random empty cell
        const empty = [];
        for (let r = 0; r < board.length; r++) {
          for (let c = 0; c < board[r].length; c++) {
            if (board[r][c] === null) empty.push([r, c]);
          }
        }
        if (empty.length > 0) {
          const [r, c] = empty[Math.floor(Math.random() * empty.length)];
          const newBoard = board.map((row) => [...row]);
          newBoard[r][c] = player2Marker;
          setBoard(newBoard);
          moveCountRef.current += 1;
          setMoveCount(moveCountRef.current);
          setLastMove({ row: r, col: c });
          setCurrentPlayer(1);
        }
      } finally {
        setAiThinking(false);
      }
    }, 400); // Small delay to feel natural

    return () => clearTimeout(timer);
  }, [currentPlayer, gameMode, gamePhase, winner, isDraw]);

  // Abort game (Req 4.1.5)
  const abortGame = useCallback(() => {
    setIsAborted(true);
    setGamePhase("ended");
    gamePhaseRef.current = "ended";
    if (gameMode === "online" && socketRef.current && roomId) {
      socketRef.current.emit("game:abort", { roomId });
    }
    if (sessionId) {
      gameService.endSession(sessionId, { result: "aborted" }).catch(() => {});
    }
  }, [sessionId, gameMode, roomId]);

  // Reset to setup
  const resetGame = useCallback(() => {
    if (gameMode === "online" && socketRef.current && roomId) {
      socketRef.current.emit("game:leave", { roomId });
      disconnectSocket();
      socketRef.current = null;
    }
    setGamePhase("setup");
    setBoard([]);
    setWinner(null);
    setWinningCells(null);
    setIsDraw(false);
    setIsAborted(false);
    setMoveCount(0);
    moveCountRef.current = 0;
    setShowWinAnimation(false);
    setSessionId(null);
    setAiThinking(false);
    setRoomId(null);
    setRoomData(null);
    setMyPlayerNumber(null);
    setWaitingForOpponent(false);
    setOpponentLeft(false);
  }, [gameMode, roomId]);

  return {
    // Setup
    gamePhase,
    gameMode, setGameMode,
    boardSize, setBoardSize,
    boardStyle, setBoardStyle,
    player1Marker, setPlayer1Marker,
    player2Marker, setPlayer2Marker,
    player2Name, setPlayer2Name,
    difficulty, setDifficulty,
    firstPlayer, setFirstPlayer,
    BOARD_STYLES,
    AVAILABLE_MARKERS,
    // Game
    board,
    currentPlayer,
    winner,
    winningCells,
    isDraw,
    isAborted,
    moveCount,
    showWinAnimation,
    aiThinking,
    lastMove,
    // Online
    roomId,
    roomData,
    myPlayerNumber,
    waitingForOpponent,
    opponentLeft,
    socket: socketRef.current,
    initOnlineGame,
    // Actions
    startGame,
    makeMove,
    abortGame,
    resetGame,
    dismissWinAnimation: () => setShowWinAnimation(false),
  };
};