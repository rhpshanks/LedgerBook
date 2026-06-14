import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ReportsPage } from '../modules/reports/ReportsPage';

describe('ReportsPage Component', () => {
  it('renders reports header and export buttons', () => {
    render(<ReportsPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Reports' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Export All' })).toBeInTheDocument();
  });

  it('selects date range', () => {
    render(<ReportsPage />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('This Year');

    fireEvent.change(select, { target: { value: 'Last Quarter' } });
    expect(select).toHaveValue('Last Quarter');
  });

  it('renders mock Recharts bar-chart element with correct properties', () => {
    render(<ReportsPage />);
    const chart = screen.getByTestId('bar-chart');
    expect(chart).toBeInTheDocument();
    
    const dataAttribute = chart.getAttribute('data-data');
    expect(dataAttribute).toBeDefined();
    expect(dataAttribute).toContain('Jan');
    expect(dataAttribute).toContain('Dec');
  });

  it('renders all report categories and directory items', () => {
    render(<ReportsPage />);
    expect(screen.getByText('Financial Statements')).toBeInTheDocument();
    expect(screen.getByText('Profit and Loss')).toBeInTheDocument();
    
    expect(screen.getByText('Transactions & Balances')).toBeInTheDocument();
    expect(screen.getByText('Trial Balance')).toBeInTheDocument();
    
    expect(screen.getByText('Payables & Receivables')).toBeInTheDocument();
    expect(screen.getByText('Aged Receivables')).toBeInTheDocument();
  });

  it('triggers download when Export All is clicked', () => {
    render(<ReportsPage />);

    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    const exportBtn = screen.getByRole('button', { name: 'Export All' });
    fireEvent.click(exportBtn);

    expect(clickSpy).toHaveBeenCalled();
    clickSpy.mockRestore();
  });

  it('triggers download when individual report directory item is clicked', () => {
    render(<ReportsPage />);

    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    const pnlBtn = screen.getByRole('button', { name: /Profit and Loss/ });
    fireEvent.click(pnlBtn);

    expect(clickSpy).toHaveBeenCalled();
    clickSpy.mockRestore();
  });
});
