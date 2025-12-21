'use client';

export default function ReportList({ 
  reports, 
  loading, 
  filters, 
  onFilterChange, 
  onSelectReport,
  selectedId 
}) {
  
  const handleFilterChange = (status) => {
    onFilterChange({ ...filters, status, page: 1 });
  };

  const handlePageChange = (direction) => {
    const newPage = filters.page + direction;
    if (newPage > 0) {
      onFilterChange({ ...filters, page: newPage });
    }
  };

  if (loading) {
    return (
      <div className="reports-list loading">
        <div className="loading-spinner">Loading reports...</div>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="reports-list empty">
        <div className="empty-state">
          <h3>No Reports Found</h3>
          <p>There are no reports with status: {filters.status}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reports-list">
      <div className="reports-header">
        <h2>Content Reports</h2>
        
        <div className="filter-controls">
          <div className="filter-tabs">
            {['pending', 'approved', 'rejected', 'all'].map((status) => (
              <button
                key={status}
                className={`filter-btn ${filters.status === status ? 'active' : ''}`}
                onClick={() => handleFilterChange(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
          
          <div className="pagination">
            <button 
              onClick={() => handlePageChange(-1)}
              disabled={filters.page === 1}
            >
              Previous
            </button>
            <span>Page {filters.page}</span>
            <button onClick={() => handlePageChange(1)}>
              Next
            </button>
          </div>
        </div>
      </div>

      <div className="reports-container">
        {reports.map((report) => (
          <div
            key={report.id}
            className={`report-item ${selectedId === report.id ? 'selected' : ''}`}
            onClick={() => onSelectReport(report)}
          >
            <div className="report-content">
              <h4>{report.contentType === 'post' ? '📝 Post' : '💬 Comment'} Report</h4>
              <p>{report.reason}</p>
              
              <div className="report-meta">
                <span>ID: {report.contentId}</span>
                <span>By: {report.reportedBy}</span>
                <span className={`report-status status-${report.status}`}>
                  {report.status}
                </span>
                <span>{new Date(report.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}