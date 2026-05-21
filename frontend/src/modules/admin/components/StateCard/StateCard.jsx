import './StateCard.css';

// Stateless presentational card used to display a single metric on the
// Admin Dashboard. Keep styling minimal here — consumers provide colors
// to convey meaning (e.g. green for healthy, red for warnings).
const StatCard = ({ label, value, color, bgColor }) => {
  return (
    <div className="stat-card" style={bgColor ? { background: bgColor } : {}}>
      {/* Human-readable label shown above the metric */}
      <div className="stat-label">{label}</div>
      {/* Metric value: a color can be supplied to draw attention */}
      <div className="stat-value" style={{ color: color }}>
        {value}
      </div>
    </div>
  );
};

export default StatCard;