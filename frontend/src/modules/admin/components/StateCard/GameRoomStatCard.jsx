import React from 'react';
import './StateCard.css';

const GameRoomStatCard = ({ label, value, color, bgColor }) => {
  return (
    <div className="stat-card" style={bgColor ? { background: bgColor } : {}}>
      <div className="stat-label">{label}</div>
      <div className="stat-value" style={{ color }}>{value}</div>
    </div>
  );
};

export default GameRoomStatCard;
