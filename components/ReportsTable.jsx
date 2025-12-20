export default function ReportsTable({ reports, onResolve, onEscalate }) {
  const getPriorityBadge = (priority) => {
    const styles = {
      high: { bg: '#fee', color: '#e74c3c', text: 'High' },
      medium: { bg: '#fef9e7', color: '#f39c12', text: 'Medium' },
      low: { bg: '#e8f6ef', color: '#27ae60', text: 'Low' }
    };
    const style = styles[priority] || styles.medium;
    
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
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Report Title</th>
            <th>Judge</th>
            <th>Tags</th>
            <th>Priority</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.map(report => (
            <tr key={report.id}>
              <td>
                <strong>{report.title}</strong>
                <div className="text-muted">Reported by: {report.reportedBy}</div>
              </td>
              <td>{report.judge}</td>
              <td>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                  {report.tags.map((tag, index) => (
                    <span key={index} className={`tag tag-${tag.toLowerCase().replace(' ', '-')}`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </td>
              <td>{getPriorityBadge(report.priority)}</td>
              <td>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className="action-btn resolve"
                    onClick={() => onResolve(report.id)}
                  >
                    <i className="fas fa-check"></i> Resolve
                  </button>
                  <button
                    className="action-btn escalate"
                    onClick={() => onEscalate(report.id)}
                  >
                    <i className="fas fa-exclamation-triangle"></i> Escalate
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}