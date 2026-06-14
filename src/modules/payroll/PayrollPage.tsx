import { Plus, Search, Filter, Download, MoreHorizontal, AlertCircle } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useState } from 'react';

const mockPayrollRuns = [
  { id: 'PR-2024-05', period: 'May 2024', status: 'Draft', employees: 12, gross: 42500.00, net: 34100.00 },
  { id: 'PR-2024-04', period: 'April 2024', status: 'Paid', employees: 12, gross: 42500.00, net: 34100.00 },
  { id: 'PR-2024-03', period: 'March 2024', status: 'Paid', employees: 11, gross: 38900.00, net: 31200.00 },
];

const initialEmployees = [
  { id: 'EMP-001', name: 'Alice Johnson', role: 'Software Engineer', salary: 8500.00 },
  { id: 'EMP-002', name: 'Robert Smith', role: 'Product Manager', salary: 9200.00 },
  { id: 'EMP-003', name: 'Emily Davis', role: 'UX Designer', salary: 7800.00 },
];

export function PayrollPage() {
  const [activeTab, setActiveTab] = useState('Runs');
  const [payrollRuns, setPayrollRuns] = useState(mockPayrollRuns);
  const [employees, setEmployees] = useState(initialEmployees);

  // Run Payroll Modal State
  const [showRunModal, setShowRunModal] = useState(false);
  const [newPeriod, setNewPeriod] = useState('');
  const [newEmployeesCount, setNewEmployeesCount] = useState('');
  const [newGross, setNewGross] = useState('');
  const [newStatus, setNewStatus] = useState('Draft');

  // Add Employee Modal State
  const [showAddEmpModal, setShowAddEmpModal] = useState(false);
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpRole, setNewEmpRole] = useState('');
  const [newEmpSalary, setNewEmpSalary] = useState('');

  const handleRunPayroll = () => {
    if (!newPeriod || !newEmployeesCount || !newGross) return;
    const empCount = parseInt(newEmployeesCount);
    const grossVal = parseFloat(newGross);
    if (isNaN(empCount) || isNaN(grossVal)) return;

    const newRun = {
      id: `PR-${newPeriod.replace(/\s+/g, '-')}-${Date.now().toString().slice(-4)}`,
      period: newPeriod,
      status: newStatus,
      employees: empCount,
      gross: grossVal,
      net: grossVal * 0.8
    };

    setPayrollRuns([newRun, ...payrollRuns]);
    setShowRunModal(false);
    setNewPeriod('');
    setNewEmployeesCount('');
    setNewGross('');
    setNewStatus('Draft');
  };

  const handleAddEmployee = () => {
    if (!newEmpName || !newEmpRole || !newEmpSalary) return;
    const salaryVal = parseFloat(newEmpSalary);
    if (isNaN(salaryVal)) return;

    const nextIdNum = employees.reduce((max, emp) => {
      const num = parseInt(emp.id.replace('EMP-', ''));
      return num > max ? num : max;
    }, 0) + 1;
    const nextId = `EMP-${String(nextIdNum).padStart(3, '0')}`;

    const newEmp = {
      id: nextId,
      name: newEmpName,
      role: newEmpRole,
      salary: salaryVal
    };

    setEmployees([...employees, newEmp]);
    setShowAddEmpModal(false);
    setNewEmpName('');
    setNewEmpRole('');
    setNewEmpSalary('');
    setActiveTab('Employees'); // Switch to employee tab to see the addition
  };

  const handleDownloadSummary = (run: any) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(run, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `payroll-summary-${run.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-semibold mb-1">Important Legal Disclaimer</p>
          <p>Payroll tax calculations in LedgerBook are provided for reference only. Verify all payroll tax figures with a qualified accountant or your local tax authority before making any payments.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Payroll</h1>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowAddEmpModal(true)}
            className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Employee</span>
          </button>
          <button 
            onClick={() => setShowRunModal(true)}
            className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Run Payroll
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex bg-slate-100 p-1 rounded-lg w-full sm:w-auto">
             {['Runs', 'Employees', 'Taxes'].map(tab => (
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
        </div>

        {activeTab === 'Runs' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                <tr>
                  <th className="px-6 py-3 font-medium">Period</th>
                  <th className="px-6 py-3 font-medium text-right">Employees</th>
                  <th className="px-6 py-3 font-medium text-right">Total Gross</th>
                  <th className="px-6 py-3 font-medium text-right">Total Net</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payrollRuns.map((run) => (
                  <tr key={run.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3 font-medium text-slate-900">{run.period}</td>
                    <td className="px-6 py-3 text-right text-slate-600">{run.employees}</td>
                    <td className="px-6 py-3 text-right font-medium text-slate-600">${run.gross.toFixed(2)}</td>
                    <td className="px-6 py-3 text-right font-medium text-slate-900">${run.net.toFixed(2)}</td>
                    <td className="px-6 py-3">
                      <span className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
                        run.status === 'Paid' && "bg-emerald-100 text-emerald-700",
                        run.status === 'Draft' && "bg-amber-100 text-amber-700"
                      )}>
                        {run.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex items-center justify-end gap-2 text-slate-400">
                        <button 
                          onClick={() => handleDownloadSummary(run)}
                          className="p-1 hover:text-slate-600 hover:bg-slate-100 rounded" 
                          title="Download Summary"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-1 hover:text-slate-600 hover:bg-slate-100 rounded" title="More">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'Employees' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                <tr>
                  <th className="px-6 py-3 font-medium">ID</th>
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Role</th>
                  <th className="px-6 py-3 font-medium text-right">Monthly Salary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.map(emp => (
                  <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3 font-medium text-slate-900">{emp.id}</td>
                    <td className="px-6 py-3 text-slate-600">{emp.name}</td>
                    <td className="px-6 py-3 text-slate-600">{emp.role}</td>
                    <td className="px-6 py-3 text-right font-medium text-slate-900">${emp.salary.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'Taxes' && (
           <div className="p-12 text-center text-slate-500">
              Tax Calculations & Filings - Coming in Phase 1.1
           </div>
        )}
      </div>

      {/* Run Payroll Modal */}
      {showRunModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Run Payroll</h3>
            <div className="space-y-3">
              <div>
                <label htmlFor="period" className="block text-sm font-medium text-slate-700 mb-1">Pay Period</label>
                <input 
                  id="period"
                  type="text" 
                  value={newPeriod} 
                  onChange={(e) => setNewPeriod(e.target.value)}
                  placeholder="e.g. June 2024" 
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900"
                />
              </div>
              <div>
                <label htmlFor="employeesCount" className="block text-sm font-medium text-slate-700 mb-1">Employee Count</label>
                <input 
                  id="employeesCount"
                  type="number" 
                  value={newEmployeesCount} 
                  onChange={(e) => setNewEmployeesCount(e.target.value)}
                  placeholder="e.g. 12" 
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900"
                />
              </div>
              <div>
                <label htmlFor="grossAmount" className="block text-sm font-medium text-slate-700 mb-1">Total Gross Payroll ($)</label>
                <input 
                  id="grossAmount"
                  type="number" 
                  value={newGross} 
                  onChange={(e) => setNewGross(e.target.value)}
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
                  <option value="Draft">Draft</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button 
                onClick={() => setShowRunModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleRunPayroll}
                className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90"
              >
                Run Payroll
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {showAddEmpModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Add Employee</h3>
            <div className="space-y-3">
              <div>
                <label htmlFor="empName" className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input 
                  id="empName"
                  type="text" 
                  value={newEmpName} 
                  onChange={(e) => setNewEmpName(e.target.value)}
                  placeholder="e.g. John Doe" 
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900"
                />
              </div>
              <div>
                <label htmlFor="empRole" className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                <input 
                  id="empRole"
                  type="text" 
                  value={newEmpRole} 
                  onChange={(e) => setNewEmpRole(e.target.value)}
                  placeholder="e.g. Software Developer" 
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900"
                />
              </div>
              <div>
                <label htmlFor="empSalary" className="block text-sm font-medium text-slate-700 mb-1">Monthly Gross Salary ($)</label>
                <input 
                  id="empSalary"
                  type="number" 
                  value={newEmpSalary} 
                  onChange={(e) => setNewEmpSalary(e.target.value)}
                  placeholder="0.00" 
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button 
                onClick={() => setShowAddEmpModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddEmployee}
                className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90"
              >
                Add Employee
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
