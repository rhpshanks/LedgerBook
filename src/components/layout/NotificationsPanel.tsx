import React, { useState, useRef, useEffect } from 'react';
import {
  Bell, X, Check, CheckCheck, AlertCircle, AlertTriangle,
  Info, TrendingDown, CreditCard, Users, FileText, DollarSign
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

type NotificationCategory = 'invoice' | 'payment' | 'payroll' | 'banking' | 'report' | 'system';
type NotificationSeverity = 'info' | 'warning' | 'error' | 'success';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  category: NotificationCategory;
  severity: NotificationSeverity;
}

const initialNotifications: Notification[] = [
  {
    id: 'n1',
    title: 'Overdue Invoice',
    message: 'Invoice INV-0003 for Soylent Corp ($890.00) is 12 days overdue.',
    time: '2 min ago',
    read: false,
    category: 'invoice',
    severity: 'error',
  },
  {
    id: 'n2',
    title: 'Payment Received',
    message: 'Acme Corp paid Invoice INV-0001 ($1,200.00). Bank account updated.',
    time: '28 min ago',
    read: false,
    category: 'payment',
    severity: 'success',
  },
  {
    id: 'n3',
    title: 'Payroll Due Tomorrow',
    message: 'Monthly payroll for 4 employees is due tomorrow. Total: $23,400.00.',
    time: '1 hr ago',
    read: false,
    category: 'payroll',
    severity: 'warning',
  },
  {
    id: 'n4',
    title: 'Low Bank Balance',
    message: 'Business Savings account balance ($4,210.00) is below your alert threshold of $5,000.00.',
    time: '3 hr ago',
    read: false,
    category: 'banking',
    severity: 'warning',
  },
  {
    id: 'n5',
    title: 'Balance Sheet Out of Balance',
    message: 'Your Balance Sheet has a mismatch of $2,500.00. Visit Reports → Balance Sheet to auto-reconcile.',
    time: '5 hr ago',
    read: false,
    category: 'report',
    severity: 'error',
  },
  {
    id: 'n6',
    title: 'New Invoice Pending',
    message: 'Globex Inc has an open invoice (INV-0002, $3,450.00) pending approval.',
    time: 'Yesterday',
    read: true,
    category: 'invoice',
    severity: 'info',
  },
  {
    id: 'n7',
    title: 'Exchange Rate Updated',
    message: 'EUR/USD rate has moved +1.3% today. Review your Currency Ledger in Settings.',
    time: 'Yesterday',
    read: true,
    category: 'system',
    severity: 'info',
  },
  {
    id: 'n8',
    title: 'Expense Report Ready',
    message: 'Your Q2 expense summary is ready. Total expenses this quarter: $58,340.00.',
    time: '2 days ago',
    read: true,
    category: 'report',
    severity: 'info',
  },
];

const categoryIcon: Record<NotificationCategory, React.ElementType> = {
  invoice: FileText,
  payment: DollarSign,
  payroll: Users,
  banking: CreditCard,
  report: TrendingDown,
  system: Info,
};

const severityStyles: Record<NotificationSeverity, { iconBg: string; icon: React.ElementType; iconColor: string }> = {
  error:   { iconBg: 'bg-rose-50',    icon: AlertCircle,    iconColor: 'text-rose-500' },
  warning: { iconBg: 'bg-amber-50',   icon: AlertTriangle,  iconColor: 'text-amber-500' },
  success: { iconBg: 'bg-emerald-50', icon: Check,          iconColor: 'text-emerald-500' },
  info:    { iconBg: 'bg-blue-50',    icon: Info,           iconColor: 'text-blue-500' },
};

const filterTabs = ['All', 'Unread', 'Invoices', 'Payments', 'Payroll', 'Banking'] as const;
type FilterTab = typeof filterTabs[number];

export function NotificationsPanel() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('All');
  const panelRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const dismiss = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const filtered = notifications.filter(n => {
    if (activeFilter === 'Unread') return !n.read;
    if (activeFilter === 'Invoices') return n.category === 'invoice';
    if (activeFilter === 'Payments') return n.category === 'payment';
    if (activeFilter === 'Payroll') return n.category === 'payroll';
    if (activeFilter === 'Banking') return n.category === 'banking';
    return true;
  });

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Trigger */}
      <button
        id="notificationsBell"
        onClick={() => setOpen(o => !o)}
        aria-label="Open notifications"
        className={cn(
          "relative p-2 rounded-full transition-colors",
          open ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-100"
        )}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span
            className="absolute top-1 right-1 min-w-[16px] h-4 px-0.5 bg-rose-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center leading-none shadow-sm"
            aria-label={`${unreadCount} unread notifications`}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div
          className="absolute right-0 top-12 w-96 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden"
          style={{ maxHeight: '560px' }}
          data-testid="notifications-panel"
        >
          {/* Panel Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">Notifications</h2>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-bold rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  title="Mark all as read"
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-primary font-medium px-2 py-1 rounded-md hover:bg-slate-50 transition-colors"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  title="Clear all notifications"
                  className="text-xs text-slate-400 hover:text-rose-500 font-medium px-2 py-1 rounded-md hover:bg-slate-50 transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-1 px-3 pt-2 pb-1 overflow-x-auto border-b border-slate-100">
            {filterTabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={cn(
                  "text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap transition-colors",
                  activeFilter === tab
                    ? "bg-primary text-white"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Notification List */}
          <div className="overflow-y-auto flex-1 divide-y divide-slate-50">
            {filtered.length === 0 ? (
              <div className="py-16 flex flex-col items-center text-center text-slate-400 gap-3">
                <Bell className="w-8 h-8 text-slate-200" />
                <p className="text-sm font-medium">All caught up!</p>
                <p className="text-xs text-slate-300">No notifications to show.</p>
              </div>
            ) : (
              filtered.map(n => {
                const SeverityIcon = severityStyles[n.severity].icon;
                const CategoryIcon = categoryIcon[n.category];
                const { iconBg, iconColor } = severityStyles[n.severity];

                return (
                  <div
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    className={cn(
                      "flex gap-3 px-4 py-3 cursor-pointer transition-colors group",
                      n.read ? "bg-white hover:bg-slate-50/70" : "bg-blue-50/30 hover:bg-blue-50/60"
                    )}
                  >
                    {/* Icon */}
                    <div className={cn("w-9 h-9 rounded-full shrink-0 flex items-center justify-center mt-0.5 relative", iconBg)}>
                      <CategoryIcon className={cn("w-4 h-4", iconColor)} />
                      <span className={cn(
                        "absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center border-2 border-white",
                        n.severity === 'error' ? 'bg-rose-500' :
                        n.severity === 'warning' ? 'bg-amber-500' :
                        n.severity === 'success' ? 'bg-emerald-500' : 'bg-blue-500'
                      )}>
                        <SeverityIcon className="w-2 h-2 text-white" strokeWidth={3} />
                      </span>
                    </div>

                    {/* Body */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={cn(
                          "text-xs leading-snug",
                          n.read ? "font-medium text-slate-700" : "font-bold text-slate-900"
                        )}>
                          {n.title}
                        </p>
                        <div className="flex items-center gap-1 shrink-0">
                          {!n.read && (
                            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                          )}
                          <button
                            onClick={e => { e.stopPropagation(); dismiss(n.id); }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-700"
                            aria-label="Dismiss notification"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">{n.message}</p>
                      <p className="text-[10px] text-slate-400 mt-1 font-medium">{n.time}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-slate-100 px-4 py-2.5 text-center">
              <button className="text-xs text-primary font-semibold hover:underline">
                View All Notification History
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
