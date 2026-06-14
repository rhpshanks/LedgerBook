import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { NotificationsPanel } from '../components/layout/NotificationsPanel';

describe('NotificationsPanel Component', () => {
  it('renders the bell button with unread count badge', () => {
    render(<NotificationsPanel />);
    const bell = screen.getByRole('button', { name: /Open notifications/i });
    expect(bell).toBeInTheDocument();
    // Should show unread badge
    expect(screen.getByLabelText(/unread notifications/i)).toBeInTheDocument();
  });

  it('opens the notification panel when bell is clicked', () => {
    render(<NotificationsPanel />);
    expect(screen.queryByTestId('notifications-panel')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Open notifications/i }));
    expect(screen.getByTestId('notifications-panel')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Notifications' })).toBeInTheDocument();
  });

  it('renders all initial notifications with titles and messages', () => {
    render(<NotificationsPanel />);
    fireEvent.click(screen.getByRole('button', { name: /Open notifications/i }));

    expect(screen.getByText('Overdue Invoice')).toBeInTheDocument();
    expect(screen.getByText('Payment Received')).toBeInTheDocument();
    expect(screen.getByText('Payroll Due Tomorrow')).toBeInTheDocument();
    expect(screen.getByText('Low Bank Balance')).toBeInTheDocument();
    expect(screen.getByText('Balance Sheet Out of Balance')).toBeInTheDocument();
  });

  it('shows only unread notifications when "Unread" filter tab is clicked', () => {
    render(<NotificationsPanel />);
    fireEvent.click(screen.getByRole('button', { name: /Open notifications/i }));

    const unreadTab = screen.getByRole('button', { name: 'Unread' });
    fireEvent.click(unreadTab);

    // Unread: n1, n2, n3, n4, n5 (5 notifications)
    expect(screen.getByText('Overdue Invoice')).toBeInTheDocument();
    expect(screen.getByText('Payroll Due Tomorrow')).toBeInTheDocument();

    // Read ones are excluded
    expect(screen.queryByText('Exchange Rate Updated')).not.toBeInTheDocument();
    expect(screen.queryByText('Expense Report Ready')).not.toBeInTheDocument();
  });

  it('filters by Invoices tab showing only invoice notifications', () => {
    render(<NotificationsPanel />);
    fireEvent.click(screen.getByRole('button', { name: /Open notifications/i }));

    fireEvent.click(screen.getByRole('button', { name: 'Invoices' }));

    expect(screen.getByText('Overdue Invoice')).toBeInTheDocument();
    expect(screen.getByText('New Invoice Pending')).toBeInTheDocument();

    // Non-invoice categories should not appear
    expect(screen.queryByText('Payroll Due Tomorrow')).not.toBeInTheDocument();
    expect(screen.queryByText('Low Bank Balance')).not.toBeInTheDocument();
  });

  it('marks a notification as read when clicked (removes blue dot)', () => {
    render(<NotificationsPanel />);
    fireEvent.click(screen.getByRole('button', { name: /Open notifications/i }));

    // Click "Unread" tab to isolate unread
    fireEvent.click(screen.getByRole('button', { name: 'Unread' }));
    const initialCount = screen.getAllByText(/ago|Yesterday/i).length;

    // Click on the "Overdue Invoice" notification to mark it read
    fireEvent.click(screen.getByText('Overdue Invoice'));

    // Now with unread filter still on, it should be gone from the list
    expect(screen.queryByText('Overdue Invoice')).not.toBeInTheDocument();

    // Switch back to All to verify it still exists there
    fireEvent.click(screen.getByRole('button', { name: 'All' }));
    expect(screen.getByText('Overdue Invoice')).toBeInTheDocument();
  });

  it('marks all notifications as read via "Mark all read" button', () => {
    render(<NotificationsPanel />);
    fireEvent.click(screen.getByRole('button', { name: /Open notifications/i }));

    // Click "Mark all read"
    const markAllBtn = screen.getByRole('button', { name: /Mark all read/i });
    fireEvent.click(markAllBtn);

    // Unread badge should be gone from bell button (the aria-label disappears)
    expect(screen.queryByLabelText(/unread notifications/i)).not.toBeInTheDocument();

    // The "Mark all read" button itself should be gone
    expect(screen.queryByRole('button', { name: /Mark all read/i })).not.toBeInTheDocument();
  });

  it('dismisses a notification via the X button', () => {
    render(<NotificationsPanel />);
    fireEvent.click(screen.getByRole('button', { name: /Open notifications/i }));

    expect(screen.getByText('Overdue Invoice')).toBeInTheDocument();

    // Hover/find dismiss button for "Overdue Invoice"
    const dismissBtns = screen.getAllByRole('button', { name: /Dismiss notification/i });
    fireEvent.click(dismissBtns[0]);

    // Notification is removed
    expect(screen.queryByText('Overdue Invoice')).not.toBeInTheDocument();
  });

  it('clears all notifications via "Clear all" button and shows empty state', () => {
    render(<NotificationsPanel />);
    fireEvent.click(screen.getByRole('button', { name: /Open notifications/i }));

    const clearBtn = screen.getByRole('button', { name: /Clear all/i });
    fireEvent.click(clearBtn);

    // Empty state should be shown
    expect(screen.getByText(/All caught up!/i)).toBeInTheDocument();
    expect(screen.getByText(/No notifications to show/i)).toBeInTheDocument();
  });
});
