
import React, { useState, useContext } from "react";
import SimpleModal from "../../../../shared/ui/SimpleModal.jsx";
import styles from "./GameModals.module.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../app/providers/AuthProvider.jsx";

export default function LocalGameModal({ open, onClose }) {
  const { user } = useContext(AuthContext) || {};

  const normalizeAuthUser = (raw) => {
    if (!raw || typeof raw !== "object") return null;
    let candidate = raw;
    if (candidate.data && typeof candidate.data === "object") {
      candidate = candidate.data;
    }
    if (candidate.user && typeof candidate.user === "object") {
      candidate = candidate.user;
    }
    if (candidate.account && typeof candidate.account === "object") {
      const account = candidate.account;
      const profile = candidate.profile && typeof candidate.profile === "object" ? candidate.profile : {};
      return {
        ...account,
        avatar: profile.avatar || account.avatar || "",
      };
    }
    return candidate;
  };
  
  const currentUser = normalizeAuthUser(user);
  const player1DisplayName =
    currentUser?.username || currentUser?.name || currentUser?.email || "Player 1";
  const [player2, setPlayer2] = useState("");
  const [boardSize, setBoardSize] = useState("10x10");
  const [boardStyle, setBoardStyle] = useState("Classic");
  const [marker1, setMarker1] = useState(null);
  const [marker2, setMarker2] = useState(null);
  const [first, setFirst] = useState("Player 1");
  const [turn, setTurn] = useState("Player 1");
  const navigate = useNavigate();

  const markerOptions = ["X", "O", "⭐", "🔥", "💎", "🌙"];
  const boardStyles = ["Classic", "Retro", "Space"];
  const boardSizes = ["10x10", "15x15"];
  const firstOptions = ["Player 1", "Player 2"];

  const bothPicked = marker1 && marker2 && marker1 !== marker2;

  

  // Turn-based, but allow changing as long as not picking the same icon
  const handleMarkerClick = (opt) => {
    if (turn === "Player 1") {
      if (marker2 !== opt) {
        setMarker1(opt);
        setTurn("Player 2");
      }
    } else if (turn === "Player 2") {
      if (marker1 !== opt) {
        setMarker2(opt);
        setTurn("Player 1");
      }
    }
  };

  const handleStartGame = () => {
    if (!bothPicked || !player2) return;
    // Prepare settings for LocalGameArena with player2 as null and localPlayer2Name set
    const settings = {
      // backend expects 'classic' for local/classic matches
      gameType: 'local',
      player1: {
        id: currentUser?._id || currentUser?.id || null, // Use null if not logged in
        name: player1DisplayName,
        marker: marker1,
      },
      player2: {
        id: null, // Always null for guest/local
        name: player2,
        marker: marker2,
      },
      boardSize: boardSize === "10x10" ? 10 : 15,
      boardStyle,
      firstPlayer: first,
    };
    onClose && onClose();
    navigate("/local-arena", { state: { settings } });
  };

  return (
    <SimpleModal open={open} onClose={onClose}>
      <div className={styles.modalContent}>
        <h2 className={styles.title}><i className="bi bi-display" style={{color:'#06B6D4'}}></i> Local 2-Player Game</h2>
        <label className={styles.label}>Player 2 Name</label>
        <input className={styles.input} placeholder="Enter Player 2's name" value={player2} onChange={e => setPlayer2(e.target.value)} />
        <label className={styles.label}>Board Size</label>
        <select className={styles.input} value={boardSize} onChange={e => setBoardSize(e.target.value)}>
          {boardSizes.map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
        <label className={styles.label}>Board Style</label>
        <select className={styles.input} value={boardStyle} onChange={e => setBoardStyle(e.target.value)}>
          {boardStyles.map(style => (
            <option key={style} value={style}>{style}</option>
          ))}
        </select>
        <label className={styles.label}>Choose Markers</label>
        <div className={styles.markerRow}>
          {markerOptions.map(opt => (
            <button
              key={opt}
              className={
                marker1 === opt
                  ? styles.markerSelected
                  : marker2 === opt
                  ? styles.markerSelected2
                  : styles.markerBtn
              }
              onClick={() => handleMarkerClick(opt)}
              type="button"
            >
              {opt}
            </button>
          ))}
        </div>
        <div style={{marginTop: 1, marginBottom: 1, textAlign: 'center', color: '#06B6D4', fontWeight: 500}}>
          {(!marker1 || !marker2 || marker1 === marker2) && (
            <span>
              {turn ? `${turn}, pick your marker` : null}
            </span>
          )}
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 1, marginBottom: 1}}>
          <span style={{fontSize: '0.95em'}}>Player 1: <b>{marker1 || '-'}</b></span>
          <span style={{fontSize: '0.95em'}}>Player 2: <b>{marker2 || '-'}</b></span>
        </div>
        <label className={styles.label}>Who Goes First</label>
        <select className={styles.input} value={first} onChange={e => setFirst(e.target.value)}>
          {firstOptions.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <button className={styles.startBtn} onClick={handleStartGame} disabled={!bothPicked || !player2}>Start Game</button>
      </div>
    </SimpleModal>
  );
}
