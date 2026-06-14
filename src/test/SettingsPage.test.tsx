import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act, within } from '@testing-library/react';
import { SettingsPage } from '../modules/settings/SettingsPage';

describe('SettingsPage Component', () => {
  it('renders settings navigation and default tab details', () => {
    render(<SettingsPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Settings' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Organization' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Currencies' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Users & Roles' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Integrations' })).toBeInTheDocument();
    
    expect(screen.getByLabelText('Company Name')).toHaveValue('ACME Corp');
    expect(screen.getByLabelText('Base Currency')).toHaveValue('USD');
  });

  it('navigates settings tabs', () => {
    render(<SettingsPage />);
    
    // Default is Organization settings, click Users & Roles
    const usersTab = screen.getByRole('button', { name: 'Users & Roles' });
    fireEvent.click(usersTab);
    expect(screen.getByText('Users & Roles Settings - Coming in Phase 1.1')).toBeInTheDocument();
    expect(screen.queryByLabelText('Company Name')).not.toBeInTheDocument();
  });

  it('updates input values and displays success banner upon save', async () => {
    vi.useFakeTimers();
    render(<SettingsPage />);

    const companyNameInput = screen.getByLabelText('Company Name');
    const currencySelect = screen.getByLabelText('Base Currency');
    const fiscalSelect = screen.getByLabelText('Fiscal Year Start');
    const taxNumberInput = screen.getByLabelText('Tax/Registration Number');

    fireEvent.change(companyNameInput, { target: { value: 'Globex HQ' } });
    fireEvent.change(currencySelect, { target: { value: 'EUR' } });
    fireEvent.change(fiscalSelect, { target: { value: '4' } });
    fireEvent.change(taxNumberInput, { target: { value: 'DE123456789' } });

    expect(companyNameInput).toHaveValue('Globex HQ');
    expect(currencySelect).toHaveValue('EUR');
    expect(fiscalSelect).toHaveValue('4');
    expect(taxNumberInput).toHaveValue('DE123456789');

    // Click Save Changes
    const saveBtn = screen.getByRole('button', { name: 'Save Changes' });
    fireEvent.click(saveBtn);

    // Success banner should be visible
    expect(screen.getByText('Settings saved successfully!')).toBeInTheDocument();

    // Fast-forward 3 seconds
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    // Banner should be hidden
    expect(screen.queryByText('Settings saved successfully!')).not.toBeInTheDocument();

    vi.useRealTimers();
  });

  it('filters and searches currencies in Currencies tab', () => {
    render(<SettingsPage />);

    // Click Currencies tab
    const currenciesTab = screen.getByRole('button', { name: 'Currencies' });
    fireEvent.click(currenciesTab);

    // Verify header
    expect(screen.getByRole('heading', { level: 2, name: 'Currency Ledger' })).toBeInTheDocument();
    expect(screen.getByText('US Dollar')).toBeInTheDocument();
    expect(screen.getByText('Japanese Yen')).toBeInTheDocument();

    // Search for Swedish Krona
    const searchInput = screen.getByPlaceholderText('Search currencies...');
    fireEvent.change(searchInput, { target: { value: 'Krona' } });

    expect(screen.getByText('Swedish Krona')).toBeInTheDocument();
    expect(screen.queryByText('Japanese Yen')).not.toBeInTheDocument();
  });

  it('updates exchange rates dynamically when base currency is changed', () => {
    render(<SettingsPage />);

    // Initial base currency is USD. Japanese Yen rate is 156.40
    const currencySelect = screen.getByLabelText('Base Currency');
    
    // Change base currency to EUR (rateToUsd = 0.9240)
    fireEvent.change(currencySelect, { target: { value: 'EUR' } });

    // Navigate to Currencies tab
    const currenciesTab = screen.getByRole('button', { name: 'Currencies' });
    fireEvent.click(currenciesTab);

    // Verify EUR is marked as Base Currency
    expect(screen.getByText('Base Currency')).toBeInTheDocument();

    // Verify Yen rate is now re-calculated relative to EUR: 156.40 / 0.9240 = 169.2641
    const yenRow = screen.getByText('Japanese Yen').closest('tr')!;
    expect(within(yenRow).getByText('169.2641')).toBeInTheDocument();
  });

  it('modifies specific currency rate via inline Edit Rate modal', () => {
    render(<SettingsPage />);

    // Go to Currencies tab
    const currenciesTab = screen.getByRole('button', { name: 'Currencies' });
    fireEvent.click(currenciesTab);

    // Find GBP row
    const gbpRow = screen.getByText('British Pound').closest('tr')!;
    expect(within(gbpRow).getByText('0.7880')).toBeInTheDocument();

    // Click Edit Rate
    const editBtn = within(gbpRow).getByRole('button', { name: 'Edit Rate' });
    fireEvent.click(editBtn);

    // Verify Modal details
    expect(screen.getByRole('heading', { level: 3, name: 'Edit Exchange Rate' })).toBeInTheDocument();
    const modal = screen.getByRole('heading', { level: 3, name: 'Edit Exchange Rate' }).closest('div')!;

    // Fill new exchange rate
    const rateInput = within(modal).getByLabelText('Exchange Rate');
    fireEvent.change(rateInput, { target: { value: '0.8250' } });

    // Click Save
    const saveBtn = within(modal).getByRole('button', { name: 'Save' });
    fireEvent.click(saveBtn);

    // Verify updated rate is displayed in table
    expect(within(gbpRow).getByText('0.8250')).toBeInTheDocument();
  });
});
