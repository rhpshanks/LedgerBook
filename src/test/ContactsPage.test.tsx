import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { ContactsPage } from '../modules/contacts/ContactsPage';

describe('ContactsPage Component', () => {
  it('renders initial contacts list', () => {
    render(<ContactsPage />);
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    expect(screen.getByText('AWS')).toBeInTheDocument();
    expect(screen.getByText('Globex Inc')).toBeInTheDocument();
  });

  it('filters contacts by tab', () => {
    render(<ContactsPage />);
    expect(screen.getByText('Acme Corp')).toBeInTheDocument(); // Customer
    expect(screen.getByText('AWS')).toBeInTheDocument(); // Supplier

    // Click Customers tab
    const customersBtn = screen.getByRole('button', { name: /^Customers$/ });
    fireEvent.click(customersBtn);
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    expect(screen.queryByText('AWS')).not.toBeInTheDocument();

    // Click Suppliers tab
    const suppliersBtn = screen.getByRole('button', { name: /^Suppliers$/ });
    fireEvent.click(suppliersBtn);
    expect(screen.getByText('AWS')).toBeInTheDocument();
    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument();
  });

  it('filters contacts by search query', () => {
    render(<ContactsPage />);
    const searchInput = screen.getByPlaceholderText('Search contacts...');

    fireEvent.change(searchInput, { target: { value: 'globex.com' } });
    expect(screen.getByText('Globex Inc')).toBeInTheDocument();
    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument();
  });

  it('adds a new contact via modal', () => {
    render(<ContactsPage />);

    // Open modal
    const addBtn = screen.getByRole('button', { name: 'Add Contact' });
    fireEvent.click(addBtn);

    // Fill form
    const nameInput = screen.getByLabelText('Contact Name');
    const typeSelect = screen.getByLabelText('Type');
    const emailInput = screen.getByLabelText('Email');
    const phoneInput = screen.getByLabelText('Phone');
    const balanceInput = screen.getByLabelText('Opening Balance ($)');

    fireEvent.change(nameInput, { target: { value: 'Microsoft' } });
    fireEvent.change(typeSelect, { target: { value: 'Supplier' } });
    fireEvent.change(emailInput, { target: { value: 'billing@microsoft.com' } });
    fireEvent.change(phoneInput, { target: { value: '+1 800-111-2222' } });
    fireEvent.change(balanceInput, { target: { value: '250.00' } });

    // Submit
    const modal = screen.getByRole('heading', { level: 3, name: 'Add Contact' }).closest('div')!;
    const submitBtn = within(modal).getByRole('button', { name: 'Add Contact' });
    fireEvent.click(submitBtn);

    // Verify contact in list
    expect(screen.getByText('Microsoft')).toBeInTheDocument();
    expect(screen.getByText('billing@microsoft.com')).toBeInTheDocument();
  });

  it('deletes a contact', () => {
    render(<ContactsPage />);

    expect(screen.getByText('Globex Inc')).toBeInTheDocument();

    const row = screen.getByText('Globex Inc').closest('tr')!;
    const deleteBtn = within(row).getByTitle('Delete');
    fireEvent.click(deleteBtn);

    expect(screen.queryByText('Globex Inc')).not.toBeInTheDocument();
  });
});
