import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { ExpensesPage } from '../modules/expenses/ExpensesPage';

describe('ExpensesPage Component', () => {
  it('renders initial list of expenses', () => {
    render(<ExpensesPage />);
    expect(screen.getByText('AWS')).toBeInTheDocument();
    expect(screen.getByText('Delta Airlines')).toBeInTheDocument();
    expect(screen.getByText('WeWork')).toBeInTheDocument();
  });

  it('filters expenses by tab selection', () => {
    render(<ExpensesPage />);
    expect(screen.getByText('AWS')).toBeInTheDocument(); // Completed
    expect(screen.getByText('Delta Airlines')).toBeInTheDocument(); // Pending

    // Click 'Pending' tab
    const pendingButton = screen.getByRole('button', { name: /^Pending$/ });
    fireEvent.click(pendingButton);
    expect(screen.getByText('Delta Airlines')).toBeInTheDocument();
    expect(screen.queryByText('AWS')).not.toBeInTheDocument();
  });

  it('filters expenses by search query', () => {
    render(<ExpensesPage />);
    const searchInput = screen.getByPlaceholderText('Search expenses...');

    fireEvent.change(searchInput, { target: { value: 'Delta' } });
    expect(screen.getByText('Delta Airlines')).toBeInTheDocument();
    expect(screen.queryByText('AWS')).not.toBeInTheDocument();

    // Reset
    fireEvent.change(searchInput, { target: { value: '' } });
    expect(screen.getByText('AWS')).toBeInTheDocument();
  });

  it('logs a new expense via dialog modal', () => {
    render(<ExpensesPage />);

    // Open modal
    const logButton = screen.getByRole('button', { name: 'Log Expense' });
    fireEvent.click(logButton);

    // Fill form
    const merchantInput = screen.getByLabelText('Merchant');
    const categorySelect = screen.getByLabelText('Category');
    const amountInput = screen.getByLabelText('Amount ($)');
    const statusSelect = screen.getByLabelText('Status');

    fireEvent.change(merchantInput, { target: { value: 'Google Cloud' } });
    fireEvent.change(categorySelect, { target: { value: 'Software Subscriptions' } });
    fireEvent.change(amountInput, { target: { value: '450.00' } });
    fireEvent.change(statusSelect, { target: { value: 'Completed' } });

    // Submit
    const modal = screen.getByRole('heading', { level: 3, name: 'Log Expense' }).closest('div')!;
    const submitBtn = within(modal).getByRole('button', { name: 'Log Expense' });
    fireEvent.click(submitBtn);

    // Verify Google Cloud in table
    expect(screen.getByText('Google Cloud')).toBeInTheDocument();
    expect(screen.getByText('$450.00')).toBeInTheDocument();
  });

  it('deletes an expense on click', () => {
    render(<ExpensesPage />);

    expect(screen.getByText('Office Depot')).toBeInTheDocument();

    const row = screen.getByText('Office Depot').closest('tr')!;
    const deleteBtn = within(row).getByTitle('Delete');
    fireEvent.click(deleteBtn);

    expect(screen.queryByText('Office Depot')).not.toBeInTheDocument();
  });
});
