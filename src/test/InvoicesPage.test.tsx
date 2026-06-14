import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { InvoicesPage } from '../modules/invoices/InvoicesPage';

describe('InvoicesPage Component', () => {
  it('renders initial list of invoices', () => {
    render(<InvoicesPage />);
    expect(screen.getByText('INV-0001')).toBeInTheDocument();
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    expect(screen.getByText('INV-0002')).toBeInTheDocument();
    expect(screen.getByText('Globex Inc')).toBeInTheDocument();
  });

  it('filters invoices by tab selection', async () => {
    render(<InvoicesPage />);
    
    // Default is 'All', should see both Paid and Pending
    expect(screen.getByText('Acme Corp')).toBeInTheDocument(); // Paid
    expect(screen.getByText('Globex Inc')).toBeInTheDocument(); // Pending

    // Click 'Paid' tab
    const paidButton = screen.getByRole('button', { name: /^Paid$/ });
    fireEvent.click(paidButton);
    expect(screen.getByText('Acme Corp')).toBeInTheDocument(); // Paid
    expect(screen.queryByText('Globex Inc')).not.toBeInTheDocument(); // Pending

    // Click 'Draft' tab
    const draftButton = screen.getByRole('button', { name: /^Draft$/ });
    fireEvent.click(draftButton);
    expect(screen.getByText('Initech')).toBeInTheDocument(); // Draft
    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument(); // Paid
  });

  it('filters invoices by search query', () => {
    render(<InvoicesPage />);
    const searchInput = screen.getByPlaceholderText('Search invoices...');
    
    fireEvent.change(searchInput, { target: { value: 'Globex' } });
    expect(screen.getByText('Globex Inc')).toBeInTheDocument();
    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument();

    // Reset search
    fireEvent.change(searchInput, { target: { value: '' } });
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
  });

  it('creates a new invoice via dialog modal', () => {
    render(<InvoicesPage />);
    
    // Open modal
    const createButton = screen.getByRole('button', { name: 'Create Invoice' });
    fireEvent.click(createButton);
    
    // Check modal title
    expect(screen.getByRole('heading', { level: 3, name: 'Create Invoice' })).toBeInTheDocument();

    // Fill form
    const clientInput = screen.getByLabelText('Client Name');
    const amountInput = screen.getByLabelText('Amount ($)');
    const statusSelect = screen.getByLabelText('Status');

    fireEvent.change(clientInput, { target: { value: 'Google Corp' } });
    fireEvent.change(amountInput, { target: { value: '9800.50' } });
    fireEvent.change(statusSelect, { target: { value: 'Paid' } });

    // Submit form
    const submitBtn = screen.getByRole('button', { name: 'Create' });
    fireEvent.click(submitBtn);

    // Verify modal is closed
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();

    // Verify Google Corp is in table
    expect(screen.getByText('Google Corp')).toBeInTheDocument();
    expect(screen.getByText('$9800.50')).toBeInTheDocument();
  });

  it('deletes an invoice when clicking trash icon', () => {
    render(<InvoicesPage />);
    
    expect(screen.getByText('INV-0003')).toBeInTheDocument();
    expect(screen.getByText('Soylent Corp')).toBeInTheDocument();

    // Find row containing Soylent Corp
    const row = screen.getByText('Soylent Corp').closest('tr')!;
    const deleteBtn = within(row).getByTitle('Delete');
    fireEvent.click(deleteBtn);

    // Soylent Corp should be deleted
    expect(screen.queryByText('Soylent Corp')).not.toBeInTheDocument();
  });
});
