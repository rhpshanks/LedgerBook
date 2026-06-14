import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { BalanceSheet } from '../modules/reports/BalanceSheet';

describe('BalanceSheet Component', () => {
  it('renders default accounts, headers and sub-totals correctly in USD base currency', { timeout: 15000 }, () => {
    render(<BalanceSheet onBack={vi.fn()} />);

    // Page titles and navigation
    expect(screen.getByRole('heading', { level: 1, name: 'Balance Sheet' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Back to Reports/i })).toBeInTheDocument();

    // Verify presence of major headings
    expect(screen.getByText('Assets')).toBeInTheDocument();
    expect(screen.getByText('Liabilities')).toBeInTheDocument();
    expect(screen.getByText('Equity')).toBeInTheDocument();

    // Verify sub-headers/groupings
    expect(screen.getByText('Current Assets')).toBeInTheDocument();
    expect(screen.getByText('Non-Current Assets')).toBeInTheDocument();
    expect(screen.getByText('Current Liabilities')).toBeInTheDocument();
    expect(screen.getByText('Non-Current Liabilities')).toBeInTheDocument();
    expect(screen.getByText('Shareholder Equity')).toBeInTheDocument();

    // Verify total assets and liabilities match initially ($612,700.00)
    // Cash: $125,000.00, Total Assets: $612,700.00
    expect(screen.getByText('$125,000.00')).toBeInTheDocument();
    expect(screen.getAllByText('$612,700.00')[0]).toBeInTheDocument();
    
    // Balanced state info card
    expect(screen.getByText(/balance sheet is fully balanced/i)).toBeInTheDocument();
  });

  it('collapses and expands categories when clicked', () => {
    render(<BalanceSheet onBack={vi.fn()} />);

    // Initially "Cash and Cash Equivalents" is visible
    expect(screen.getByText('Cash and Cash Equivalents')).toBeInTheDocument();

    // Collapse Current Assets
    const currentAssetsGroup = screen.getByText('Current Assets');
    fireEvent.click(currentAssetsGroup);

    // "Cash and Cash Equivalents" should be hidden
    expect(screen.queryByText('Cash and Cash Equivalents')).not.toBeInTheDocument();

    // Expand again
    fireEvent.click(currentAssetsGroup);
    expect(screen.getByText('Cash and Cash Equivalents')).toBeInTheDocument();
  });

  it('scales values dynamically when date range changes', () => {
    render(<BalanceSheet onBack={vi.fn()} />);

    // Initial cash at 'This Year' is $125,000.00
    expect(screen.getByText('$125,000.00')).toBeInTheDocument();

    // Change Date Range to 'Last Year' (factor = 0.85)
    const dateRangeSelect = document.getElementById('bsDateRange')!;
    fireEvent.change(dateRangeSelect, { target: { value: 'Last Year' } });

    // Cash is now 125,000 * 0.85 = 106,250.00
    expect(screen.getByText('$106,250.00')).toBeInTheDocument();
    // Asset total is 612,700 * 0.85 = 520,795.00
    expect(screen.getAllByText('$520,795.00')[0]).toBeInTheDocument();
  });

  it('converts balances dynamically when changing display currency', () => {
    render(<BalanceSheet onBack={vi.fn()} />);

    // Cash is $125,000.00
    expect(screen.getByText('$125,000.00')).toBeInTheDocument();

    // Change display currency to EUR (rate = 0.9240)
    const currencySelect = document.getElementById('bsCurrency')!;
    fireEvent.change(currencySelect, { target: { value: 'EUR' } });

    // Cash is now 125,000 * 0.924 = €115,500.00
    expect(screen.getByText('€115,500.00')).toBeInTheDocument();
    // Total Assets is 612,700 * 0.924 = €566,134.80
    expect(screen.getAllByText('€566,134.80')[0]).toBeInTheDocument();
  });

  it('updates account values via edit modal, converts correctly, and updates totals', () => {
    render(<BalanceSheet onBack={vi.fn()} />);

    // Click Cash amount button
    const cashBtn = screen.getByRole('button', { name: '$125,000.00' });
    fireEvent.click(cashBtn);

    // Verify modal is open
    const modal = screen.getByTestId('edit-modal');
    expect(modal).toBeInTheDocument();
    expect(within(modal).getByText('Cash and Cash Equivalents')).toBeInTheDocument();

    // Edit input amount to 150000.00
    const input = within(modal).getByLabelText(/Amount \(USD\)/i);
    fireEvent.change(input, { target: { value: '150000' } });

    // Click Apply Change
    const applyBtn = screen.getByRole('button', { name: 'Apply Change' });
    fireEvent.click(applyBtn);

    // Verify updated amount is shown on table
    expect(screen.getByRole('button', { name: '$150,000.00' })).toBeInTheDocument();

    // Verify Total Assets updated: $612,700.00 + $25,000.00 = $637,700.00
    expect(screen.getAllByText('$637,700.00')[0]).toBeInTheDocument();

    // Balance Sheet is now out of balance by $25,000.00
    const banner = screen.getByTestId('imbalance-banner');
    expect(banner).toBeInTheDocument();
    expect(within(banner).getByText(/\$25,000\.00/)).toBeInTheDocument();
  });

  it('auto-balances the sheet when out of balance using Retained Earnings', () => {
    render(<BalanceSheet onBack={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: '$125,000.00' }));
    const modal = screen.getByTestId('edit-modal');
    fireEvent.change(within(modal).getByLabelText(/Amount \(USD\)/i), { target: { value: '150000' } });
    fireEvent.click(within(modal).getByRole('button', { name: 'Apply Change' }));

    // Retained Earnings is initially $149,200.00
    expect(screen.getByRole('button', { name: '$149,200.00' })).toBeInTheDocument();

    // Click Auto-Balance
    const autoBalanceBtn = screen.getByRole('button', { name: /Auto-Balance/i });
    fireEvent.click(autoBalanceBtn);

    // Retained Earnings should be updated to $149,200.00 + $25,000.00 = $174,200.00
    expect(screen.getByRole('button', { name: '$174,200.00' })).toBeInTheDocument();

    // Difference is resolved, confirmation is visible again
    expect(screen.getByText(/balance sheet is fully balanced/i)).toBeInTheDocument();
    expect(screen.queryByTestId('imbalance-banner')).not.toBeInTheDocument();
  });

  it('triggers files download on CSV and JSON exports', () => {
    render(<BalanceSheet onBack={vi.fn()} />);

    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    // Click CSV Export
    const csvBtn = screen.getByRole('button', { name: /CSV/i });
    fireEvent.click(csvBtn);
    expect(clickSpy).toHaveBeenCalledTimes(1);

    // Click JSON Export
    const jsonBtn = screen.getByRole('button', { name: /JSON/i });
    fireEvent.click(jsonBtn);
    expect(clickSpy).toHaveBeenCalledTimes(2);

    clickSpy.mockRestore();
  });
});
