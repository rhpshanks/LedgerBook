import { Plus, Search, Filter, MoreHorizontal, Download, FileEdit, Trash, ReceiptText } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useState } from 'react';

const mockExpenses = [
  { id: 'EXP-101', merchant: 'AWS', date: '2024-05-10', category: 'Software Subscriptions', amount: 245.50, status: 'Completed' },
  { id: 'EXP-102', merchant: 'Delta Airlines', date: '2024-05-11', category: 'Travel', amount: 850.00, status: 'Pending' },
  { id: 'EXP-103', merchant: 'WeWork', date: '2024-05-12', category: 'Rent', amount: 1500.00, status: 'Completed' },
  { id: 'EXP-104', merchant: 'Office Depot', date: '2024-05-14', category: 'Office Supplies', amount: 45.99, status: 'Completed' },
  { id: 'EXP-105', merchant: 'Upwork', date: '2024-05-15', category: 'Contractors', amount: 650.00, status: 'Pending' },
];

export function ExpensesPage() {
  const [expenses, setExpenses] = useState(mockExpenses);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any>(null);

  // Form state
  const [merchant, setMerchant] = useState('');
  const [category, setCategory] = useState('Software Subscriptions');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('Completed');

  const handleOpenCreateModal = () => {
    setEditingExpense(null);
    setMerchant('');
    setCategory('Software Subscriptions');
    setAmount('');
    setStatus('Completed');
    setShowCreateModal(true);
  };

  const handleOpenEditModal = (expense: any) => {
    setEditingExpense(expense);
    setMerchant(expense.merchant);
    setCategory(expense.category);
    setAmount(expense.amount.toString());
    setStatus(expense.status);
    setShowCreateModal(true);
  };

  const handleSaveExpense = () => {
    if (!merchant || !amount) return;
    if (editingExpense) {
      setExpenses(expenses.map(exp => {
        if (exp.id === editingExpense.id) {
          return { ...exp, merchant, category, amount: parseFloat(amount), status };
        }
        return exp;
      }));
    } else {
      const nextIdNum = expenses.reduce((max, exp) => {
        const num = parseInt(exp.id.replace('EXP-', ''));
        return num > max ? num : max;
      }, 0) + 1;
      const nextId = `EXP-${nextIdNum}`;
      const newExpense = {
        id: nextId,
        merchant,
        date: new Date().toISOString().split('T')[0],
        category,
        amount: parseFloat(amount),
        status
      };
      setExpenses([...expenses, newExpense]);
    }
    setMerchant('');
    setCategory('Software Subscriptions');
    setAmount('');
    setStatus('Completed');
    setEditingExpense(null);
    setShowCreateModal(false);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  const handleDownloadReceipt = (expense: any) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(expense, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `receipt-${expense.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredExpenses = expenses.filter(exp => {
    const matchesTab = activeTab === 'All' || exp.status === activeTab;
    const matchesSearch = exp.merchant.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          exp.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Expenses</h1>
        <button 
          onClick={handleOpenCreateModal}
          className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Log Expense
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex bg-slate-100 p-1 rounded-lg w-full sm:w-auto">
             {['All', 'Completed', 'Pending', 'Draft'].map(tab => (
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
                placeholder="Search expenses..." 
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
                <th className="px-6 py-3 font-medium">Merchant</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-3 text-slate-600">{expense.date}</td>
                  <td className="px-6 py-3 font-medium text-slate-900">{expense.merchant}</td>
                  <td className="px-6 py-3 text-slate-600">
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-xs font-medium text-slate-700">
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-3 font-medium text-slate-900">${expense.amount.toFixed(2)}</td>
                  <td className="px-6 py-3">
                    <span className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
                      expense.status === 'Completed' && "bg-emerald-100 text-emerald-700",
                      expense.status === 'Pending' && "bg-amber-100 text-amber-700",
                      expense.status === 'Draft' && "bg-slate-100 text-slate-700"
                    )}>
                      {expense.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex items-center justify-end gap-2 text-slate-400">
                      <button 
                        onClick={() => handleDownloadReceipt(expense)}
                        className="p-1 hover:text-primary hover:bg-primary/5 rounded" 
                        title="View Receipt"
                      >
                        <ReceiptText className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleOpenEditModal(expense)}
                        className="p-1 hover:text-slate-600 hover:bg-slate-100 rounded" 
                        title="Edit"
                      >
                        <FileEdit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="p-1 hover:text-rose-600 hover:bg-rose-50 rounded" 
                        title="Delete"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
               {filteredExpenses.length === 0 && (
                <tr>
                   <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      No expenses found for this tab.
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log / Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              {editingExpense ? 'Edit Expense' : 'Log Expense'}
            </h3>
            <div className="space-y-3">
              <div>
                <label htmlFor="merchant" className="block text-sm font-medium text-slate-700 mb-1">Merchant</label>
                <input 
                  id="merchant"
                  type="text" 
                  value={merchant} 
                  onChange={(e) => setMerchant(e.target.value)}
                  placeholder="e.g. AWS" 
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900"
                />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select 
                  id="category"
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900"
                >
                  <option value="Software Subscriptions">Software Subscriptions</option>
                  <option value="Travel">Travel</option>
                  <option value="Rent">Rent</option>
                  <option value="Office Supplies">Office Supplies</option>
                  <option value="Contractors">Contractors</option>
                </select>
              </div>
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-1">Amount ($)</label>
                <input 
                  id="amount"
                  type="number" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00" 
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900"
                />
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select 
                  id="status"
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900"
                >
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button 
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingExpense(null);
                }}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveExpense}
                className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90"
              >
                {editingExpense ? 'Save Changes' : 'Log Expense'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
