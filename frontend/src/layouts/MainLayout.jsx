import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const getPageTitle = (pathname) => {
  if (pathname === '/') return 'Dashboard';
  if (pathname === '/mistakes/new') return 'Record New DSA Mistake';
  if (pathname === '/mistakes') return 'Mistake History';
  if (pathname.includes('/edit')) return 'Edit Mistake';
  if (pathname.startsWith('/mistakes/')) return 'Mistake Details & Review';
  if (pathname === '/analytics') return 'Analytics & Insights';
  return 'DSA Mistake Log';
};

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  return (
    <div className="app-layout">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      <div className="main-content">
        <Navbar 
          onToggleSidebar={() => setSidebarOpen(prev => !prev)}
          title={pageTitle}
        />

        <main className="p-3 p-md-4 p-xl-5 flex-grow-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
