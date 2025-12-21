'use client';

import { useRouter } from 'next/navigation';

export default function Sidebar() {
  const router = useRouter();
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/moderation' },
    { id: 'reports', label: 'Reports', icon: '📋', path: '/moderation/reports' },
    { id: 'users', label: 'User Management', icon: '👥', path: '/admin/users' },
    { id: 'settings', label: 'Settings', icon: '⚙️', path: '/admin/settings' },
    { id: 'analytics', label: 'Analytics', icon: '📈', path: '/admin/analytics' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>🚀 Admin Panel</h2>
        <p className="admin-email">admin@example.com</p>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="nav-item"
            onClick={() => router.push(item.path)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </div>
        ))}
      </nav>
      
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          🔓 Logout
        </button>
        <div className="version">v1.0.0</div>
      </div>
    </div>
  );
}