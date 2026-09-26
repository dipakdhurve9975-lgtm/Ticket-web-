import React, { useState } from 'react';
import { Menu, Search } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { SearchBar } from '@/components/common/SearchBar';
import { NotificationBell } from '@/components/common/NotificationBell';
import { Avatar } from '@/components/ui/Avatar';
import { Dropdown } from '@/components/ui/Dropdown';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config/routes';

interface HeaderProps {
  title: string;
  onMenuToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, onMenuToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <header className="h-16 bg-white dark:bg-charcoal-900 border-b border-surface-200 dark:border-charcoal-800 shadow-sm flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20 transition-colors duration-200">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="p-2 -ml-2 text-surface-500 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-charcoal-800 rounded-xl transition-colors"
          title="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-surface-900 dark:text-white hidden sm:block tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Search */}
        <div className="hidden md:block w-56 lg:w-72">
          <SearchBar 
            value={search} 
            onChange={setSearch} 
            placeholder="Search tickets, requests..." 
          />
        </div>

        {/* NOTIFICATIONS */}
        <NotificationBell />

        {/* USER PROFILE */}
        {user && (
          <Dropdown
            trigger={
              <button className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-full">
                <Avatar name={user.name} size="sm" className="cursor-pointer ring-2 ring-brand-500/20" />
              </button>
            }
            items={[
              { label: 'Profile Settings', onClick: () => navigate(ROUTES.SETTINGS) },
              { label: 'Logout', onClick: handleLogout, danger: true }
            ]}
          />
        )}
      </div>
    </header>
  );
};
