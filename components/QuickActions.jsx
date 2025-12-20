export default function QuickActions({ onAction }) {
  const actions = [
    { id: 'review', label: 'Review All', icon: 'eye', color: '#1976d2' },
    { id: 'warn', label: 'Warn User', icon: 'exclamation-triangle', color: '#f57c00' },
    { id: 'place', label: 'Place Restriction', icon: 'user-lock', color: '#c2185b' },
    { id: 'release', label: 'Release Audit', icon: 'file-audio', color: '#388e3c' }
  ];

  return (
    <div className="quick-actions">
      <h3><i className="fas fa-bolt"></i> Quick Actions</h3>
      <div className="action-buttons">
        {actions.map(action => (
          <button
            key={action.id}
            className={`action-btn-large ${action.id}`}
            style={{ backgroundColor: `${action.color}15`, color: action.color }}
            onClick={() => onAction(action.id)}
          >
            <i className={`fas fa-${action.icon}`}></i>
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}