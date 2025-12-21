'use client';

import { useState, useEffect } from 'react';
import ReportList from './components/ReportList';
import StatsPanel from './components/StatsPanel';
import ActionPanel from './components/ActionPanel';

export default function ModerationPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [filters, setFilters] = useState({ status: 'pending', page: 1 });

  // Fetch reports
  const fetchReports = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(
        `/api/moderation/reports?status=${filters.status}&page=${filters.page}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch');
      
      const data = await response.json();
      if (data.success) {
        setReports(data.data);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      alert('Failed to load reports. Please check your permissions.');
    } finally {
      setLoading(false);
    }
  };

  // Approve report
  const handleApprove = async (reportId, reason) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/moderation/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ reportId, reason }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Report approved successfully!');
        fetchReports(); // Refresh list
        setSelectedReport(null);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Approval error:', error);
      alert('Failed to approve report');
    }
  };

  // Reject report
  const handleReject = async (reportId, reason) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/moderation/reject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ reportId, reason }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Report rejected successfully!');
        fetchReports(); // Refresh list
        setSelectedReport(null);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Rejection error:', error);
      alert('Failed to reject report');
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchReports();
  }, [filters.status, filters.page]);

  return (
    <div className="moderation-page">
      <StatsPanel 
        pendingCount={reports.filter(r => r.status === 'pending').length}
        approvedCount={reports.filter(r => r.status === 'approved').length}
        rejectedCount={reports.filter(r => r.status === 'rejected').length}
      />
      
      <div className="moderation-main">
        <ReportList
          reports={reports}
          loading={loading}
          filters={filters}
          onFilterChange={setFilters}
          onSelectReport={setSelectedReport}
          selectedId={selectedReport?.id}
        />
        
        <ActionPanel
          report={selectedReport}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </div>

    </div>
  );
}