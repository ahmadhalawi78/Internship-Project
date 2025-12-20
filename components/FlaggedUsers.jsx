export default function FlaggedUsers({ users, onDelete }) {
  const getStatusBadge = (status) => {
    const styles = {
      active: { bg: '#e8f6ef', color: '#27ae60', text: 'Active' },
      suspended: { bg: '#fef9e7', color: '#f39c12', text: 'Suspended' },
      banned: { bg: '#fee', color: '#e74c3c', text: 'Banned' }
    };
    const style = styles[status] || styles.active;
    
    return (
      <span style={{
        backgroundColor: style.bg,
        color: style.color,
        padding: '0.25rem 0.75rem',
        borderRadius: '4px',
        fontSize: '0.85rem',
        fontWeight: '600'
      }}>
        {style.text}
      </span>
    );
  };

  return (
    <div className="flagged-users">
      {users.map(user => (
        <div key={user.id} className="user-item">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ margin: '0 0 0.25rem 0' }}>{user.username}</h4>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: '#7f8c8d' }}>
                <span><i className="fas fa-flag"></i> {user.reports} reports</span>
                <span><i className="fas fa-clock"></i> {user.lastActive}</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {getStatusBadge(user.status)}
              <button
                className="btn btn-danger btn-sm"
                onClick={() => onDelete(user.id)}
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}