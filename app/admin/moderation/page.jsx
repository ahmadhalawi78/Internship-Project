'use client';

import React, { useState } from 'react';
import './moderation.css';
import StatsCard from '../../../components/StatsCard';
import QuickActions from '../../../components/QuickActions';
import ReportsTable from '../../../components/ReportsTable';
import FlaggedUsers from '../../../components/FlaggedUsers';
import ListingsTable from '../../../components/ListingsTable';

export default function ModerationDashboard() {
  // State for dashboard data
  const [stats, setStats] = useState({
    pendingReports: 24,
    listingsToReview: 12,
    receivedToday: 18,
    flaggedUsers: 3
  });

  const [pendingReports, setPendingReports] = useState([
    {
      id: 1,
      title: "Uter Katzen Rotten",
      judge: "doc_open",
      status: "pending",
      tags: ["Harassment", "Pending alert", "Copyright", "Review"],
      priority: "high",
      reportedBy: "User$1",
      date: "2024-01-15"
    },
    {
      id: 2,
      title: "Copyright Violation",
      judge: "copyright_bot",
      status: "pending",
      tags: ["Copyright", "High Priority"],
      priority: "medium",
      reportedBy: "auto-mod",
      date: "2024-01-14"
    },
    {
      id: 3,
      title: "Inappropriate Content",
      judge: "mod_team",
      status: "pending",
      tags: ["NSFW", "Review"],
      priority: "high",
      reportedBy: "User12",
      date: "2024-01-15"
    }
  ]);

  const [listings, setListings] = useState([
    { id: 1, post: "Post #123", user: "User$1", date: "Today", status: "pending", type: "listing" },
    { id: 2, post: "Post #456", user: "User12", date: "Yesterday", status: "pending", type: "product" },
    { id: 3, post: "Post #789", user: "UserC_33", date: "2 days ago", status: "pending", type: "service" }
  ]);

  const [resolvedReports, setResolvedReports] = useState([
    { id: 1, title: "Uter Acties Due", user: "qmm_account", date: "Today", action: "Removed", status: "resolved" },
    { id: 2, title: "Fake Account", user: "fake_user", date: "Yesterday", action: "Warning", status: "resolved" },
    { id: 3, title: "Spam Post", user: "spammer_1", date: "2 days ago", action: "Deleted", status: "resolved" }
  ]);

  const [flaggedUsers, setFlaggedUsers] = useState([
    { id: 1, username: "qmmmer123", reports: 4, status: "active", lastActive: "Today" },
    { id: 2, username: "harasser456", reports: 5, status: "suspended", lastActive: "Yesterday" },
    { id: 3, username: "noll_master", reports: 17, status: "banned", lastActive: "1 week ago" }
  ]);

  // Action handlers
  const handleResolveReport = (id) => {
    const report = pendingReports.find(r => r.id === id);
    if (report) {
      // Move to resolved
      const newResolved = {
        id: Date.now(),
        title: report.title,
        user: report.reportedBy,
        date: "Just now",
        action: "Resolved",
        status: "resolved"
      };
      
      setResolvedReports(prev => [newResolved, ...prev]);
      setPendingReports(prev => prev.filter(r => r.id !== id));
      setStats(prev => ({ ...prev, pendingReports: prev.pendingReports - 1 }));
      
      // In real app, you would make API call here
      console.log(`Resolved report ${id}: ${report.title}`);
    }
  };

  const handleEscalateReport = (id) => {
    const report = pendingReports.find(r => r.id === id);
    alert(`Report "${report?.title}" has been escalated to senior moderators.`);
    // API call would go here
  };

  const handleReviewListing = (id) => {
    const listing = listings.find(l => l.id === id);
    alert(`Reviewing ${listing?.post}. Opening detailed view...`);
    // Navigate to detailed view or open modal
  };

  const handleQuickAction = (action) => {
    switch(action) {
      case 'review':
        alert('Opening review panel...');
        break;
      case 'warn':
        alert('Warning modal opened');
        break;
      case 'place':
        const username = prompt('Enter username to place restriction:');
        if (username) {
          alert(`Restriction placed on ${username}`);
        }
        break;
      case 'release':
        alert('Release audit initiated');
        break;
      default:
        break;
    }
  };

  const handleDeleteUser = (userId) => {
    if (confirm('Are you sure you want to remove this flagged user?')) {
      setFlaggedUsers(prev => prev.filter(user => user.id !== userId));
      setStats(prev => ({ ...prev, flaggedUsers: prev.flaggedUsers - 1 }));
    }
  };

  return (
    <div className="moderation-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1><i className="fas fa-shield-alt"></i> Moderation Dashboard</h1>
        <p className="subtitle">Admin panel for content moderation</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <StatsCard
          title="Pending Reports"
          count={stats.pendingReports}
          icon="flag"
          color="#e74c3c"
          trend="+2 today"
        />
        <StatsCard
          title="Listings to Review"
          count={stats.listingsToReview}
          icon="clipboard-list"
          color="#3498db"
          trend="+3 today"
        />
        <StatsCard
          title="Received Today"
          count={stats.receivedToday}
          icon="calendar-day"
          color="#2ecc71"
          trend="Updated now"
        />
        <StatsCard
          title="Flagged Users"
          count={stats.flaggedUsers}
          icon="user-slash"
          color="#f39c12"
          trend="+1 today"
        />
      </div>

      {/* Main Content Grid */}
      <div className="content-grid">
        {/* Left Column */}
        <div className="left-column">
          {/* Pending Reports */}
          <div className="card">
            <div className="card-header">
              <h2><i className="fas fa-exclamation-circle"></i> Pending Reports</h2>
              <span className="badge badge-danger">{pendingReports.length}</span>
            </div>
            <ReportsTable
              reports={pendingReports}
              onResolve={handleResolveReport}
              onEscalate={handleEscalateReport}
            />
          </div>

          {/* Listings Under Review */}
          <div className="card">
            <div className="card-header">
              <h2><i className="fas fa-clipboard-check"></i> Listings Under Review</h2>
            </div>
            <ListingsTable
              listings={listings}
              onReview={handleReviewListing}
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="right-column">
          {/* Resolved Reports */}
          <div className="card">
            <div className="card-header">
              <h2><i className="fas fa-check-circle"></i> Resolved Reports</h2>
              <button className="btn btn-sm btn-outline">View All</button>
            </div>
            <div className="resolved-list">
              {resolvedReports.slice(0, 5).map(report => (
                <div key={report.id} className="resolved-item">
                  <div className="resolved-header">
                    <h4>{report.title}</h4>
                    <span className={`status status-${report.status}`}>
                      {report.status}
                    </span>
                  </div>
                  <div className="resolved-details">
                    <span><i className="fas fa-user"></i> {report.user}</span>
                    <span><i className="fas fa-clock"></i> {report.date}</span>
                    <span className={`action action-${report.action.toLowerCase()}`}>
                      {report.action}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Flagged Users */}
          <div className="card">
            <div className="card-header">
              <h2><i className="fas fa-user-times"></i> Flagged Users</h2>
            </div>
            <FlaggedUsers
              users={flaggedUsers}
              onDelete={handleDeleteUser}
            />
          </div>

          {/* Quick Actions */}
          <QuickActions onAction={handleQuickAction} />
        </div>
      </div>
    </div>
  );
}