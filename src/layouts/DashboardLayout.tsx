import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { ROUTES } from '@/config/routes';

export interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  // Auto-collapse sidebar on mobile, expand on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };
    
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Collapse sidebar on mobile when route changes
  useEffect(() => {
    if (window.innerWidth < 768) {
      setCollapsed(true);
    }
  }, [location.pathname]);

  const handleToggle = () => {
    setCollapsed(prev => !prev);
  };

  const getPageTitle = (path: string) => {
    const routeTitles: Record<string, string> = {
      [ROUTES.DASHBOARD]: 'Dashboard',
      [ROUTES.AGENT_DASHBOARD]: 'Agent Dashboard',
      [ROUTES.ADMIN_DASHBOARD]: 'Admin Dashboard',
      [ROUTES.CREATE_REQUEST]: 'Create Request',
      [ROUTES.MY_REQUESTS]: 'My Requests',
      [ROUTES.PRIORITY_QUEUE]: 'Priority Queue',
      [ROUTES.ANALYTICS]: 'Analytics',
      [ROUTES.SETTINGS]: 'Settings',
    };
    
    // Check if it's a dynamic ticket details route
    if (path.startsWith('/ticket/')) {
      return 'Ticket Details';
    }

    return routeTitles[path] || 'Overview';
  };

  return (
    <div className="flex h-screen overflow-hidden bg-cream-100 dark:bg-charcoal-950 font-sans text-surface-900 dark:text-surface-100 transition-colors duration-200">
      <Sidebar 
        collapsed={collapsed} 
        onToggle={handleToggle} 
        currentPath={location.pathname} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header 
          title={getPageTitle(location.pathname)} 
          onMenuToggle={handleToggle} 
        />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-cream-100 dark:bg-charcoal-950 transition-colors duration-200">
          <div className="container mx-auto p-4 md:p-6 max-w-7xl">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
};
