import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronRight, Edit2, AlertCircle, RefreshCw, Download, FileText, Check } from 'lucide-react';
import { cn } from '@/src/lib/utils';

// 20 supported currencies matching SettingsPage rates
const supportedCurrencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1.0000 },
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.9240 },
  { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.7880 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 156.40 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.5120 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 1.3710 },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', rate: 0.8980 },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rate: 7.2430 },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', rate: 7.8120 },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', rate: 1.6320 },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', rate: 10.5340 },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', rate: 1.3480 },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', rate: 1378.0 },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', rate: 10.6120 },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$', rate: 18.420 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 83.520 },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', rate: 89.240 },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', rate: 18.350 },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', rate: 32.540 },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', rate: 5.3620 }
];

const initialBalances: Record<string, { thisPeriod: number; priorPeriod: number }> = {
  // Current Assets
  cash: { thisPeriod: 125000, priorPeriod: 98000 },
  ar: { thisPeriod: 45200, priorPeriod: 38000 },
  allowance: { thisPeriod: -2500, priorPeriod: -2000 },
  inventory: { thisPeriod: 68000, priorPeriod: 72000 },
  prepaid: { thisPeriod: 12000, priorPeriod: 10000 },
  short_invest: { thisPeriod: 50000, priorPeriod: 40000 },
  
  // Non-Current Assets
  ppe: { thisPeriod: 250000, priorPeriod: 220000 },
  depreciation: { thisPeriod: -60000, priorPeriod: -48000 },
  goodwill: { thisPeriod: 30000, priorPeriod: 30000 },
  patents: { thisPeriod: 15000, priorPeriod: 18000 },
  long_invest: { thisPeriod: 80000, priorPeriod: 70000 },
  
  // Current Liabilities
  ap: { thisPeriod: 34200, priorPeriod: 28000 },
  accrued_salaries: { thisPeriod: 15500, priorPeriod: 12000 },
  tax_payable: { thisPeriod: 8800, priorPeriod: 7500 },
  deferred_rev: { thisPeriod: 18000, priorPeriod: 15000 },
  short_debt: { thisPeriod: 25000, priorPeriod: 20000 },
  
  // Non-Current Liabilities
  long_debt: { thisPeriod: 120000, priorPeriod: 130000 },
  deferred_tax: { thisPeriod: 14000, priorPeriod: 12000 },
  pension: { thisPeriod: 35000, priorPeriod: 32000 },
  
  // Equity
  share_capital: { thisPeriod: 200000, priorPeriod: 180000 },
  retained_earnings: { thisPeriod: 149200, priorPeriod: 114500 },
  treasury_stock: { thisPeriod: -15000, priorPeriod: -10000 },
  aoci: { thisPeriod: 8000, priorPeriod: 5000 }
};

interface BalanceSheetProps {
  onBack: () => void;
}

