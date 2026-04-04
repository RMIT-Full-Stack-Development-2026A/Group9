import { useState, useCallback, useEffect, useRef } from "react";
import * as gameService from "./GameArena.service.js";

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

export const useGameArena = () => {
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

  const moveCountRef = useRef(0);

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

  // Make a move
  const makeMove = useCallback(async (row, col) => {
    if (gamePhase !== "playing" || winner || isDraw || isAborted) return;
    if (board[row][col] !== null) return;
    if (gameMode === "single" && currentPlayer === 2 && !aiThinking) return; // AI's turn, wait

    const marker = currentPlayer === 1 ? player1Marker : player2Marker;
    const newBoard = board.map((r) => [...r]);
    newBoard[row][col] = marker;
    setBoard(newBoard);

    moveCountRef.current += 1;
    const newMoveCount = moveCountRef.current;
    setMoveCount(newMoveCount);
    setLastMove({ row, col });

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

      if (sessionId) {
        gameService.endSession(sessionId, {
          winnerId: currentPlayer === 1 ? "player1" : null,
          result: "win",
        }).catch(() => {});
      }
      setGamePhase("ended");
      return;
    }

    // Check draw
    if (isBoardFull(newBoard)) {
      setIsDraw(true);
      if (sessionId) {
        gameService.endSession(sessionId, { result: "draw" }).catch(() => {});
      }
      setGamePhase("ended");
      return;
    }

    // Switch player
    setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
  }, [board, currentPlayer, gamePhase, winner, isDraw, isAborted, player1Marker, player2Marker, sessionId, boardSize, gameMode, aiThinking, checkWin, isBoardFull]);

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
    if (sessionId) {
      gameService.endSession(sessionId, { result: "aborted" }).catch(() => {});
    }
  }, [sessionId]);

  // Reset to setup
  const resetGame = useCallback(() => {
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
  }, []);

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
    // Actions
    startGame,
    makeMove,
    abortGame,
    resetGame,
  };
};