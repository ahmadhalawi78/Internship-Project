export default function StatsCard({ title, count, icon, color, trend }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ backgroundColor: color }}>
        <i className={`fas fa-${icon}`}></i>
      </div>
      <div className="stat-content">
        <h3>{title}</h3>
        <div className="count">{count}</div>
        <div className="trend">{trend}</div>
      </div>
    </div>
  );
}