export function BalanceSheet({ onBack }: BalanceSheetProps) {
  const [balances, setBalances] = useState(initialBalances);
  const [dateRange, setDateRange] = useState('This Year');
  const [displayCurrency, setDisplayCurrency] = useState('USD');
  const [compareWithPrior, setCompareWithPrior] = useState(true);
  
  // Expand/collapse states
  const [expanded, setExpanded] = useState({
    currentAssets: true,
    nonCurrentAssets: true,
    currentLiabilities: true,
    nonCurrentLiabilities: true,
    equity: true
  });

  // Editing modal state
  const [editingItem, setEditingItem] = useState<{
    id: string;
    name: string;
    period: 'thisPeriod' | 'priorPeriod';
    value: string;
  } | null>(null);

  const activeCurrency = supportedCurrencies.find(c => c.code === displayCurrency) || supportedCurrencies[0];
  const currencyRate = activeCurrency.rate;

  const handleDateRangeChange = (range: string) => {
    setDateRange(range);
    let factor = 1.0;
    if (range === 'Last Year') factor = 0.85;
    else if (range === 'This Quarter') factor = 0.95;
    else if (range === 'Last Quarter') factor = 0.91;

    setBalances(() => {
      const updated = { ...balances };
      Object.keys(initialBalances).forEach(key => {
        updated[key] = {
          thisPeriod: Math.round(initialBalances[key].thisPeriod * factor),
          priorPeriod: Math.round(initialBalances[key].priorPeriod * factor)
        };
      });
      return updated;
    });
  };

  const toggleSection = (section: keyof typeof expanded) => {
    setExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Convert USD raw amount to active display currency
  const formatAmount = (usdValue: number) => {
    const val = usdValue * currencyRate;
    return `${activeCurrency.symbol}${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Helpers to calculate sub-totals (in USD)
  const sumItems = (keys: string[], period: 'thisPeriod' | 'priorPeriod') => {
    return keys.reduce((sum, key) => sum + (balances[key]?.[period] || 0), 0);
  };

  const currentAssetKeys = ['cash', 'ar', 'allowance', 'inventory', 'prepaid', 'short_invest'];
  const nonCurrentAssetKeys = ['ppe', 'depreciation', 'goodwill', 'patents', 'long_invest'];
  
  const currentLiabilityKeys = ['ap', 'accrued_salaries', 'tax_payable', 'deferred_rev', 'short_debt'];
  const nonCurrentLiabilityKeys = ['long_debt', 'deferred_tax', 'pension'];
  
  const equityKeys = ['share_capital', 'retained_earnings', 'treasury_stock', 'aoci'];

  // Current values
  const totalCurrentAssets = sumItems(currentAssetKeys, 'thisPeriod');
  const totalNonCurrentAssets = sumItems(nonCurrentAssetKeys, 'thisPeriod');
  const totalAssets = totalCurrentAssets + totalNonCurrentAssets;

  const totalCurrentLiabilities = sumItems(currentLiabilityKeys, 'thisPeriod');
  const totalNonCurrentLiabilities = sumItems(nonCurrentLiabilityKeys, 'thisPeriod');
  const totalLiabilities = totalCurrentLiabilities + totalNonCurrentLiabilities;
  const totalEquity = sumItems(equityKeys, 'thisPeriod');
  const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;

  // Prior values
  const priorCurrentAssets = sumItems(currentAssetKeys, 'priorPeriod');
  const priorNonCurrentAssets = sumItems(nonCurrentAssetKeys, 'priorPeriod');
  const priorAssets = priorCurrentAssets + priorNonCurrentAssets;

  const priorCurrentLiabilities = sumItems(currentLiabilityKeys, 'priorPeriod');
  const priorNonCurrentLiabilities = sumItems(nonCurrentLiabilityKeys, 'priorPeriod');
  const priorLiabilities = priorCurrentLiabilities + priorNonCurrentLiabilities;
  const priorEquity = sumItems(equityKeys, 'priorPeriod');
  const priorLiabilitiesAndEquity = priorLiabilities + priorEquity;

  // Checking equation: Assets = Liabilities + Equity
  const diffThisPeriod = Math.round((totalAssets - totalLiabilitiesAndEquity) * 100) / 100;
  const diffPriorPeriod = Math.round((priorAssets - priorLiabilitiesAndEquity) * 100) / 100;

  // Perform one-click auto-balance using Retained Earnings
  const handleAutoBalance = () => {
    setBalances(prev => {
      const updated = { ...prev };
      if (diffThisPeriod !== 0) {
        updated.retained_earnings = {
          ...updated.retained_earnings,
          thisPeriod: updated.retained_earnings.thisPeriod + diffThisPeriod
        };
      }
      if (diffPriorPeriod !== 0) {
        updated.retained_earnings = {
          ...updated.retained_earnings,
          priorPeriod: updated.retained_earnings.priorPeriod + diffPriorPeriod
        };
      }
      return updated;
    });
  };

  const handleEditClick = (id: string, name: string, period: 'thisPeriod' | 'priorPeriod', currentUsdValue: number) => {
    // Show value in target display currency inside the editor
    const displayVal = (currentUsdValue * currencyRate).toFixed(2);
    setEditingItem({ id, name, period, value: displayVal });
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;
    const parsedVal = parseFloat(editingItem.value);
    if (isNaN(parsedVal)) return;

    // Convert from display currency back to USD base
    const usdVal = parsedVal / currencyRate;

    setBalances(prev => ({
      ...prev,
      [editingItem.id]: {
        ...prev[editingItem.id],
        [editingItem.period]: usdVal
      }
    }));
    setEditingItem(null);
  };

  // Variance calculator renderer
  const renderVariance = (thisVal: number, priorVal: number) => {
    if (!compareWithPrior) return null;
    const diff = thisVal - priorVal;
    const pct = priorVal !== 0 ? (diff / Math.abs(priorVal)) * 100 : 0;
    const formattedDiff = formatAmount(diff);
    
    return (
      <>
        <td className={cn(
          "px-6 py-2.5 text-right font-medium text-xs",
          diff >= 0 ? "text-emerald-600" : "text-rose-600"
        )}>
          {diff >= 0 ? `+${formattedDiff}` : formattedDiff}
        </td>
        <td className={cn(
          "px-6 py-2.5 text-right font-medium text-xs",
          diff >= 0 ? "text-emerald-600" : "text-rose-600"
        )}>
          {diff >= 0 ? `+${pct.toFixed(1)}%` : `${pct.toFixed(1)}%`}
        </td>
      </>
    );
  };

  // CSV/JSON Export handlers
  const exportCSV = () => {
    let csvContent = `Balance Sheet Report (As of: ${dateRange}, Currency: ${displayCurrency})\n\n`;
    csvContent += `Account,This Period,Prior Period,Variance,Variance %\n`;

    const addCategory = (title: string, keys: string[]) => {
      csvContent += `\n--- ${title} ---\n`;
      keys.forEach(k => {
        const item = balances[k];
        const thisVal = (item?.thisPeriod || 0) * currencyRate;
        const priorVal = (item?.priorPeriod || 0) * currencyRate;
        const diff = thisVal - priorVal;
        const pct = priorVal !== 0 ? (diff / Math.abs(priorVal)) * 100 : 0;
        csvContent += `"${k}",${thisVal.toFixed(2)},${priorVal.toFixed(2)},${diff.toFixed(2)},${pct.toFixed(1)}%\n`;
      });
    };

    addCategory('Current Assets', currentAssetKeys);
    addCategory('Non-Current Assets', nonCurrentAssetKeys);
    addCategory('Current Liabilities', currentLiabilityKeys);
    addCategory('Non-Current Liabilities', nonCurrentLiabilityKeys);
    addCategory('Equity', equityKeys);

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `balance_sheet_${dateRange.replace(/\s+/g, '_').toLowerCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportJSON = () => {
    const reportData = {
      dateRange,
      displayCurrency,
      exchangeRate: currencyRate,
      balancesInUsd: balances,
      balancesInDisplayCurrency: Object.keys(balances).reduce((acc, key) => {
        acc[key] = {
          thisPeriod: balances[key].thisPeriod * currencyRate,
          priorPeriod: balances[key].priorPeriod * currencyRate
        };
        return acc;
      }, {} as any)
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const link = document.createElement('a');
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `balance_sheet_${dateRange.replace(/\s+/g, '_').toLowerCase()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner and Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
            aria-label="Back to Reports"
          >
            <ArrowLeft className="w-4 h-4 text-slate-700" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              Balance Sheet
            </h1>
            <p className="text-xs text-slate-500">Financial Position Details • Multi-Currency Enabled</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Date Selector */}
          <div>
            <select 
              id="bsDateRange"
              value={dateRange}
              onChange={(e) => handleDateRangeChange(e.target.value)}
              className="bg-white border border-slate-200 rounded-md px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            >
              <option>This Year</option>
              <option>Last Year</option>
              <option>This Quarter</option>
              <option>Last Quarter</option>
            </select>
          </div>

          {/* Currency Switcher */}
          <div>
            <select 
              id="bsCurrency"
              value={displayCurrency}
              onChange={(e) => setDisplayCurrency(e.target.value)}
              className="bg-white border border-slate-200 rounded-md px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            >
              {supportedCurrencies.map(c => (
                <option key={c.code} value={c.code}>
                  {c.code} ({c.symbol})
                </option>
              ))}
            </select>
          </div>

          {/* Comparison Checkbox */}
          <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-1.5 border border-slate-200 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-100/70 transition-colors">
            <input 
              type="checkbox" 
              checked={compareWithPrior} 
              onChange={() => setCompareWithPrior(!compareWithPrior)}
              className="rounded text-primary focus:ring-primary border-slate-300 w-3.5 h-3.5"
            />
            Prior Period
          </label>

          {/* Export Actions */}
          <div className="flex gap-1.5">
            <button 
              onClick={exportCSV}
              className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              CSV
            </button>
            <button 
              onClick={exportJSON}
              className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              JSON
            </button>
            <button 
              onClick={() => window.print()}
              className="bg-primary hover:bg-primary/95 text-white px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              Print Report
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Equation Validation Banner */}
      {(diffThisPeriod !== 0 || diffPriorPeriod !== 0) && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 animate-fadeIn" data-testid="imbalance-banner">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <p className="text-sm font-semibold">Balance Sheet Out of Balance</p>
              <p className="text-xs text-rose-600/90">
                Assets do not equal Liabilities + Equity. Mismatch is{' '}
                <strong className="underline font-bold">
                  {formatAmount(diffThisPeriod)}
                </strong>{' '}
                (This Period) and{' '}
                <strong className="underline font-bold">
                  {formatAmount(diffPriorPeriod)}
                </strong>{' '}
                (Prior Period).
              </p>
            </div>
          </div>
          <button 
            onClick={handleAutoBalance}
            className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs px-3.5 py-1.5 rounded-lg shadow-sm transition-all whitespace-nowrap self-stretch sm:self-auto justify-center"
          >
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            Auto-Balance via Retained Earnings
          </button>
        </div>
      )}

      {/* Balanced Confirmation */}
      {diffThisPeriod === 0 && diffPriorPeriod === 0 && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl text-emerald-800 text-xs font-medium">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Balance sheet is fully balanced: Assets = Liabilities + Equity.</span>
        </div>
      )}

      {/* Table Structure */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-xs">
              <tr>
                <th className="px-6 py-3 min-w-[240px]">Account Name</th>
                <th className="px-6 py-3 text-right">This Period</th>
                {compareWithPrior && <th className="px-6 py-3 text-right">Prior Period</th>}
                {compareWithPrior && <th className="px-6 py-3 text-right">Variance</th>}
                {compareWithPrior && <th className="px-6 py-3 text-right">Variance %</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              
              {/* ASSETS SECTION */}
              <tr className="bg-slate-50/70">
                <td colSpan={compareWithPrior ? 5 : 2} className="px-6 py-2 font-bold text-slate-800 text-xs tracking-wider uppercase">
                  Assets
                </td>
              </tr>

              {/* Current Assets Subcategory */}
              <tr className="group hover:bg-slate-50/20 cursor-pointer" onClick={() => toggleSection('currentAssets')}>
                <td colSpan={compareWithPrior ? 5 : 2} className="px-6 py-3 font-semibold text-slate-900 flex items-center gap-1 text-xs">
                  {expanded.currentAssets ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
                  Current Assets
                </td>
              </tr>
              {expanded.currentAssets && [
                { id: 'cash', name: 'Cash and Cash Equivalents' },
                { id: 'ar', name: 'Accounts Receivable' },
                { id: 'allowance', name: 'Allowance for Doubtful Accounts' },
                { id: 'inventory', name: 'Inventory' },
                { id: 'prepaid', name: 'Prepaid Expenses' },
                { id: 'short_invest', name: 'Short-term Investments' }
              ].map(item => (
                <tr key={item.id} className="hover:bg-slate-50/40 transition-colors text-xs">
                  <td className="pl-12 pr-6 py-2.5 text-slate-600 font-medium">{item.name}</td>
                  <td className="px-6 py-2.5 text-right font-medium">
                    <button 
                      onClick={() => handleEditClick(item.id, item.name, 'thisPeriod', balances[item.id].thisPeriod)}
                      className="group/btn inline-flex items-center gap-1 text-slate-900 hover:text-primary font-semibold border-b border-transparent hover:border-primary/50 transition-colors"
                      title="Adjust amount"
                    >
                      {formatAmount(balances[item.id].thisPeriod)}
                      <Edit2 className="w-3 h-3 opacity-0 group-hover/btn:opacity-100 text-slate-400" />
                    </button>
                  </td>
                  {compareWithPrior && (
                    <td className="px-6 py-2.5 text-right text-slate-500">
                      <button 
                        onClick={() => handleEditClick(item.id, item.name, 'priorPeriod', balances[item.id].priorPeriod)}
                        className="group/btn inline-flex items-center gap-1 hover:text-primary border-b border-transparent hover:border-primary/50 transition-colors"
                        title="Adjust prior amount"
                      >
                        {formatAmount(balances[item.id].priorPeriod)}
                        <Edit2 className="w-3 h-3 opacity-0 group-hover/btn:opacity-100 text-slate-400" />
                      </button>
                    </td>
                  )}
                  {renderVariance(balances[item.id].thisPeriod, balances[item.id].priorPeriod)}
                </tr>
              ))}
              <tr className="bg-slate-50/30 text-xs font-semibold border-t border-slate-200">
                <td className="pl-6 px-6 py-3 text-slate-800 font-bold">Total Current Assets</td>
                <td className="px-6 py-3 text-right font-bold text-slate-900">{formatAmount(totalCurrentAssets)}</td>
                {compareWithPrior && <td className="px-6 py-3 text-right text-slate-700">{formatAmount(priorCurrentAssets)}</td>}
                {renderVariance(totalCurrentAssets, priorCurrentAssets)}
              </tr>

              {/* Non-Current Assets Subcategory */}
              <tr className="group hover:bg-slate-50/20 cursor-pointer" onClick={() => toggleSection('nonCurrentAssets')}>
                <td colSpan={compareWithPrior ? 5 : 2} className="px-6 py-3 font-semibold text-slate-900 flex items-center gap-1 text-xs">
                  {expanded.nonCurrentAssets ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
                  Non-Current Assets
                </td>
              </tr>
              {expanded.nonCurrentAssets && [
                { id: 'ppe', name: 'Property, Plant & Equipment' },
                { id: 'depreciation', name: 'Accumulated Depreciation' },
                { id: 'goodwill', name: 'Goodwill' },
                { id: 'patents', name: 'Intangible Assets (Patents)' },
                { id: 'long_invest', name: 'Long-term Investments' }
              ].map(item => (
                <tr key={item.id} className="hover:bg-slate-50/40 transition-colors text-xs">
                  <td className="pl-12 pr-6 py-2.5 text-slate-600 font-medium">{item.name}</td>
                  <td className="px-6 py-2.5 text-right font-medium">
                    <button 
                      onClick={() => handleEditClick(item.id, item.name, 'thisPeriod', balances[item.id].thisPeriod)}
                      className="group/btn inline-flex items-center gap-1 text-slate-900 hover:text-primary font-semibold border-b border-transparent hover:border-primary/50 transition-colors"
                    >
                      {formatAmount(balances[item.id].thisPeriod)}
                      <Edit2 className="w-3 h-3 opacity-0 group-hover/btn:opacity-100 text-slate-400" />
                    </button>
                  </td>
                  {compareWithPrior && (
                    <td className="px-6 py-2.5 text-right text-slate-500">
                      <button 
                        onClick={() => handleEditClick(item.id, item.name, 'priorPeriod', balances[item.id].priorPeriod)}
                        className="group/btn inline-flex items-center gap-1 hover:text-primary border-b border-transparent hover:border-primary/50 transition-colors"
                      >
                        {formatAmount(balances[item.id].priorPeriod)}
                        <Edit2 className="w-3 h-3 opacity-0 group-hover/btn:opacity-100 text-slate-400" />
                      </button>
                    </td>
                  )}
                  {renderVariance(balances[item.id].thisPeriod, balances[item.id].priorPeriod)}
                </tr>
              ))}
              <tr className="bg-slate-50/30 text-xs font-semibold border-t border-slate-200">
                <td className="pl-6 px-6 py-3 text-slate-800 font-bold">Total Non-Current Assets</td>
                <td className="px-6 py-3 text-right font-bold text-slate-900">{formatAmount(totalNonCurrentAssets)}</td>
                {compareWithPrior && <td className="px-6 py-3 text-right text-slate-700">{formatAmount(priorNonCurrentAssets)}</td>}
                {renderVariance(totalNonCurrentAssets, priorNonCurrentAssets)}
              </tr>

              {/* TOTAL ASSETS ROW */}
              <tr className="bg-slate-100/50 text-xs font-bold border-t-2 border-slate-300 border-b-2">
                <td className="px-6 py-3.5 text-slate-900 uppercase tracking-wide">Total Assets</td>
                <td className="px-6 py-3.5 text-right font-bold text-slate-950 text-sm">{formatAmount(totalAssets)}</td>
                {compareWithPrior && <td className="px-6 py-3.5 text-right text-slate-800 text-sm">{formatAmount(priorAssets)}</td>}
                {renderVariance(totalAssets, priorAssets)}
              </tr>

              {/* LIABILITIES SECTION */}
              <tr className="bg-slate-50/70">
                <td colSpan={compareWithPrior ? 5 : 2} className="px-6 py-2 font-bold text-slate-800 text-xs tracking-wider uppercase">
                  Liabilities
                </td>
              </tr>

              {/* Current Liabilities */}
              <tr className="group hover:bg-slate-50/20 cursor-pointer" onClick={() => toggleSection('currentLiabilities')}>
                <td colSpan={compareWithPrior ? 5 : 2} className="px-6 py-3 font-semibold text-slate-900 flex items-center gap-1 text-xs">
                  {expanded.currentLiabilities ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
                  Current Liabilities
                </td>
              </tr>
              {expanded.currentLiabilities && [
                { id: 'ap', name: 'Accounts Payable' },
                { id: 'accrued_salaries', name: 'Accrued Wages & Salaries' },
                { id: 'tax_payable', name: 'Income Taxes Payable' },
                { id: 'deferred_rev', name: 'Deferred Revenue' },
                { id: 'short_debt', name: 'Short-term Borrowings' }
              ].map(item => (
                <tr key={item.id} className="hover:bg-slate-50/40 transition-colors text-xs">
                  <td className="pl-12 pr-6 py-2.5 text-slate-600 font-medium">{item.name}</td>
                  <td className="px-6 py-2.5 text-right font-medium">
                    <button 
                      onClick={() => handleEditClick(item.id, item.name, 'thisPeriod', balances[item.id].thisPeriod)}
                      className="group/btn inline-flex items-center gap-1 text-slate-900 hover:text-primary font-semibold border-b border-transparent hover:border-primary/50 transition-colors"
                    >
                      {formatAmount(balances[item.id].thisPeriod)}
                      <Edit2 className="w-3 h-3 opacity-0 group-hover/btn:opacity-100 text-slate-400" />
                    </button>
                  </td>
                  {compareWithPrior && (
                    <td className="px-6 py-2.5 text-right text-slate-500">
                      <button 
                        onClick={() => handleEditClick(item.id, item.name, 'priorPeriod', balances[item.id].priorPeriod)}
                        className="group/btn inline-flex items-center gap-1 hover:text-primary border-b border-transparent hover:border-primary/50 transition-colors"
                      >
                        {formatAmount(balances[item.id].priorPeriod)}
                        <Edit2 className="w-3 h-3 opacity-0 group-hover/btn:opacity-100 text-slate-400" />
                      </button>
                    </td>
                  )}
                  {renderVariance(balances[item.id].thisPeriod, balances[item.id].priorPeriod)}
                </tr>
              ))}
              <tr className="bg-slate-50/30 text-xs font-semibold border-t border-slate-200">
                <td className="pl-6 px-6 py-3 text-slate-800 font-bold">Total Current Liabilities</td>
                <td className="px-6 py-3 text-right font-bold text-slate-900">{formatAmount(totalCurrentLiabilities)}</td>
                {compareWithPrior && <td className="px-6 py-3 text-right text-slate-700">{formatAmount(priorCurrentLiabilities)}</td>}
                {renderVariance(totalCurrentLiabilities, priorCurrentLiabilities)}
              </tr>

              {/* Non-Current Liabilities */}
              <tr className="group hover:bg-slate-50/20 cursor-pointer" onClick={() => toggleSection('nonCurrentLiabilities')}>
                <td colSpan={compareWithPrior ? 5 : 2} className="px-6 py-3 font-semibold text-slate-900 flex items-center gap-1 text-xs">
                  {expanded.nonCurrentLiabilities ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
                  Non-Current Liabilities
                </td>
              </tr>
              {expanded.nonCurrentLiabilities && [
                { id: 'long_debt', name: 'Long-term Debt' },
                { id: 'deferred_tax', name: 'Deferred Tax Liabilities' },
                { id: 'pension', name: 'Pension Obligations' }
              ].map(item => (
                <tr key={item.id} className="hover:bg-slate-50/40 transition-colors text-xs">
                  <td className="pl-12 pr-6 py-2.5 text-slate-600 font-medium">{item.name}</td>
                  <td className="px-6 py-2.5 text-right font-medium">
                    <button 
                      onClick={() => handleEditClick(item.id, item.name, 'thisPeriod', balances[item.id].thisPeriod)}
                      className="group/btn inline-flex items-center gap-1 text-slate-900 hover:text-primary font-semibold border-b border-transparent hover:border-primary/50 transition-colors"
                    >
                      {formatAmount(balances[item.id].thisPeriod)}
                      <Edit2 className="w-3 h-3 opacity-0 group-hover/btn:opacity-100 text-slate-400" />
                    </button>
                  </td>
                  {compareWithPrior && (
                    <td className="px-6 py-2.5 text-right text-slate-500">
                      <button 
                        onClick={() => handleEditClick(item.id, item.name, 'priorPeriod', balances[item.id].priorPeriod)}
                        className="group/btn inline-flex items-center gap-1 hover:text-primary border-b border-transparent hover:border-primary/50 transition-colors"
                      >
                        {formatAmount(balances[item.id].priorPeriod)}
                        <Edit2 className="w-3 h-3 opacity-0 group-hover/btn:opacity-100 text-slate-400" />
                      </button>
                    </td>
                  )}
                  {renderVariance(balances[item.id].thisPeriod, balances[item.id].priorPeriod)}
                </tr>
              ))}
              <tr className="bg-slate-50/30 text-xs font-semibold border-t border-slate-200">
                <td className="pl-6 px-6 py-3 text-slate-800 font-bold">Total Non-Current Liabilities</td>
                <td className="px-6 py-3 text-right font-bold text-slate-900">{formatAmount(totalNonCurrentLiabilities)}</td>
                {compareWithPrior && <td className="px-6 py-3 text-right text-slate-700">{formatAmount(priorNonCurrentLiabilities)}</td>}
                {renderVariance(totalNonCurrentLiabilities, priorNonCurrentLiabilities)}
              </tr>
              <tr className="bg-slate-50/50 text-xs font-semibold border-t border-slate-350">
                <td className="pl-6 px-6 py-3.5 text-slate-800 font-bold uppercase">Total Liabilities</td>
                <td className="px-6 py-3.5 text-right font-bold text-slate-900">{formatAmount(totalLiabilities)}</td>
                {compareWithPrior && <td className="px-6 py-3.5 text-right text-slate-700">{formatAmount(priorLiabilities)}</td>}
                {renderVariance(totalLiabilities, priorLiabilities)}
              </tr>

              {/* EQUITY SECTION */}
              <tr className="bg-slate-50/70">
                <td colSpan={compareWithPrior ? 5 : 2} className="px-6 py-2 font-bold text-slate-800 text-xs tracking-wider uppercase">
                  Equity
                </td>
              </tr>
              <tr className="group hover:bg-slate-50/20 cursor-pointer" onClick={() => toggleSection('equity')}>
                <td colSpan={compareWithPrior ? 5 : 2} className="px-6 py-3 font-semibold text-slate-900 flex items-center gap-1 text-xs">
                  {expanded.equity ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
                  Shareholder Equity
                </td>
              </tr>
              {expanded.equity && [
                { id: 'share_capital', name: 'Share Capital (Common Stock)' },
                { id: 'retained_earnings', name: 'Retained Earnings' },
                { id: 'treasury_stock', name: 'Treasury Stock' },
                { id: 'aoci', name: 'Accumulated Other Comprehensive Income' }
              ].map(item => (
                <tr key={item.id} className="hover:bg-slate-50/40 transition-colors text-xs">
                  <td className="pl-12 pr-6 py-2.5 text-slate-600 font-medium">{item.name}</td>
                  <td className="px-6 py-2.5 text-right font-medium">
                    <button 
                      onClick={() => handleEditClick(item.id, item.name, 'thisPeriod', balances[item.id].thisPeriod)}
                      className="group/btn inline-flex items-center gap-1 text-slate-900 hover:text-primary font-semibold border-b border-transparent hover:border-primary/50 transition-colors"
                    >
                      {formatAmount(balances[item.id].thisPeriod)}
                      <Edit2 className="w-3 h-3 opacity-0 group-hover/btn:opacity-100 text-slate-400" />
                    </button>
                  </td>
                  {compareWithPrior && (
                    <td className="px-6 py-2.5 text-right text-slate-500">
                      <button 
                        onClick={() => handleEditClick(item.id, item.name, 'priorPeriod', balances[item.id].priorPeriod)}
                        className="group/btn inline-flex items-center gap-1 hover:text-primary border-b border-transparent hover:border-primary/50 transition-colors"
                      >
                        {formatAmount(balances[item.id].priorPeriod)}
                        <Edit2 className="w-3 h-3 opacity-0 group-hover/btn:opacity-100 text-slate-400" />
                      </button>
                    </td>
                  )}
                  {renderVariance(balances[item.id].thisPeriod, balances[item.id].priorPeriod)}
                </tr>
              ))}
              <tr className="bg-slate-50/30 text-xs font-semibold border-t border-slate-200">
                <td className="pl-6 px-6 py-3.5 text-slate-800 font-bold uppercase">Total Equity</td>
                <td className="px-6 py-3.5 text-right font-bold text-slate-900">{formatAmount(totalEquity)}</td>
                {compareWithPrior && <td className="px-6 py-3.5 text-right text-slate-700">{formatAmount(priorEquity)}</td>}
                {renderVariance(totalEquity, priorEquity)}
              </tr>

              {/* TOTAL LIABILITIES & EQUITY ROW */}
              <tr className="bg-slate-100/50 text-xs font-bold border-t-2 border-slate-300 border-b-2">
                <td className="px-6 py-3.5 text-slate-900 uppercase tracking-wide">Total Liabilities & Equity</td>
                <td className="px-6 py-3.5 text-right font-bold text-slate-950 text-sm">{formatAmount(totalLiabilitiesAndEquity)}</td>
                {compareWithPrior && <td className="px-6 py-3.5 text-right text-slate-800 text-sm">{formatAmount(priorLiabilitiesAndEquity)}</td>}
                {renderVariance(totalLiabilitiesAndEquity, priorLiabilitiesAndEquity)}
              </tr>

            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Amount Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn" data-testid="edit-modal">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-sm w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Adjust Balance</h3>
            <div className="space-y-1">
              <p className="text-xs text-slate-500 font-semibold">{editingItem.name}</p>
              <p className="text-[11px] text-slate-400">
                Editing: <span className="font-semibold text-slate-600">{editingItem.period === 'thisPeriod' ? 'This Period' : 'Prior Period'}</span>
              </p>
            </div>
            
            <div>
              <label htmlFor="adjustRate" className="block text-xs font-semibold text-slate-700 mb-1">
                Amount ({displayCurrency})
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                  {activeCurrency.symbol}
                </span>
                <input 
                  id="adjustRate"
                  type="number" 
                  step="0.01"
                  value={editingItem.value} 
                  onChange={(e) => setEditingItem({ ...editingItem, value: e.target.value })}
                  className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-900 text-sm font-semibold"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button 
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-md text-xs font-bold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-primary text-white rounded-md text-xs font-bold hover:bg-primary/95 transition-colors"
              >
                Apply Change
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
