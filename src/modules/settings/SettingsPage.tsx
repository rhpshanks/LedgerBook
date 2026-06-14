import { Plus, Search, Filter, Save, Building, Users } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useState } from 'react';

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('Organization');
  const [companyName, setCompanyName] = useState('ACME Corp');
  const [currency, setCurrency] = useState('USD');
  const [fiscalStart, setFiscalStart] = useState('1');
  const [taxNumber, setTaxNumber] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSaveChanges = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
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
                          onChange={(e) => setCurrency(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900"
                        >
                           <option value="USD">USD - US Dollar</option>
                           <option value="EUR">EUR - Euro</option>
                           <option value="GBP">GBP - British Pound</option>
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

           {activeTab !== 'Organization' && (
              <div className="py-20 text-center text-slate-500">
                 {activeTab} Settings - Coming in Phase 1.1
              </div>
           )}
        </div>
      </div>
    </div>
  );
}
