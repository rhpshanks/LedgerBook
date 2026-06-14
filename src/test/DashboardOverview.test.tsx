import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DashboardOverview } from '../modules/dashboard/DashboardOverview';

describe('DashboardOverview Component', () => {
  it('renders dashboard headers and action buttons', () => {
    render(<DashboardOverview />);
    expect(screen.getByRole('heading', { level: 1, name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'New Invoice' })).toBeInTheDocument();
  });

  it('renders all KPI cards with values', () => {
    render(<DashboardOverview />);
    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    expect(screen.getByText('$24,500')).toBeInTheDocument();

    expect(screen.getByText('Total Expenses')).toBeInTheDocument();
    expect(screen.getByText('$12,340')).toBeInTheDocument();

    expect(screen.getByText('Net Profit')).toBeInTheDocument();
    expect(screen.getByText('$12,160')).toBeInTheDocument();

    expect(screen.getByText('Outstanding Invoices')).toBeInTheDocument();
    expect(screen.getByText('$5,200')).toBeInTheDocument();
  });

  it('renders Cash in Bank balances', () => {
    render(<DashboardOverview />);
    expect(screen.getByText('Operating Acc')).toBeInTheDocument();
    expect(screen.getByText('$18,450.00')).toBeInTheDocument();
    expect(screen.getByText('Savings')).toBeInTheDocument();
    expect(screen.getByText('$42,000.00')).toBeInTheDocument();
  });

  it('renders recent transactions list', () => {
    render(<DashboardOverview />);
    expect(screen.getByText('Recent Transactions')).toBeInTheDocument();
    expect(screen.getByText('Stripe Payout')).toBeInTheDocument();
    expect(screen.getByText('AWS Cloud')).toBeInTheDocument();
    expect(screen.getByText('Acme Corp Invoice')).toBeInTheDocument();
    expect(screen.getByText('Office Supplies')).toBeInTheDocument();
  });
});
