'use client';

import { useState } from 'react';

export default function ActionPanel({ report, onApprove, onReject }) {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    if (!report) return;
    
    setLoading(true);
    try {
      await onApprove(report.id, reason || 'No reason provided');
      setReason('');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!report) return;
    
    if (!reason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    setLoading(true);
    try {
      await onReject(report.id, reason);
      setReason('');
    } finally {
      setLoading(false);
    }
  };

  if (!report) {
    return (
      <div className="action-panel empty">
        <div className="empty-state">
          <h3>No Report Selected</h3>
          <p>Select a report from the list to take action</p>
        </div>
      </div>
    );
  }

  return (
    <div className="action-panel">
      <div className="report-details">
        <h3>Report Details</h3>
        <div className="detail-item">
          <strong>Report ID:</strong> {report.id}
        </div>
        <div className="detail-item">
          <strong>Content ID:</strong> {report.contentId}
        </div>
        <div className="detail-item">
          <strong>Reason:</strong> {report.reason}
        </div>
        <div className="detail-item">
          <strong>Reported By:</strong> {report.reportedBy}
        </div>
        <div className="detail-item">
          <strong>Status:</strong> 
          <span className={`report-status status-${report.status}`}>
            {report.status}
          </span>
        </div>
        <div className="detail-item">
          <strong>Created:</strong> {new Date(report.createdAt).toLocaleString()}
        </div>
      </div>

      <div className="action-section">
        <h4>Action Required</h4>
        <textarea
          className="reason-input"
          placeholder="Enter your decision reason here..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          disabled={loading}
        />
        
        <div className="action-buttons">
          <button
            className="approve-btn"
            onClick={handleApprove}
            disabled={loading || report.status !== 'pending'}
          >
            {loading ? 'Processing...' : 'Approve'}
          </button>
          
          <button
            className="reject-btn"
            onClick={handleReject}
            disabled={loading || report.status !== 'pending'}
          >
            {loading ? 'Processing...' : 'Reject'}
          </button>
        </div>
        
        {report.status !== 'pending' && (
          <p className="action-note">
            This report has already been {report.status}. No further action needed.
          </p>
        )}
      </div>
    </div>
  );
}