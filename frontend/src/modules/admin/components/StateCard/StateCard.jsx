import './StateCard.css';

const StatCard = ({ label, value, color }) => {
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className="stat-value" style={{ color: color }}>
        {value}
      </div>
    </div>
  );
};

export default StatCard;