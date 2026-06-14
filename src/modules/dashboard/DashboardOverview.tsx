import { TrendingUp, TrendingDown, Clock, ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { cn } from '@/src/lib/utils';

const data = [
  { name: 'Jan', revenue: 4000, expenses: 2400 },
  { name: 'Feb', revenue: 3000, expenses: 1398 },
  { name: 'Mar', revenue: 2000, expenses: 9800 },
  { name: 'Apr', revenue: 2780, expenses: 3908 },
  { name: 'May', revenue: 1890, expenses: 4800 },
  { name: 'Jun', revenue: 2390, expenses: 3800 },
  { name: 'Jul', revenue: 3490, expenses: 4300 },
];

export function DashboardOverview() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <div className="flex items-center gap-2">
          <select className="bg-white border border-slate-200 rounded-md px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:border-primary">
            <option>This Month</option>
            <option>Last Month</option>
            <option>This Quarter</option>
            <option>This Year</option>
          </select>
          <button className="bg-primary text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
            New Invoice
          </button>
        </div>
      </div>

      {/* KPIS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <span className="text-sm font-medium text-slate-500 mb-1">Total Revenue</span>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold text-slate-900">$24,500</span>
            <div className="flex items-center text-emerald-600 text-sm font-medium">
              <TrendingUp className="w-4 h-4 mr-1" />
              12%
            </div>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <span className="text-sm font-medium text-slate-500 mb-1">Total Expenses</span>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold text-slate-900">$12,340</span>
            <div className="flex items-center text-rose-600 text-sm font-medium">
              <TrendingUp className="w-4 h-4 mr-1" />
              4%
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <span className="text-sm font-medium text-slate-500 mb-1">Net Profit</span>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold text-slate-900">$12,160</span>
            <div className="flex items-center text-emerald-600 text-sm font-medium">
              <TrendingUp className="w-4 h-4 mr-1" />
              18%
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <span className="text-sm font-medium text-slate-500 mb-1">Outstanding Invoices</span>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold text-slate-900">$5,200</span>
            <div className="flex items-center text-slate-500 text-sm font-medium">
              <Clock className="w-4 h-4 mr-1" />
              8 pending
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-base font-semibold text-slate-900 mb-6">Revenue vs Expenses</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-destructive)" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="var(--color-destructive)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dx={-10} tickFormatter={(val) => `$${val/1000}k`} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`$${value}`, undefined]}
                />
                <Area type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="expenses" stroke="var(--color-destructive)" strokeWidth={2} fillOpacity={1} fill="url(#colorExpenses)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side panels */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-base font-semibold text-slate-900 mb-4">Cash in Bank</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Operating Acc</p>
                    <p className="text-xs text-slate-500">**** 4532</p>
                  </div>
                </div>
                <span className="font-semibold text-slate-900">$18,450.00</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Savings</p>
                    <p className="text-xs text-slate-500">**** 9981</p>
                  </div>
                </div>
                <span className="font-semibold text-slate-900">$42,000.00</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
             <h2 className="text-base font-semibold text-slate-900 mb-4">Recent Transactions</h2>
             <div className="space-y-3">
                {[
                  { name: 'Stripe Payout', type: 'revenue', amount: 3400, date: 'Today' },
                  { name: 'AWS Cloud', type: 'expense', amount: -240, date: 'Yesterday' },
                  { name: 'Acme Corp Invoice', type: 'revenue', amount: 1200, date: 'May 12' },
                  { name: 'Office Supplies', type: 'expense', amount: -85, date: 'May 10' }
                ].map((tx, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", tx.type === 'revenue' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600")}>
                        {tx.type === 'revenue' ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{tx.name}</p>
                        <p className="text-xs text-slate-500">{tx.date}</p>
                      </div>
                    </div>
                    <span className={cn("text-sm font-medium", tx.type === 'revenue' ? 'text-emerald-600' : 'text-slate-900')}>
                      {tx.type === 'revenue' ? '+' : ''}{tx.amount}
                    </span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
