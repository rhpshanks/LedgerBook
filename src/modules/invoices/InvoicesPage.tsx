import { Plus, Search, Filter, MoreHorizontal, Download, FileEdit, Trash } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useState } from 'react';

const mockInvoices = [
  { id: 'INV-0001', client: 'Acme Corp', date: '2024-05-12', amount: 1200.00, status: 'Paid' },
  { id: 'INV-0002', client: 'Globex Inc', date: '2024-05-15', amount: 3450.00, status: 'Pending' },
  { id: 'INV-0003', client: 'Soylent Corp', date: '2024-05-18', amount: 890.00, status: 'Overdue' },
  { id: 'INV-0004', client: 'Initech', date: '2024-05-20', amount: 4500.00, status: 'Draft' },
  { id: 'INV-0005', client: 'Umbrella Corp', date: '2024-05-22', amount: 2100.00, status: 'Paid' },
];

export function InvoicesPage() {
  const [invoices, setInvoices] = useState(mockInvoices);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<any>(null);
  
  // Form state
  const [newClient, setNewClient] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newStatus, setNewStatus] = useState('Pending');

  const handleOpenCreateModal = () => {
    setEditingInvoice(null);
    setNewClient('');
    setNewAmount('');
    setNewStatus('Pending');
    setShowCreateModal(true);
  };

  const handleOpenEditModal = (invoice: any) => {
    setEditingInvoice(invoice);
    setNewClient(invoice.client);
    setNewAmount(invoice.amount.toString());
    setNewStatus(invoice.status);
    setShowCreateModal(true);
  };

  const handleSaveInvoice = () => {
    if (!newClient || !newAmount) return;
    if (editingInvoice) {
      setInvoices(invoices.map(inv => {
        if (inv.id === editingInvoice.id) {
          return { ...inv, client: newClient, amount: parseFloat(newAmount), status: newStatus };
        }
        return inv;
      }));
    } else {
      const nextIdNum = invoices.reduce((max, inv) => {
        const num = parseInt(inv.id.replace('INV-', ''));
        return num > max ? num : max;
      }, 0) + 1;
      const nextId = `INV-${String(nextIdNum).padStart(4, '0')}`;
      const newInvoice = {
        id: nextId,
        client: newClient,
        date: new Date().toISOString().split('T')[0],
        amount: parseFloat(newAmount),
        status: newStatus
      };
      setInvoices([...invoices, newInvoice]);
    }
    setNewClient('');
    setNewAmount('');
    setNewStatus('Pending');
    setEditingInvoice(null);
    setShowCreateModal(false);
  };

  const handleDeleteInvoice = (id: string) => {
    setInvoices(invoices.filter(inv => inv.id !== id));
  };

  const handleDownloadInvoice = (invoice: any) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(invoice, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `invoice-${invoice.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredInvoices = invoices.filter(inv => {
    const matchesTab = activeTab === 'All' || inv.status === activeTab;
    const matchesSearch = inv.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          inv.client.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Invoices</h1>
        <button 
          onClick={handleOpenCreateModal}
          className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Invoice
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex bg-slate-100 p-1 rounded-lg w-full sm:w-auto">
            {['All', 'Draft', 'Pending', 'Paid', 'Overdue'].map(tab => (
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
                placeholder="Search invoices..." 
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
                <th className="px-6 py-3 font-medium">Invoice Number</th>
                <th className="px-6 py-3 font-medium">Client</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-3 font-medium text-slate-900">{invoice.id}</td>
                  <td className="px-6 py-3 text-slate-600">{invoice.client}</td>
                  <td className="px-6 py-3 text-slate-600">{invoice.date}</td>
                  <td className="px-6 py-3 font-medium text-slate-900">${invoice.amount.toFixed(2)}</td>
                  <td className="px-6 py-3">
                    <span className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
                      invoice.status === 'Paid' && "bg-emerald-100 text-emerald-700",
                      invoice.status === 'Pending' && "bg-blue-100 text-blue-700",
                      invoice.status === 'Overdue' && "bg-rose-100 text-rose-700",
                      invoice.status === 'Draft' && "bg-slate-100 text-slate-700"
                    )}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex items-center justify-end gap-2 text-slate-400">
                      <button 
                        onClick={() => handleDownloadInvoice(invoice)}
                        className="p-1 hover:text-slate-600 hover:bg-slate-100 rounded" 
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleOpenEditModal(invoice)}
                        className="p-1 hover:text-slate-600 hover:bg-slate-100 rounded" 
                        title="Edit"
                      >
                        <FileEdit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteInvoice(invoice.id)}
                        className="p-1 hover:text-rose-600 hover:bg-rose-50 rounded" 
                        title="Delete"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                      <button className="p-1 hover:text-slate-600 hover:bg-slate-100 rounded" title="More">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredInvoices.length === 0 && (
                <tr>
                   <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      No invoices found for this tab.
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              {editingInvoice ? 'Edit Invoice' : 'Create Invoice'}
            </h3>
            <div className="space-y-3">
              <div>
                <label htmlFor="clientName" className="block text-sm font-medium text-slate-700 mb-1">Client Name</label>
                <input 
                  id="clientName"
                  type="text" 
                  value={newClient} 
                  onChange={(e) => setNewClient(e.target.value)}
                  placeholder="e.g. Acme Corp" 
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900"
                />
              </div>
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-1">Amount ($)</label>
                <input 
                  id="amount"
                  type="number" 
                  value={newAmount} 
                  onChange={(e) => setNewAmount(e.target.value)}
                  placeholder="0.00" 
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900"
                />
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select 
                  id="status"
                  value={newStatus} 
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900"
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button 
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingInvoice(null);
                }}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveInvoice}
                className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90"
              >
                {editingInvoice ? 'Save Changes' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
