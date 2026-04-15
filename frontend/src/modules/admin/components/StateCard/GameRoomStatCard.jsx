import React from 'react';
import './StateCard.css';

const GameRoomStatCard = ({ label, value, color }) => {
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className="stat-value" style={{ color }}>{value}</div>
    </div>
  );
};

export default GameRoomStatCard;
