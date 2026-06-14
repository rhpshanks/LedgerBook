import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// Mock Recharts to avoid layout engine errors in JSDOM environments
vi.mock('recharts', async (importOriginal) => {
  const original = await importOriginal<typeof import('recharts')>();
  return {
    ...original,
    ResponsiveContainer: ({ children }: any) => React.createElement('div', { className: 'responsive-container' }, children),
    AreaChart: ({ children, data }: any) => React.createElement('div', { 'data-testid': 'area-chart', 'data-data': JSON.stringify(data) }, children),
    BarChart: ({ children, data }: any) => React.createElement('div', { 'data-testid': 'bar-chart', 'data-data': JSON.stringify(data) }, children),
    Area: () => null,
    Bar: () => null,
    XAxis: () => null,
    YAxis: () => null,
    CartesianGrid: () => null,
    Tooltip: () => null,
    Legend: () => null,
  };
});
