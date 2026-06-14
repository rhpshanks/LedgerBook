import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { SettingsPage } from '../modules/settings/SettingsPage';

describe('SettingsPage Component', () => {
  it('renders settings navigation and default tab details', () => {
    render(<SettingsPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Settings' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Organization' })).toBeInTheDocument();
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
});
