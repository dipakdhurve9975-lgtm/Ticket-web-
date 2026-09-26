import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  Settings,
  Shield,
  BarChart3,
  ListOrdered,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/config/routes';
import { APP_NAME } from '@/config/constants';
import { Avatar } from '@/components/ui/Avatar';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  currentPath: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggle,
  currentPath,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  const navItems = useMemo(() => {
    if (!user) return [];

    const items = [];
    const role = user.role;

    if (role === 'USER') {
      items.push(
        { icon: LayoutDashboard, label: 'Dashboard', path: ROUTES.DASHBOARD },
        { icon: PlusCircle, label: 'Create Request', path: ROUTES.CREATE_REQUEST },
        { icon: FileText, label: 'My Requests', path: ROUTES.MY_REQUESTS },
        { icon: Settings, label: 'Settings', path: ROUTES.SETTINGS }
      );
    } else if (role === 'AGENT') {
      items.push(
        { icon: LayoutDashboard, label: 'Agent Dashboard', path: ROUTES.AGENT_DASHBOARD },
        { icon: ListOrdered, label: 'Priority Queue', path: ROUTES.PRIORITY_QUEUE },
        { icon: FileText, label: 'My Requests', path: ROUTES.MY_REQUESTS },
        { icon: Settings, label: 'Settings', path: ROUTES.SETTINGS }
      );
    } else if (role === 'ADMIN') {
      items.push(
        { icon: Shield, label: 'Admin Dashboard', path: ROUTES.ADMIN_DASHBOARD },
        { icon: BarChart3, label: 'Analytics', path: ROUTES.ANALYTICS },
        { icon: ListOrdered, label: 'Priority Queue', path: ROUTES.PRIORITY_QUEUE },
        { icon: FileText, label: 'All Requests', path: ROUTES.MY_REQUESTS },
        { icon: Settings, label: 'Settings', path: ROUTES.SETTINGS }
      );
    }

    return items;
  }, [user]);

  return (
    <>
      {/* Mobile overlay backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity',
          collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
        )}
        onClick={onToggle}
      />
      
      <aside
        className={cn(
          'fixed md:static inset-y-0 left-0 z-30 flex flex-col bg-white dark:bg-charcoal-900 border-r border-surface-200 dark:border-charcoal-800 transition-all duration-300 ease-in-out',
          collapsed ? '-translate-x-full md:translate-x-0 md:w-[72px]' : 'translate-x-0 w-64'
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-surface-200 dark:border-charcoal-800">
          <Link to={ROUTES.DASHBOARD} className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-charcoal-800 flex items-center justify-center shrink-0 border border-brand-200/50 dark:border-brand-500/20">
              <LayoutDashboard className="w-5 h-5 text-brand-500" />
            </div>
            <span
              className={cn(
                'font-bold text-lg text-surface-900 dark:text-white transition-opacity duration-300 whitespace-nowrap tracking-tight',
                collapsed ? 'opacity-0 md:hidden' : 'opacity-100'
              )}
            >
              {APP_NAME}
            </span>
          </Link>
          <button
            onClick={onToggle}
            className="p-1 hidden md:block rounded-lg text-surface-400 hover:text-surface-700 dark:hover:text-white hover:bg-surface-100 dark:hover:bg-charcoal-800 transition-colors"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm',
                  isActive
                    ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-semibold shadow-sm'
                    : 'text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-charcoal-800 hover:text-surface-900 dark:hover:text-white'
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={cn(
                    'flex-shrink-0 w-5 h-5 transition-colors',
                    isActive ? 'text-brand-500' : 'text-surface-400 group-hover:text-surface-700 dark:text-surface-500'
                  )}
                />
                <span
                  className={cn(
                    'transition-opacity duration-300 whitespace-nowrap',
                    collapsed ? 'opacity-0 md:hidden' : 'opacity-100'
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {user && (
          <div className="p-4 border-t border-surface-200 dark:border-charcoal-800 bg-surface-50/50 dark:bg-charcoal-900/50">
            <div className={cn("flex items-center gap-3", collapsed && "md:justify-center")}>
              <Avatar name={user.name} size="sm" className="w-9 h-9 flex-shrink-0" />
              <div
                className={cn(
                  'flex flex-col overflow-hidden transition-opacity duration-300',
                  collapsed ? 'opacity-0 md:hidden w-0' : 'opacity-100 w-auto'
                )}
              >
                <span className="text-sm font-semibold text-surface-900 dark:text-white truncate">{user.name}</span>
                <span className="text-xs text-surface-500 dark:text-surface-400 truncate">{user.role}</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className={cn(
                'flex items-center gap-2.5 w-full px-3 py-2 mt-3 text-xs font-semibold text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer',
                collapsed ? 'justify-center' : ''
              )}
              title={collapsed ? 'Logout' : undefined}
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              <span className={cn('whitespace-nowrap transition-opacity duration-300', collapsed ? 'opacity-0 md:hidden' : 'opacity-100')}>
                Sign Out
              </span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
