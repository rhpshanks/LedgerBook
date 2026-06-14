import { Plus, Search, Filter, RefreshCw, Upload, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useState } from 'react';

const mockTransactions = [
  { id: 'TX-001', date: '2024-05-12', description: 'Stripe Payout', amount: 3400.00, type: 'credit', status: 'Matched', category: 'Sales Revenue' },
  { id: 'TX-002', date: '2024-05-12', description: 'AWS Cloud Services', amount: 240.00, type: 'debit', status: 'Unmatched', category: null },
  { id: 'TX-003', date: '2024-05-11', description: 'Acme Corp Invoice', amount: 1200.00, type: 'credit', status: 'Matched', category: 'Sales Revenue' },
  { id: 'TX-004', date: '2024-05-10', description: 'Office Supplies Inc', amount: 85.50, type: 'debit', status: 'Matched', category: 'Office Supplies' },
  { id: 'TX-005', date: '2024-05-09', description: 'Delta Airlines', amount: 850.00, type: 'debit', status: 'Unmatched', category: null },
];

const initialAccounts = [
  { id: 'acc-1', name: 'Operating Account', balance: 18450.00, primary: true },
  { id: 'acc-2', name: 'Savings Account', balance: 42000.00, primary: false },
];

export function BankingPage() {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [transactions, setTransactions] = useState(mockTransactions);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Match Modal
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchingTx, setMatchingTx] = useState<any>(null);
  const [categoryToMatch, setCategoryToMatch] = useState('Sales Revenue');

  // Add Account Modal
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [newAccName, setNewAccName] = useState('');
  const [newAccBalance, setNewAccBalance] = useState('');
  const [newAccPrimary, setNewAccPrimary] = useState(false);

  // Import Statement Modal
  const [showImportModal, setShowImportModal] = useState(false);

  const handleMatchTransaction = () => {
    if (!matchingTx) return;
    setTransactions(transactions.map(tx => {
      if (tx.id === matchingTx.id) {
        return { ...tx, status: 'Matched', category: categoryToMatch };
      }
      return tx;
    }));
    setShowMatchModal(false);
    setMatchingTx(null);
  };

  const handleAddAccount = () => {
    if (!newAccName || !newAccBalance) return;
    const balanceNum = parseFloat(newAccBalance);
    if (isNaN(balanceNum)) return;

    let updatedAccounts = accounts;
    if (newAccPrimary) {
      updatedAccounts = accounts.map(acc => ({ ...acc, primary: false }));
    }

    const newAcc = {
      id: `acc-${Date.now()}`,
      name: newAccName,
      balance: balanceNum,
      primary: newAccPrimary
    };

    setAccounts([...updatedAccounts, newAcc]);
    setShowAddAccountModal(false);
    setNewAccName('');
    setNewAccBalance('');
    setNewAccPrimary(false);
  };

  const handleImportMockStatement = () => {
    const importedTxs = [
      { id: `TX-${Date.now()}-1`, date: new Date().toISOString().split('T')[0], description: 'Google Cloud Platform', amount: 125.00, type: 'debit', status: 'Unmatched', category: null },
      { id: `TX-${Date.now()}-2`, date: new Date().toISOString().split('T')[0], description: 'GitHub Copilot', amount: 19.00, type: 'debit', status: 'Unmatched', category: null },
    ];
    setTransactions([...importedTxs, ...transactions]);
    setShowImportModal(false);
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesTab = activeTab === 'All' || tx.status === activeTab;
    const matchesSearch = tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (tx.category && tx.category.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Banking</h1>
        <div className="flex items-center gap-2">
           <button 
             onClick={() => setShowImportModal(true)}
             className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
           >
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Import Statement</span>
          </button>
          <button 
            onClick={() => setShowAddAccountModal(true)}
            className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Account
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Account Cards */}
        {accounts.map(acc => (
          <div 
            key={acc.id} 
            className={cn(
              "p-5 rounded-xl flex flex-col cursor-pointer transition-colors shadow-sm border",
              acc.primary 
                ? "bg-emerald-50 border-emerald-100 hover:border-emerald-200" 
                : "bg-white border-slate-200 hover:border-slate-300"
            )}
          >
            <div className="flex items-center justify-between mb-4">
               <span className={cn("font-semibold", acc.primary ? "text-emerald-900" : "text-slate-900")}>{acc.name}</span>
               {acc.primary && (
                 <span className="text-emerald-700 font-medium text-xs bg-emerald-100 px-2 py-0.5 rounded-full">Primary</span>
               )}
            </div>
            <div className="mt-auto">
               <p className={cn("text-sm font-medium mb-1", acc.primary ? "text-emerald-800" : "text-slate-500")}>Current Balance</p>
               <span className={cn("text-2xl font-bold", acc.primary ? "text-emerald-900" : "text-slate-900")}>
                 ${acc.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
               </span>
            </div>
          </div>
        ))}

        <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl border-dashed flex flex-col items-center justify-center text-slate-500 hover:text-slate-700 hover:border-slate-300 transition-colors cursor-pointer min-h-[140px]">
           <Plus className="w-6 h-6 mb-2" />
           <span className="font-medium text-sm">Connect Bank Feed</span>
           <span className="text-xs mt-1">Coming in Phase 2</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex bg-slate-100 p-1 rounded-lg w-full sm:w-auto">
             {['All', 'Unmatched', 'Matched'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-1.5 text-sm font-medium rounded-md transition-all flex-1 sm:flex-none",
                  activeTab === tab 
                    ? "bg-white text-slate-900 shadow-sm" 
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
             <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search transactions..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-md text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all text-slate-900"
              />
            </div>
            <button className="p-1.5 border border-slate-200 rounded-md text-slate-600 hover:bg-slate-50 flex shrink-0">
               <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
              <tr>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Description</th>
                <th className="px-6 py-3 font-medium">Category / Match</th>
                <th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-3 text-slate-600">{tx.date}</td>
                  <td className="px-6 py-3 font-medium text-slate-900">{tx.description}</td>
                  <td className="px-6 py-3">
                    {tx.status === 'Matched' ? (
                       <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-xs font-medium text-slate-700">
                        {tx.category}
                      </span>
                    ) : (
                       <span className="inline-flex items-center text-xs font-medium text-amber-600">
                        Select a category to match
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3">
                     <span className={cn(
                      "font-medium flex items-center gap-1",
                      tx.type === 'credit' ? "text-emerald-600" : "text-slate-900"
                    )}>
                      {tx.type === 'credit' ? <ArrowDownRight className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />}
                      {tx.type === 'credit' ? '+' : ''}{tx.amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    {tx.status === 'Matched' ? (
                       <span className="inline-flex items-center text-emerald-600 font-medium text-sm">
                        <RefreshCw className="w-3.5 h-3.5 mr-1" />
                        Matched
                       </span>
                    ) : (
                        <button 
                          onClick={() => {
                            setMatchingTx(tx);
                            setShowMatchModal(true);
                          }}
                          className="bg-white border border-slate-200 text-slate-700 px-3 py-1 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors"
                        >
                          Add Match
                        </button>
                    )}
                  </td>
                </tr>
              ))}
               {filteredTransactions.length === 0 && (
                <tr>
                   <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      No transactions found for this tab.
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Match Modal */}
      {showMatchModal && matchingTx && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Match Transaction</h3>
            <p className="text-sm text-slate-600">
              Select a category to match the transaction <strong>"{matchingTx.description}"</strong> of amount <strong>${matchingTx.amount.toFixed(2)}</strong>.
            </p>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select 
                id="category"
                value={categoryToMatch} 
                onChange={(e) => setCategoryToMatch(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900"
              >
                <option value="Sales Revenue">Sales Revenue</option>
                <option value="Office Supplies">Office Supplies</option>
                <option value="Software Subscriptions">Software Subscriptions</option>
                <option value="Travel">Travel</option>
                <option value="Rent">Rent</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button 
                onClick={() => setShowMatchModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleMatchTransaction}
                className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90"
              >
                Match
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Account Modal */}
      {showAddAccountModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Add Bank Account</h3>
            <div className="space-y-3">
              <div>
                <label htmlFor="accountName" className="block text-sm font-medium text-slate-700 mb-1">Account Name</label>
                <input 
                  id="accountName"
                  type="text" 
                  value={newAccName} 
                  onChange={(e) => setNewAccName(e.target.value)}
                  placeholder="e.g. Credit Card" 
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900"
                />
              </div>
              <div>
                <label htmlFor="accountBalance" className="block text-sm font-medium text-slate-700 mb-1">Initial Balance ($)</label>
                <input 
                  id="accountBalance"
                  type="number" 
                  value={newAccBalance} 
                  onChange={(e) => setNewAccBalance(e.target.value)}
                  placeholder="0.00" 
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900"
                />
              </div>
              <div className="flex items-center gap-2">
                <input 
                  id="accountPrimary"
                  type="checkbox" 
                  checked={newAccPrimary} 
                  onChange={(e) => setNewAccPrimary(e.target.checked)}
                  className="rounded border-slate-300 text-primary focus:ring-primary"
                />
                <label htmlFor="accountPrimary" className="text-sm font-medium text-slate-700">Set as Primary Account</label>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button 
                onClick={() => setShowAddAccountModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddAccount}
                className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90"
              >
                Add Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Statement Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Import Bank Statement</h3>
            <p className="text-sm text-slate-600">
              Select a bank statement file (CSV, QFX, or OFX) to upload. For demo purposes, importing will append mock transactions to your unmatched list.
            </p>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-700">Drag and drop file here, or click to browse</p>
              <p className="text-xs text-slate-500 mt-1">Supports CSV, QFX, OFX (Max 10MB)</p>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button 
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleImportMockStatement}
                className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90"
              >
                Import Demo Statement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
