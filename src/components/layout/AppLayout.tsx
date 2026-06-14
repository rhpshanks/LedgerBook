import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  CreditCard, 
  Building2, 
  Users, 
  Settings,
  Menu,
  Search,
  Receipt,
  FileBarChart,
  Target,
  Type
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useState } from 'react';
import { NotificationsPanel } from './NotificationsPanel';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: FileText, label: 'Invoices', path: '/invoices' },
  { icon: Receipt, label: 'Expenses', path: '/expenses' },
  { icon: Building2, label: 'Banking', path: '/banking' },
  { icon: Users, label: 'Contacts', path: '/contacts' },
  { icon: Target, label: 'Payroll', path: '/payroll' },
  { icon: FileBarChart, label: 'Reports', path: '/reports' },
];

function LedgerBookLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="46" fill="#0E8744" />
      <path 
        d="M33 25v50h18" 
        stroke="white" 
        strokeWidth="7.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      <path 
        d="M45 25v38 M45 25h6c7 0, 12 5, 12 12.5s-5 12.5,-12 12.5h-6 M45 50h6c7 0, 12 5, 12 12.5c0 7.5,-3 12.5,-7 12.5" 
        stroke="white" 
        strokeWidth="7.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  );
}

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Topbar */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <LedgerBookLogo className="w-8 h-8 shrink-0" />
            <span className="font-bold text-lg hidden sm:block select-none">
              <span className="text-slate-900">Ledger</span>
              <span className="text-[#0E8744]">Book</span>
            </span>
          </div>
          
          <div className="ml-4 px-3 py-1 bg-slate-100 rounded-md border border-slate-200 text-sm font-medium text-slate-700 cursor-pointer hover:bg-slate-200 hidden md:block">
            ACME Corp
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-9 pr-4 py-1.5 bg-slate-100 border border-transparent rounded-full text-sm focus:bg-white focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 w-64 transition-all"
            />
          </div>
          <NotificationsPanel />
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center border border-slate-300 font-medium text-sm text-slate-700 cursor-pointer">
            JD
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className={cn(
          "bg-white border-r border-slate-200 transition-all duration-300 ease-in-out flex flex-col z-10",
          sidebarOpen ? "w-64" : "w-16",
          "hidden md:flex" // hidden on mobile for now
        )}>
          <nav className="flex-1 py-4 overflow-y-auto space-y-1 px-3">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                    isActive 
                      ? "bg-primary/5 text-primary font-medium" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  <item.icon className={cn("w-5 h-5 shrink-0", isActive ? "text-primary" : "text-slate-500")} />
                  {sidebarOpen && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t border-slate-200 space-y-1">
             <Link
                to="/settings"
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                  location.pathname.startsWith('/settings') && "bg-primary/5 text-primary font-medium"
                )}
                title={!sidebarOpen ? 'Settings' : undefined}
              >
                <Settings className={cn("w-5 h-5 shrink-0", location.pathname.startsWith('/settings') ? "text-primary" : "text-slate-500")} />
                {sidebarOpen && <span>Settings</span>}
              </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
