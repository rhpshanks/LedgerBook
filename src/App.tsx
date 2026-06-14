import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import AuthPage from './modules/auth/AuthPage';
import { DashboardOverview } from './modules/dashboard/DashboardOverview';
import { InvoicesPage } from './modules/invoices/InvoicesPage';
import { ExpensesPage } from './modules/expenses/ExpensesPage';
import { ContactsPage } from './modules/contacts/ContactsPage';
import { ReportsPage } from './modules/reports/ReportsPage';
import { BankingPage } from './modules/banking/BankingPage';
import { PayrollPage } from './modules/payroll/PayrollPage';
import { SettingsPage } from './modules/settings/SettingsPage';

export default function App() {
  // For now we'll just show the app instead of making them login right away
  const isAuthenticated = true;

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="invoices" element={<InvoicesPage />} />
          <Route path="expenses" element={<ExpensesPage />} />
          <Route path="banking" element={<BankingPage />} />
          <Route path="contacts" element={<ContactsPage />} />
          <Route path="payroll" element={<PayrollPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
