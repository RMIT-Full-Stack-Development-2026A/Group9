import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useGameArena } from "./GameArena.hook.js";
import { useChatBox } from "./components/ChatBox/ChatBox.hook.js";
import Board from "./components/Board/Board.jsx";
import ChatBox from "./components/ChatBox/ChatBox.jsx";
import Button from "../../components/Button/Button.jsx";
import "./GameArena.css";

const GameArena = ({ user }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const game = useGameArena(user);
  const chat = useChatBox(game.socket, game.roomId);

  // Pre-select mode from URL params (from Home page links)
  const urlMode = searchParams.get("mode");
  const urlRoomId = searchParams.get("roomId");

  // Initialize online game when roomId is in URL
  useEffect(() => {
    if (urlMode === "online" && urlRoomId && game.gamePhase === "setup" && !game.roomId) {
      game.initOnlineGame(urlRoomId);
    } else if (urlMode && urlMode !== "online" && game.gamePhase === "setup" && game.gameMode !== urlMode) {
      game.setGameMode(urlMode);
    }
  }, [urlMode, urlRoomId]);

  const getPlayer1Label = () => {
    if (game.gameMode === "online" && game.roomData) {
      return game.roomData.player1?.username || "Player 1";
    }
    return user?.username || "Player 1";
  };
  const getPlayer2Label = () => {
    if (game.gameMode === "online" && game.roomData) {
      return game.roomData.player2?.username || "Opponent";
    }
    if (game.gameMode === "single") {
      const names = { easy: "Jeremy (Easy)", medium: "Bot (Medium)", hard: "Titan (Hard)" };
      return names[game.difficulty] || "AI";
    }
    return game.player2Name || "Player 2";
  };

  const getCurrentTurnLabel = () => {
    if (game.aiThinking) return "AI is thinking...";
    const marker = game.currentPlayer === 1 ? game.player1Marker : game.player2Marker;
    const name = game.currentPlayer === 1 ? getPlayer1Label() : getPlayer2Label();
    return `${name}'s turn (${marker})`;
  };

  const getResultMessage = () => {
    if (game.opponentLeft) return "Opponent Left";
    if (game.isAborted) return "Game Aborted";
    if (game.isDraw) return "It's a Draw!";
    if (game.winner) {
      const name = game.winner === 1 ? getPlayer1Label() : getPlayer2Label();
      return `${name} Wins!`;
    }
    return "";
  };

  // ---- WAITING FOR OPPONENT (online) ----
  if (game.waitingForOpponent) {
    return (
      <div className="game-page">
        <div className="setup-panel">
          <h2 className="setup-title">Waiting for Opponent</h2>
          <div className="waiting-info">
            <div className="waiting-spinner" />
            <p>Room #{game.roomData?.roomNumber || "..."}</p>
            <p className="waiting-details">
              Board: {game.boardSize}x{game.boardSize} · Marker: {game.player1Marker}
            </p>
            <p className="waiting-hint">Share the room link or wait for someone to join from the lobby.</p>
          </div>
          <Button variant="ghost" onClick={() => { game.resetGame(); navigate("/lobby"); }}>
            Back to Lobby
          </Button>
        </div>
      </div>
    );
  }

  // ---- SETUP PHASE ----
  if (game.gamePhase === "setup") {
    return (
      <div className="game-page">
        <div className="setup-panel">
          <h2 className="setup-title">Game Setup</h2>

          {/* Game Mode */}
          <div className="setup-group">
            <label className="setup-label">Game Mode</label>
            <div className="setup-options">
              {[
                { value: "local", label: "Two Players" },
                { value: "single", label: "vs AI" },
              ].map((m) => (
                <button
                  key={m.value}
                  className={`setup-option ${game.gameMode === m.value ? "active" : ""}`}
                  onClick={() => game.setGameMode(m.value)}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Board Size */}
          <div className="setup-group">
            <label className="setup-label">Board Size</label>
            <div className="setup-options">
              {[10, 15].map((s) => (
                <button
                  key={s}
                  className={`setup-option ${game.boardSize === s ? "active" : ""}`}
                  onClick={() => game.setBoardSize(s)}
                >
                  {s}x{s}
                </button>
              ))}
            </div>
          </div>

          {/* Board Style */}
          <div className="setup-group">
            <label className="setup-label">Board Style</label>
            <div className="setup-options">
              {game.BOARD_STYLES.map((style, i) => (
                <button
                  key={i}
                  className={`setup-option ${game.boardStyle === i ? "active" : ""}`}
                  onClick={() => game.setBoardStyle(i)}
                  style={{ background: style.cellBg, borderColor: style.border }}
                >
                  {style.name}
                </button>
              ))}
            </div>
          </div>

          {/* Markers */}
          <div className="setup-group">
            <label className="setup-label">Player 1 Marker</label>
            <div className="setup-options markers">
              {game.AVAILABLE_MARKERS.map((m) => (
                <button
                  key={m}
                  className={`setup-option marker ${game.player1Marker === m ? "active" : ""}`}
                  onClick={() => game.setPlayer1Marker(m)}
                  disabled={m === game.player2Marker}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div className="setup-group">
            <label className="setup-label">Player 2 Marker</label>
            <div className="setup-options markers">
              {game.AVAILABLE_MARKERS.map((m) => (
                <button
                  key={m}
                  className={`setup-option marker ${game.player2Marker === m ? "active" : ""}`}
                  onClick={() => game.setPlayer2Marker(m)}
                  disabled={m === game.player1Marker}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Player 2 Name (local mode) */}
          {game.gameMode === "local" && (
            <div className="setup-group">
              <label className="setup-label">Player 2 Name</label>
              <input
                className="setup-input"
                type="text"
                value={game.player2Name}
                onChange={(e) => game.setPlayer2Name(e.target.value)}
                placeholder="Player 2"
              />
            </div>
          )}

          {/* AI Difficulty */}
          {game.gameMode === "single" && (
            <div className="setup-group">
              <label className="setup-label">AI Difficulty</label>
              <div className="setup-options">
                {["easy", "medium", "hard"].map((d) => (
                  <button
                    key={d}
                    className={`setup-option ${game.difficulty === d ? "active" : ""}`}
                    onClick={() => game.setDifficulty(d)}
                  >
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* First Player */}
          <div className="setup-group">
            <label className="setup-label">Who Goes First?</label>
            <div className="setup-options">
              <button
                className={`setup-option ${game.firstPlayer === "player1" ? "active" : ""}`}
                onClick={() => game.setFirstPlayer("player1")}
              >
                {getPlayer1Label()}
              </button>
              <button
                className={`setup-option ${game.firstPlayer === "player2" ? "active" : ""}`}
                onClick={() => game.setFirstPlayer("player2")}
              >
                {getPlayer2Label()}
              </button>
            </div>
          </div>

          <Button variant="primary" size="lg" onClick={game.startGame}>
            Start Game
          </Button>
        </div>
      </div>
    );
  }

  // ---- PLAYING / ENDED PHASE ----
  return (
    <div className="game-page">
      <div className="game-layout">
        {/* Game Info Bar */}
        <div className="game-info-bar">
          <div className="game-player">
            <span className={`player-marker ${game.currentPlayer === 1 ? "active-turn" : ""}`}>
              {game.player1Marker}
            </span>
            <span className="player-name">{getPlayer1Label()}</span>
          </div>

          <div className="game-status">
            {game.gamePhase === "playing" && (
              <span className="turn-indicator">{getCurrentTurnLabel()}</span>
            )}
            {game.gamePhase === "ended" && (
              <span className={`result-text ${game.winner ? "result-win" : game.isDraw ? "result-draw" : "result-abort"}`}>
                {getResultMessage()}
              </span>
            )}
          </div>

          <div className="game-player">
            <span className="player-name">{getPlayer2Label()}</span>
            <span className={`player-marker ${game.currentPlayer === 2 ? "active-turn" : ""}`}>
              {game.player2Marker}
            </span>
          </div>
        </div>

        {/* Board + Chat Layout */}
        <div className={`game-board-area ${game.gameMode === "online" ? "with-chat" : ""}`}>
          <Board
            board={game.board}
            boardStyle={game.boardStyle}
            winningCells={game.winningCells}
            onCellClick={game.makeMove}
            lastMove={game.lastMove}
            disabled={game.gamePhase === "ended" || game.aiThinking || (game.gameMode === "online" && game.currentPlayer !== game.myPlayerNumber)}
          />

          {/* ChatBox (online only) */}
          {game.gameMode === "online" && (
            <ChatBox
              messages={chat.messages}
              input={chat.input}
              setInput={chat.setInput}
              onSend={chat.sendMessage}
              currentUser={user?._id}
            />
          )}
        </div>

        {/* Move Counter */}
        <p className="move-counter">Moves: {game.moveCount}</p>

        {/* Controls */}
        <div className="game-controls">
          {game.gamePhase === "playing" && (
            <Button variant="danger" onClick={game.abortGame}>Abort Game</Button>
          )}
          {game.gamePhase === "ended" && game.gameMode !== "online" && (
            <>
              <Button variant="primary" onClick={game.startGame}>Play Again</Button>
              <Button variant="ghost" onClick={game.resetGame}>Back to Setup</Button>
            </>
          )}
          {game.gamePhase === "ended" && game.gameMode === "online" && (
            <Button variant="ghost" onClick={() => { game.resetGame(); navigate("/lobby"); }}>Back to Lobby</Button>
          )}
        </div>
      </div>

      {/* Win Animation Overlay */}
      {game.showWinAnimation && (
        <div className="win-overlay">
          <div className="win-content">
            <span className="win-marker">{game.winner === 1 ? game.player1Marker : game.player2Marker}</span>
            <h2>{getResultMessage()}</h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameArena;