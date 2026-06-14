import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { BankingPage } from '../modules/banking/BankingPage';

describe('BankingPage Component', () => {
  it('renders bank balance cards', () => {
    render(<BankingPage />);
    expect(screen.getByText('Operating Account')).toBeInTheDocument();
    expect(screen.getByText('$18,450.00')).toBeInTheDocument();
    expect(screen.getByText('Savings Account')).toBeInTheDocument();
    expect(screen.getByText('$42,000.00')).toBeInTheDocument();
  });

  it('renders transactions table', () => {
    render(<BankingPage />);
    expect(screen.getByText('Stripe Payout')).toBeInTheDocument();
    expect(screen.getByText('AWS Cloud Services')).toBeInTheDocument();
  });

  it('filters transactions by tabs', () => {
    render(<BankingPage />);
    expect(screen.getByText('Stripe Payout')).toBeInTheDocument(); // Matched
    expect(screen.getByText('AWS Cloud Services')).toBeInTheDocument(); // Unmatched

    // Click Unmatched tab
    const unmatchedBtn = screen.getByRole('button', { name: /^Unmatched$/ });
    fireEvent.click(unmatchedBtn);
    expect(screen.getByText('AWS Cloud Services')).toBeInTheDocument();
    expect(screen.queryByText('Stripe Payout')).not.toBeInTheDocument();
  });

  it('filters transactions by search query', () => {
    render(<BankingPage />);
    const searchInput = screen.getByPlaceholderText('Search transactions...');

    fireEvent.change(searchInput, { target: { value: 'Airlines' } });
    expect(screen.getByText('Delta Airlines')).toBeInTheDocument();
    expect(screen.queryByText('Stripe Payout')).not.toBeInTheDocument();
  });

  it('matches unmatched transaction via dialog modal', () => {
    render(<BankingPage />);

    // AWS Cloud Services is Unmatched initially
    expect(screen.getByText('AWS Cloud Services')).toBeInTheDocument();
    const row = screen.getByText('AWS Cloud Services').closest('tr')!;
    expect(within(row).getByText('Select a category to match')).toBeInTheDocument();

    // Click Add Match
    const addMatchBtn = within(row).getByRole('button', { name: 'Add Match' });
    fireEvent.click(addMatchBtn);

    // Modal opens
    expect(screen.getByRole('heading', { level: 3, name: 'Match Transaction' })).toBeInTheDocument();
    
    // Choose category Software Subscriptions
    const categorySelect = screen.getByLabelText('Category');
    fireEvent.change(categorySelect, { target: { value: 'Software Subscriptions' } });

    // Click match
    const matchConfirmBtn = screen.getByRole('button', { name: 'Match' });
    fireEvent.click(matchConfirmBtn);

    // Verify row status becomes matched with category Software Subscriptions
    expect(within(row).getByText('Software Subscriptions')).toBeInTheDocument();
    expect(within(row).getByText('Matched')).toBeInTheDocument();
  });

  it('adds a new bank account and displays it', () => {
    render(<BankingPage />);

    // Click Add Account
    const addAccBtn = screen.getByRole('button', { name: 'Add Account' });
    fireEvent.click(addAccBtn);

    // Modal opens
    expect(screen.getByRole('heading', { level: 3, name: 'Add Bank Account' })).toBeInTheDocument();
    const modal = screen.getByRole('heading', { level: 3, name: 'Add Bank Account' }).closest('div')!;

    // Fill the inputs
    const nameInput = within(modal).getByLabelText('Account Name');
    fireEvent.change(nameInput, { target: { value: 'Payroll Card' } });

    const balanceInput = within(modal).getByLabelText('Initial Balance ($)');
    fireEvent.change(balanceInput, { target: { value: '5500' } });

    const primaryCheckbox = within(modal).getByLabelText('Set as Primary Account');
    fireEvent.click(primaryCheckbox);

    // Click Add Account button
    const submitBtn = within(modal).getByRole('button', { name: 'Add Account' });
    fireEvent.click(submitBtn);

    // Verify new balance card is rendered and contains 'Primary' tag
    expect(screen.getByText('Payroll Card')).toBeInTheDocument();
    expect(screen.getByText('$5,500.00')).toBeInTheDocument();
    
    // Previous operating account is no longer primary
    const cards = screen.getAllByText(/Account/);
    const opAccCard = cards.find(el => el.textContent === 'Operating Account')?.closest('div')!;
    expect(within(opAccCard).queryByText('Primary')).not.toBeInTheDocument();
  });

  it('imports statement and prepends new transactions', () => {
    render(<BankingPage />);

    // Click Import Statement
    const importBtn = screen.getByRole('button', { name: 'Import Statement' });
    fireEvent.click(importBtn);

    // Modal opens
    expect(screen.getByRole('heading', { level: 3, name: 'Import Bank Statement' })).toBeInTheDocument();

    // Click Import Demo Statement button
    const confirmImportBtn = screen.getByRole('button', { name: 'Import Demo Statement' });
    fireEvent.click(confirmImportBtn);

    // Assert that new unmatched transactions appear in the table
    expect(screen.getByText('Google Cloud Platform')).toBeInTheDocument();
    expect(screen.getByText('GitHub Copilot')).toBeInTheDocument();
    
    const row = screen.getByText('Google Cloud Platform').closest('tr')!;
    expect(within(row).getByText('Select a category to match')).toBeInTheDocument();
  });
});
