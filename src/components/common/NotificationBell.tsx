import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  CheckCheck, 
  ExternalLink, 
  AlertTriangle, 
  MessageSquare, 
  CheckCircle, 
  Wrench, 
  X,
  Clock
} from 'lucide-react';
import { cn } from '@/utils/cn';
import type { Notification } from '@/types';
import { formatRelativeTime } from '@/utils/formatters';
import { mockNotifications } from '@/data/mockNotifications';

const NOTIFICATIONS_STORAGE_KEY = 'servicedesk_notifications_v1';

export interface NotificationBellProps {
  className?: string;
  initialNotifications?: Notification[];
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ className, initialNotifications }) => {
  const [open, setOpen] = useState(false);
  const [maintenanceModalOpen, setMaintenanceModalOpen] = useState(false);
  const [activeMaintenanceNotice, setActiveMaintenanceNotice] = useState<Notification | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Load from localStorage or mock
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    try {
      const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      // fallback
    }
    return initialNotifications || mockNotifications;
  });

  // Save changes to localStorage
  const updateNotifications = (newList: Notification[]) => {
    setNotifications(newList);
    try {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(newList));
    } catch (e) {
      console.warn('Error saving notifications', e);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [open]);

  // Handle Mark All as Read
  const handleMarkAllAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = notifications.map(n => ({ ...n, read: true }));
    updateNotifications(updated);
  };

  // Handle Individual Notification Click
  const handleNotificationClick = (notification: Notification) => {
    // 1. Mark as read immediately
    const updated = notifications.map(n => 
      n.id === notification.id ? { ...n, read: true } : n
    );
    updateNotifications(updated);
    setOpen(false);

    // 2. Action based on notification type / title
    if (notification.ticketId) {
      // Navigates directly to the ticket (SLA Warning, Ticket Assigned, New Comment, Ticket Resolved)
      navigate(`/tickets/${notification.ticketId}`);
    } else if (notification.title.toLowerCase().includes('maintenance') || notification.title.toLowerCase().includes('system')) {
      // Opens Maintenance modal details
      setActiveMaintenanceNotice(notification);
      setMaintenanceModalOpen(true);
    }
  };

  const getNotificationIcon = (title: string, type: string) => {
    const t = title.toLowerCase();
    if (t.includes('sla')) return <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />;
    if (t.includes('comment')) return <MessageSquare className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />;
    if (t.includes('resolved')) return <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />;
    if (t.includes('maintenance')) return <Wrench className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />;
    return <Bell className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />;
  };

  return (
    <>
      <div className={cn("relative inline-block text-left", className)} ref={dropdownRef}>
        <button
          onClick={() => setOpen(!open)}
          className="relative p-2.5 rounded-full text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white hover:bg-surface-100 dark:hover:bg-charcoal-800 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
          title="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white shadow-sm animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-84 sm:w-96 rounded-2xl border border-surface-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-900 shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
            <div className="bg-surface-50 dark:bg-charcoal-850 px-4 py-3 border-b border-surface-200 dark:border-charcoal-700 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-surface-900 dark:text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-brand-100 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors cursor-pointer"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark all as read</span>
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto divide-y divide-surface-100 dark:divide-charcoal-800">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-sm text-surface-500 dark:text-surface-400">
                  No notifications
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={cn(
                      "p-4 hover:bg-surface-50 dark:hover:bg-charcoal-800/80 transition-colors cursor-pointer flex items-start gap-3",
                      !notification.read ? "bg-orange-50/40 dark:bg-brand-950/20" : ""
                    )}
                  >
                    {getNotificationIcon(notification.title, notification.type)}

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-1">
                        <p className={cn(
                          "text-sm font-semibold truncate",
                          !notification.read ? "text-surface-900 dark:text-white" : "text-surface-700 dark:text-surface-300"
                        )}>
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <span className="flex-shrink-0 w-2 h-2 rounded-full bg-brand-500 mt-1" />
                        )}
                      </div>

                      <p className="text-xs text-surface-600 dark:text-surface-400 mt-0.5 line-clamp-2 leading-relaxed">
                        {notification.message}
                      </p>

                      <div className="flex items-center justify-between mt-2 pt-1">
                        <span className="text-[11px] text-surface-400 dark:text-surface-500">
                          {formatRelativeTime(notification.createdAt)}
                        </span>
                        {notification.ticketId ? (
                          <span className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 flex items-center gap-0.5">
                            Open {notification.ticketId}
                            <ExternalLink className="w-3 h-3" />
                          </span>
                        ) : (
                          <span className="text-[11px] font-semibold text-brand-600 dark:text-brand-400">
                            View details
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* System Maintenance Modal */}
      {maintenanceModalOpen && activeMaintenanceNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-charcoal-900 rounded-3xl border border-surface-200 dark:border-charcoal-700 max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-surface-100 dark:border-charcoal-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-brand-100 dark:bg-brand-950 text-brand-600">
                  <Wrench className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-surface-900 dark:text-white">
                  {activeMaintenanceNotice.title}
                </h3>
              </div>
              <button 
                onClick={() => setMaintenanceModalOpen(false)}
                className="p-1 rounded-lg text-surface-400 hover:text-surface-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-5 space-y-4">
              <p className="text-sm text-surface-700 dark:text-surface-300 leading-relaxed">
                {activeMaintenanceNotice.message}
              </p>

              <div className="p-4 rounded-2xl bg-surface-50 dark:bg-charcoal-800/60 border border-surface-200 dark:border-charcoal-700 text-xs space-y-2">
                <div className="flex items-center justify-between text-surface-600 dark:text-surface-400">
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-brand-500" /> Scheduled Window:</span>
                  <span className="font-semibold text-surface-900 dark:text-white">02:00 AM - 04:00 AM EST</span>
                </div>
                <div className="flex items-center justify-between text-surface-600 dark:text-surface-400">
                  <span>Impacted Services:</span>
                  <span className="font-semibold text-surface-900 dark:text-white">API Sync & Background Workers</span>
                </div>
                <div className="flex items-center justify-between text-surface-600 dark:text-surface-400">
                  <span>Status:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider text-[10px]">Planned</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setMaintenanceModalOpen(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm shadow-orange-glow transition-all"
              >
                Acknowledge Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
