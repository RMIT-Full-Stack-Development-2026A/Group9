import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SimpleModal from "../../../../shared/ui/SimpleModal.jsx";
import styles from "./GameModals.module.css";

export default function AIGameModal({ open, onClose }) {

  const [difficulty, setDifficulty] = useState("Easy");
  const [marker, setMarker] = useState(null);
  const [aiMarker, setAIMarker] = useState(null);
  const [first, setFirst] = useState("ME");
  const [boardSize, setBoardSize] = useState("10x10");
  const [boardStyle, setBoardStyle] = useState("Classic");
  const navigate = useNavigate();

  const markerOptions = ["X", "O", "⭐", "🔥", "💎", "🌙"];
  // Map AI names to difficulty
  const aiLevels = [
    { value: "Easy", label: "Jeremy (Easy)" },
    { value: "Medium", label: "Bot (Medium)" },
    { value: "Hard", label: "HAL 9000 (Hard)" },
  ];
  const firstOptions = ["ME", "AI"];
  const boardSizes = ["10x10", "15x15"];
  const boardStyles = ["Classic", "Neon", "Minimal"];

  // When player picks a marker, AI picks a random different one
  const handleMarkerClick = (opt) => {
    setMarker(opt);
    const aiChoices = markerOptions.filter(m => m !== opt);
    const randomAIMarker = aiChoices[Math.floor(Math.random() * aiChoices.length)];
    setAIMarker(randomAIMarker);
  };

  const handleStartGame = () => {
    if (!marker || !aiMarker) return;
    const settings = {
      player1: {
        name: "You",
        marker: marker,
        avatar: "/avatars/avatar1.png",
      },
      player2: {
        name: aiLevels.find(l => l.value === difficulty)?.label.split(" (")[0] || "AI",
        marker: aiMarker,
        avatar: "/avatars/avatar2.png",
      },
      boardSize: boardSize === "10x10" ? 10 : 15,
      boardStyle,
      firstPlayer: first === "ME" ? "Player 1" : "Player 2",
      aiLevel: difficulty,
    };
    onClose && onClose();
    navigate("/ai-arena", { state: { settings } });
  };

  return (
    <SimpleModal open={open} onClose={onClose}>
      <div className={styles.modalContent}>
        <h2 className={styles.title}><i className="bi bi-robot" style={{color:'#8B5CF6'}}></i> Play vs AI</h2>
            <label className={styles.label}>AI Opponent</label>
            <select className={styles.input} value={difficulty} onChange={e => setDifficulty(e.target.value)}>
              {aiLevels.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
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
        <label className={styles.label}>Choose Your Marker</label>
        <div className={styles.markerRow}>
          {markerOptions.map(opt => (
            <button
              key={opt}
              className={marker === opt ? styles.markerSelected : styles.markerBtn}
              onClick={() => handleMarkerClick(opt)}
              type="button"
            >
              {opt}
            </button>
          ))}
        </div>
        <div style={{marginTop: 8, marginBottom: 8, textAlign: 'center', color: '#8B5CF6', fontWeight: 500}}>
          {!marker && <span>Pick your marker</span>}
          {marker && aiMarker && (
            <span>AI's marker: <b>{aiMarker}</b></span>
          )}
        </div>
        <label className={styles.label}>Who Goes First</label>
        <select className={styles.input} value={first} onChange={e => setFirst(e.target.value)}>
          {firstOptions.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <button className={styles.startBtn} onClick={handleStartGame} disabled={!marker || !aiMarker}>Start Game</button>
      </div>
    </SimpleModal>
  );
}
