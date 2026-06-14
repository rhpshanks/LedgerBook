import { Plus, Search, Filter, Save, Building, Users, Globe, Edit2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useState } from 'react';

const initialCurrencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$', rateToUsd: 1.0000, rate: 1.0000 },
  { code: 'EUR', name: 'Euro', symbol: '€', rateToUsd: 0.9240, rate: 0.9240 },
  { code: 'GBP', name: 'British Pound', symbol: '£', rateToUsd: 0.7880, rate: 0.7880 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rateToUsd: 156.40, rate: 156.40 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rateToUsd: 1.5120, rate: 1.5120 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rateToUsd: 1.3710, rate: 1.3710 },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', rateToUsd: 0.8980, rate: 0.8980 },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rateToUsd: 7.2430, rate: 7.2430 },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', rateToUsd: 7.8120, rate: 7.8120 },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', rateToUsd: 1.6320, rate: 1.6320 },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', rateToUsd: 10.5340, rate: 10.5340 },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', rateToUsd: 1.3480, rate: 1.3480 },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', rateToUsd: 1378.0, rate: 1378.0 },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', rateToUsd: 10.6120, rate: 10.6120 },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$', rateToUsd: 18.420, rate: 18.420 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', rateToUsd: 83.520, rate: 83.520 },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', rateToUsd: 89.240, rate: 89.240 },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', rateToUsd: 18.350, rate: 18.350 },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', rateToUsd: 32.540, rate: 32.540 },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', rateToUsd: 5.3620, rate: 5.3620 }
];

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('Organization');
  const [companyName, setCompanyName] = useState('ACME Corp');
  const [currency, setCurrency] = useState('USD');
  const [fiscalStart, setFiscalStart] = useState('1');
  const [taxNumber, setTaxNumber] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Currencies State
  const [currencies, setCurrencies] = useState(initialCurrencies);
  const [currencySearch, setCurrencySearch] = useState('');
  const [editingCurrency, setEditingCurrency] = useState<any>(null);
  const [editRateValue, setEditRateValue] = useState('');

  const handleSaveChanges = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  const handleBaseCurrencyChange = (newBaseCode: string) => {
    setCurrency(newBaseCode);
    const baseCurr = currencies.find(c => c.code === newBaseCode);
    if (!baseCurr) return;
    const baseRateToUsd = baseCurr.rateToUsd;
    setCurrencies(currencies.map(c => ({
      ...c,
      rate: c.rateToUsd / baseRateToUsd
    })));
  };
  
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
      </div>

      {showSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-sm font-medium">
          Settings saved successfully!
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        {/* Settings Navigation */}
        <div className="w-full md:w-64 shrink-0">
          <nav className="flex md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0">
            {[
              { id: 'Organization', icon: Building },
              { id: 'Currencies', icon: Globe },
              { id: 'Users & Roles', icon: Users },
              { id: 'Integrations', icon: Plus },
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors whitespace-nowrap text-sm font-medium",
                  activeTab === tab.id 
                    ? "bg-primary text-white shadow-sm" 
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-white" : "text-slate-500")} />
                {tab.id}
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm p-6">
           {activeTab === 'Organization' && (
              <div className="space-y-6 max-w-2xl">
                 <div>
                    <h2 className="text-lg font-semibold text-slate-900 mb-1">Organization Profile</h2>
                    <p className="text-sm text-slate-500 mb-6">Update your company details and base currency.</p>
                 </div>

                 <div className="space-y-4">
                    <div>
                      <label htmlFor="companyName" className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                      <input 
                        id="companyName"
                        type="text" 
                        value={companyName} 
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900" 
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="baseCurrency" className="block text-sm font-medium text-slate-700 mb-1">Base Currency</label>
                        <select 
                          id="baseCurrency"
                          value={currency} 
                          onChange={(e) => handleBaseCurrencyChange(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900"
                        >
                          {currencies.map(c => (
                            <option key={c.code} value={c.code}>
                              {c.code} - {c.name} ({c.symbol})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="fiscalStart" className="block text-sm font-medium text-slate-700 mb-1">Fiscal Year Start</label>
                        <select 
                          id="fiscalStart"
                          value={fiscalStart} 
                          onChange={(e) => setFiscalStart(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900"
                        >
                           <option value="1">January 1st</option>
                           <option value="4">April 1st</option>
                           <option value="7">July 1st</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="taxNumber" className="block text-sm font-medium text-slate-700 mb-1">Tax/Registration Number</label>
                      <input 
                        id="taxNumber"
                        type="text" 
                        value={taxNumber} 
                        onChange={(e) => setTaxNumber(e.target.value)}
                        placeholder="VAT or GST Number" 
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900" 
                      />
                    </div>

                    <div className="pt-4 flex justify-end">
                       <button 
                         onClick={handleSaveChanges}
                         className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                       >
                        <Save className="w-4 h-4" />
                        Save Changes
                      </button>
                    </div>
                 </div>
              </div>
           )}

           {activeTab === 'Currencies' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 mb-1">Currency Ledger</h2>
                    <p className="text-sm text-slate-500">View and update exchange rates relative to your base currency (<strong>{currency}</strong>).</p>
                  </div>
                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search currencies..." 
                      value={currencySearch}
                      onChange={(e) => setCurrencySearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-md text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all text-slate-900"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                      <tr>
                        <th className="px-6 py-3 font-medium">Code</th>
                        <th className="px-6 py-3 font-medium">Name</th>
                        <th className="px-6 py-3 font-medium">Symbol</th>
                        <th className="px-6 py-3 font-medium text-right">Exchange Rate (per 1 {currency})</th>
                        <th className="px-6 py-3 font-medium text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {currencies
                        .filter(c => 
                          c.code.toLowerCase().includes(currencySearch.toLowerCase()) || 
                          c.name.toLowerCase().includes(currencySearch.toLowerCase())
                        )
                        .map(c => (
                          <tr key={c.code} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-3 font-semibold text-slate-900">{c.code}</td>
                            <td className="px-6 py-3 text-slate-600">{c.name}</td>
                            <td className="px-6 py-3 text-slate-600 font-medium">{c.symbol}</td>
                            <td className="px-6 py-3 text-right font-medium text-slate-900">
                              {c.code === currency ? '1.0000 (Base)' : c.rate.toFixed(4)}
                            </td>
                            <td className="px-6 py-3 text-right">
                              {c.code !== currency ? (
                                <button 
                                  onClick={() => {
                                    setEditingCurrency(c);
                                    setEditRateValue(c.rate.toString());
                                  }}
                                  className="inline-flex items-center gap-1 bg-white border border-slate-200 text-slate-700 px-2.5 py-1 rounded hover:bg-slate-50 transition-colors text-xs font-medium"
                                >
                                  <Edit2 className="w-3 h-3" />
                                  Edit Rate
                                </button>
                              ) : (
                                <span className="text-xs font-semibold text-emerald-600">Base Currency</span>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
           )}

           {activeTab !== 'Organization' && activeTab !== 'Currencies' && (
              <div className="py-20 text-center text-slate-500">
                 {activeTab} Settings - Coming in Phase 1.1
              </div>
           )}
        </div>
      </div>

      {/* Edit Rate Modal */}
      {editingCurrency && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-sm w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Edit Exchange Rate</h3>
            <p className="text-sm text-slate-600">
              Set the exchange rate for <strong>{editingCurrency.code} ({editingCurrency.name})</strong> relative to 1 {currency}.
            </p>
            <div>
              <label htmlFor="editRate" className="block text-sm font-medium text-slate-700 mb-1">Exchange Rate</label>
              <input 
                id="editRate"
                type="number" 
                step="0.0001"
                value={editRateValue} 
                onChange={(e) => setEditRateValue(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button 
                onClick={() => setEditingCurrency(null)}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  const val = parseFloat(editRateValue);
                  if (isNaN(val) || val <= 0) return;
                  
                  // Update current rate and backing USD rate for consistent conversions
                  const baseCurr = currencies.find(c => c.code === currency)!;
                  const newRateToUsd = val * baseCurr.rateToUsd;

                  setCurrencies(currencies.map(c => {
                    if (c.code === editingCurrency.code) {
                      return { ...c, rate: val, rateToUsd: newRateToUsd };
                    }
                    return c;
                  }));
                  setEditingCurrency(null);
                }}
                className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
