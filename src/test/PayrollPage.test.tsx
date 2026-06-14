import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { PayrollPage } from '../modules/payroll/PayrollPage';

describe('PayrollPage Component', () => {
  it('renders payroll disclaimer and runs list', () => {
    render(<PayrollPage />);
    expect(screen.getByText('Important Legal Disclaimer')).toBeInTheDocument();
    expect(screen.getByText(/Payroll tax calculations in LedgerBook are provided for reference only/)).toBeInTheDocument();

    expect(screen.getByText('May 2024')).toBeInTheDocument();
    expect(screen.getByText('April 2024')).toBeInTheDocument();
    expect(screen.getByText('March 2024')).toBeInTheDocument();
  });

  it('switches between payroll tabs', () => {
    render(<PayrollPage />);
    
    // Switch to Employees tab
    const employeesTab = screen.getByRole('button', { name: 'Employees' });
    fireEvent.click(employeesTab);
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    expect(screen.queryByText('May 2024')).not.toBeInTheDocument();

    // Switch back to Runs tab
    const runsTab = screen.getByRole('button', { name: 'Runs' });
    fireEvent.click(runsTab);
    expect(screen.getByText('May 2024')).toBeInTheDocument();
  });

  it('runs a new payroll and calculates net salary', () => {
    render(<PayrollPage />);

    // Click Run Payroll button
    const runBtn = screen.getByRole('button', { name: 'Run Payroll' });
    fireEvent.click(runBtn);

    // Verify modal is open
    expect(screen.getByRole('heading', { level: 3, name: 'Run Payroll' })).toBeInTheDocument();
    const modal = screen.getByRole('heading', { level: 3, name: 'Run Payroll' }).closest('div')!;

    // Fill the inputs
    const periodInput = within(modal).getByLabelText('Pay Period');
    fireEvent.change(periodInput, { target: { value: 'June 2024' } });

    const countInput = within(modal).getByLabelText('Employee Count');
    fireEvent.change(countInput, { target: { value: '15' } });

    const grossInput = within(modal).getByLabelText('Total Gross Payroll ($)');
    fireEvent.change(grossInput, { target: { value: '50000' } });

    // Submit payroll run
    const submitBtn = within(modal).getByRole('button', { name: 'Run Payroll' });
    fireEvent.click(submitBtn);

    // Assert row added
    expect(screen.getByText('June 2024')).toBeInTheDocument();
    const row = screen.getByText('June 2024').closest('tr')!;
    expect(within(row).getByText('15')).toBeInTheDocument();
    expect(within(row).getByText('$50000.00')).toBeInTheDocument();
    expect(within(row).getByText('$40000.00')).toBeInTheDocument(); // 80% net estimation
  });

  it('adds a new employee and lists them in Employees tab', () => {
    render(<PayrollPage />);

    // Click Add Employee button
    const addEmpBtn = screen.getByRole('button', { name: 'Add Employee' });
    fireEvent.click(addEmpBtn);

    // Verify modal open
    expect(screen.getByRole('heading', { level: 3, name: 'Add Employee' })).toBeInTheDocument();
    const modal = screen.getByRole('heading', { level: 3, name: 'Add Employee' }).closest('div')!;

    // Fill employee details
    const nameInput = within(modal).getByLabelText('Full Name');
    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });

    const roleInput = within(modal).getByLabelText('Role');
    fireEvent.change(roleInput, { target: { value: 'Staff Accountant' } });

    const salaryInput = within(modal).getByLabelText('Monthly Gross Salary ($)');
    fireEvent.change(salaryInput, { target: { value: '7200' } });

    // Click submit
    const submitBtn = within(modal).getByRole('button', { name: 'Add Employee' });
    fireEvent.click(submitBtn);

    // Assert tab switches and shows employee
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    const row = screen.getByText('Jane Doe').closest('tr')!;
    expect(within(row).getByText('Staff Accountant')).toBeInTheDocument();
    expect(within(row).getByText('$7200.00')).toBeInTheDocument();
  });

  it('triggers summary download when clicking download button', () => {
    render(<PayrollPage />);

    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    const rows = screen.getAllByRole('row');
    const firstDataRow = rows[1]; // Index 0 is table header
    const downloadBtn = within(firstDataRow).getByTitle('Download Summary');
    fireEvent.click(downloadBtn);

    expect(clickSpy).toHaveBeenCalled();
    clickSpy.mockRestore();
  });
});
