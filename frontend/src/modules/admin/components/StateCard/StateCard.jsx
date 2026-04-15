import './StateCard.css';


const StatCard = ({ label, value, color, bgColor }) => {
  return (
    <div className="stat-card" style={bgColor ? { background: bgColor } : {}}>
      <div className="stat-label">{label}</div>
      <div className="stat-value" style={{ color: color }}>
        {value}
      </div>
    </div>
  );
};

export default StatCard;