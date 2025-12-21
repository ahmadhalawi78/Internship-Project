'use client';

import { Inter } from 'next/font/google';
import './moderation.css';
import Sidebar from './components/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export default function ModerationLayout({ children }) {
  return (
    <div className={`moderation-layout ${inter.className}`}>
      <Sidebar />
      <main className="moderation-content">
        <header className="moderation-header">
          <h1>Content Moderation Dashboard</h1>
          <div className="admin-info">
            <span className="admin-badge">Admin</span>
            <button className="logout-btn">Logout</button>
          </div>
        </header>
        <div className="moderation-container">
          {children}
        </div>
      </main>
    </div>
  );
}