import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Download, FileText, PieChart, TrendingUp, Filter } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useState } from 'react';

const yearlyData = [
  { month: 'Jan', revenue: 15400, spend: 11200 },
  { month: 'Feb', revenue: 18200, spend: 12500 },
  { month: 'Mar', revenue: 21500, spend: 14800 },
  { month: 'Apr', revenue: 19800, spend: 13200 },
  { month: 'May', revenue: 24500, spend: 12340 },
  { month: 'Jun', revenue: 28900, spend: 15600 },
  { month: 'Jul', revenue: 26400, spend: 14200 },
  { month: 'Aug', revenue: 31200, spend: 16800 },
  { month: 'Sep', revenue: 29500, spend: 15400 },
  { month: 'Oct', revenue: 34800, spend: 18200 },
  { month: 'Nov', revenue: 32100, spend: 17500 },
  { month: 'Dec', revenue: 38900, spend: 19400 },
];

const reportCategories = [
  {
    title: 'Financial Statements',
    reports: [
      { name: 'Profit and Loss', description: 'Revenue minus expenses over a period.' },
      { name: 'Balance Sheet', description: 'Assets, liabilities, and equity at a specific point in time.' },
      { name: 'Cash Flow Statement', description: 'Cash inflows and outflows.' },
    ]
  },
  {
    title: 'Transactions & Balances',
    reports: [
      { name: 'Trial Balance', description: 'All general ledger account balances.' },
      { name: 'General Ledger', description: 'All transactions per general ledger account.' },
      { name: 'Bank Reconciliation Summary', description: 'History of completed bank reconciliations.' },
    ]
  },
  {
    title: 'Payables & Receivables',
    reports: [
      { name: 'Aged Receivables', description: 'Outstanding customer invoices grouped by age.' },
      { name: 'Aged Payables', description: 'Outstanding supplier bills grouped by age.' },
      { name: 'Customer Revenue Report', description: 'Total revenue separated by customer.' },
      { name: 'Supplier Spend Report', description: 'Total expenses separated by supplier.' },
    ]
  }
];

export function ReportsPage() {
  const [dateRange, setDateRange] = useState('This Year');

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-md min-w-[150px]">
          <p className="font-medium text-slate-900 mb-2">{label}</p>
          <div className="space-y-1.5">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-slate-600 font-medium">{entry.name}</span>
                </div>
                <span className="font-semibold text-slate-900">
                  ${entry.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const handleExportAll = () => {
    const exportData = {
      dateRange,
      trendsData: yearlyData,
      reportCategories
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ledgerbook-reports-export.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDownloadReport = (reportName: string) => {
    const reportData = {
      reportName,
      generatedAt: new Date().toISOString(),
      dateRange,
      data: reportName === 'Profit and Loss' 
        ? { revenue: 335000, expenses: 182000, netProfit: 153000 }
        : reportName === 'Balance Sheet'
        ? { assets: 542000, liabilities: 120000, equity: 422000 }
        : { message: `Simulated data for ${reportName}` }
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${reportName.toLowerCase().replace(/\s+/g, '-')}-report.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
        <div className="flex items-center gap-2">
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-white border border-slate-200 rounded-md px-3 py-1.5 text-sm font-medium text-slate-700 focus:outline-none focus:border-primary"
          >
            <option>This Year</option>
            <option>Last Year</option>
            <option>This Quarter</option>
            <option>Last Quarter</option>
          </select>
          <button 
            onClick={handleExportAll}
            className="bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export All</span>
          </button>
        </div>
      </div>

      {/* Main Chart Section */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Revenue & Spend Trends</h2>
            <p className="text-sm text-slate-500">Monthly breakdown for {dateRange.toLowerCase()}</p>
          </div>
          <button className="p-1.5 border border-slate-200 rounded-md text-slate-600 hover:bg-slate-50">
             <Filter className="w-5 h-5" />
          </button>
        </div>
        
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={yearlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dx={-10} tickFormatter={(val) => `$${val/1000}k`} />
              <Tooltip 
                content={<CustomTooltip />}
                cursor={{ fill: '#F1F5F9' }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
              <Bar dataKey="revenue" name="Revenue" fill="var(--color-primary)" radius={[4, 4, 0, 0]} maxBarSize={40} />
              <Bar dataKey="spend" name="Spend" fill="var(--color-destructive)" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Reports Directory */}
      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">Report Directory</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportCategories.map((category, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                <h3 className="font-medium text-slate-900">{category.title}</h3>
              </div>
              <ul className="divide-y divide-slate-100 flex-1 p-2">
                {category.reports.map((report, j) => (
                  <li key={j}>
                    <button 
                      onClick={() => handleDownloadReport(report.name)}
                      className="w-full text-left p-3 hover:bg-slate-50 rounded-lg transition-colors group flex items-start gap-3"
                    >
                      <div className="w-8 h-8 shrink-0 rounded bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors mt-0.5">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 mb-0.5">{report.name}</p>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{report.description}</p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
