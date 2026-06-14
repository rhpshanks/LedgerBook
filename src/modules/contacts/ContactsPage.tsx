import { Plus, Search, Filter, Mail, Phone, MoreHorizontal, FileEdit, Trash } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useState } from 'react';

const mockContacts = [
  { id: 'CON-001', name: 'Acme Corp', type: 'Customer', email: 'billing@acme.com', phone: '+1 555-0100', balance: 1200.00 },
  { id: 'CON-002', name: 'AWS', type: 'Supplier', email: 'billing@aws.amazon.com', phone: '-', balance: -245.50 },
  { id: 'CON-003', name: 'Globex Inc', type: 'Customer', email: 'accounts@globex.com', phone: '+1 555-0200', balance: 0.00 },
  { id: 'CON-004', name: 'Office Depot', type: 'Supplier', email: 'support@officedepot.com', phone: '+1 800-463-3768', balance: 0.00 },
  { id: 'CON-005', name: 'Soylent Corp', type: 'Both', email: 'finance@soylent.com', phone: '+1 555-0300', balance: 890.00 },
];

export function ContactsPage() {
  const [contacts, setContacts] = useState(mockContacts);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingContact, setEditingContact] = useState<any>(null);

  // Form state
  const [name, setName] = useState('');
  const [type, setType] = useState('Customer');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [balance, setBalance] = useState('');

  const handleOpenCreateModal = () => {
    setEditingContact(null);
    setName('');
    setType('Customer');
    setEmail('');
    setPhone('');
    setBalance('');
    setShowCreateModal(true);
  };

  const handleOpenEditModal = (contact: any) => {
    setEditingContact(contact);
    setName(contact.name);
    setType(contact.type);
    setEmail(contact.email);
    setPhone(contact.phone === '-' ? '' : contact.phone);
    setBalance(contact.balance.toString());
    setShowCreateModal(true);
  };

  const handleSaveContact = () => {
    if (!name || !email) return;
    if (editingContact) {
      setContacts(contacts.map(c => {
        if (c.id === editingContact.id) {
          return {
            ...c,
            name,
            type,
            email,
            phone: phone || '-',
            balance: balance ? parseFloat(balance) : 0.00
          };
        }
        return c;
      }));
    } else {
      const nextIdNum = contacts.reduce((max, c) => {
        const num = parseInt(c.id.replace('CON-', ''));
        return num > max ? num : max;
      }, 0) + 1;
      const nextId = `CON-${String(nextIdNum).padStart(3, '0')}`;
      const newContact = {
        id: nextId,
        name,
        type,
        email,
        phone: phone || '-',
        balance: balance ? parseFloat(balance) : 0.00
      };
      setContacts([...contacts, newContact]);
    }
    setName('');
    setType('Customer');
    setEmail('');
    setPhone('');
    setBalance('');
    setEditingContact(null);
    setShowCreateModal(false);
  };

  const handleDeleteContact = (id: string) => {
    setContacts(contacts.filter(c => c.id !== id));
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesTab = activeTab === 'All' 
      || (activeTab === 'Customers' && (contact.type === 'Customer' || contact.type === 'Both'))
      || (activeTab === 'Suppliers' && (contact.type === 'Supplier' || contact.type === 'Both'));
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          contact.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Contacts</h1>
        <button 
          onClick={handleOpenCreateModal}
          className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Contact
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex bg-slate-100 p-1 rounded-lg w-full sm:w-auto">
             {['All', 'Customers', 'Suppliers'].map(tab => (
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
                placeholder="Search contacts..." 
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
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium">Contact Details</th>
                <th className="px-6 py-3 font-medium text-right">Balance</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredContacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-3 font-medium text-slate-900">{contact.name}</td>
                  <td className="px-6 py-3">
                    <span className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
                      contact.type === 'Customer' && "bg-blue-100 text-blue-700",
                      contact.type === 'Supplier' && "bg-purple-100 text-purple-700",
                      contact.type === 'Both' && "bg-slate-100 text-slate-700"
                    )}>
                      {contact.type}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex flex-col gap-1 text-slate-600">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5" />
                        <span>{contact.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5" />
                        <span>{contact.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <span className={cn(
                      "font-medium",
                       contact.balance > 0 ? "text-emerald-600" : contact.balance < 0 ? "text-rose-600" : "text-slate-600"
                    )}>
                      {contact.balance === 0 ? '$0.00' : contact.balance > 0 ? `$${contact.balance.toFixed(2)}` : `-$${Math.abs(contact.balance).toFixed(2)}`}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex items-center justify-end gap-2 text-slate-400">
                      <button 
                        onClick={() => handleOpenEditModal(contact)}
                        className="p-1 hover:text-slate-600 hover:bg-slate-100 rounded" 
                        title="Edit"
                      >
                        <FileEdit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteContact(contact.id)}
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
               {filteredContacts.length === 0 && (
                <tr>
                   <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      No contacts found for this tab.
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
              {editingContact ? 'Edit Contact' : 'Add Contact'}
            </h3>
            <div className="space-y-3">
              <div>
                <label htmlFor="contactName" className="block text-sm font-medium text-slate-700 mb-1">Contact Name</label>
                <input 
                  id="contactName"
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Acme Corp" 
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900"
                />
              </div>
              <div>
                <label htmlFor="contactType" className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <select 
                  id="contactType"
                  value={type} 
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900"
                >
                  <option value="Customer">Customer</option>
                  <option value="Supplier">Supplier</option>
                  <option value="Both">Both</option>
                </select>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input 
                  id="email"
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="billing@acme.com" 
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input 
                  id="phone"
                  type="text" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 555-0100" 
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900"
                />
              </div>
              <div>
                <label htmlFor="balance" className="block text-sm font-medium text-slate-700 mb-1">Opening Balance ($)</label>
                <input 
                  id="balance"
                  type="number" 
                  value={balance} 
                  onChange={(e) => setBalance(e.target.value)}
                  placeholder="0.00" 
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button 
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingContact(null);
                }}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveContact}
                className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90"
              >
                {editingContact ? 'Save Changes' : 'Add Contact'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
