'use client';

export default function StatsPanel({ pendingCount, approvedCount, rejectedCount }) {
  return (
    <div className="stats-panel">
      <div className="stat-card stat-pending">
        <h3>Pending</h3>
        <div className="stat-number">{pendingCount}</div>
        <p>Awaiting review</p>
      </div>
      
      <div className="stat-card stat-approved">
        <h3>Approved</h3>
        <div className="stat-number">{approvedCount}</div>
        <p>Content approved</p>
      </div>
      
      <div className="stat-card stat-rejected">
        <h3>Rejected</h3>
        <div className="stat-number">{rejectedCount}</div>
        <p>Content removed</p>
      </div>
    </div>
  );
}