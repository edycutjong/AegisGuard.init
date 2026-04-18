import { render, screen } from '@testing-library/react';
import RevenueTracker from './RevenueTracker';
import { RevenueData } from '@/lib/soc-types';

import React from 'react';

// Mock Recharts to avoid SVG/DOM rendering issues in JSDOM
jest.mock('recharts', () => {
  const OriginalRecharts = jest.requireActual('recharts');
  return {
    ...OriginalRecharts,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="responsive-container">{children}</div>,
    LineChart: ({ children }: { children: React.ReactNode }) => <div data-testid="line-chart">{children}</div>,
    Line: () => <div data-testid="line" />,
    XAxis: () => <div data-testid="x-axis" />,
    YAxis: ({ tickFormatter }: { tickFormatter?: (val: number) => string }) => {
      // Cover the tickFormatter function
      if (tickFormatter) tickFormatter(100);
      return <div data-testid="y-axis" />;
    },
    CartesianGrid: () => <div data-testid="cartesian-grid" />,
    Tooltip: ({ content }: { content?: React.ReactNode }) => {
      // If content is a React element, clone it with props or if it's a function, call it
      return (
        <div data-testid="tooltip">
          {content && React.isValidElement(content) 
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ? React.cloneElement(content as React.ReactElement<any>, { active: true, payload: [{ value: 5.5 }], label: '10:00' } as any)
            : null}
          {content && React.isValidElement(content) 
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ? React.cloneElement(content as React.ReactElement<any>, { active: false } as any) // cover inactive
            : null}
        </div>
      );
    },
  };
});

const mockData: RevenueData[] = [
  { time: '10:00', fees: 1.5 },
  { time: '11:00', fees: 2.5 }
];

describe('RevenueTracker', () => {
  it('renders the total revenue correctly', () => {
    render(<RevenueTracker data={mockData} />);
    // 1.5 + 2.5 = 4.0
    expect(screen.getByText('4.0 INIT Total')).toBeInTheDocument();
  });

  it('renders empty state when no data is provided', () => {
    render(<RevenueTracker data={[]} />);
    expect(screen.getByText('0.0 INIT Total')).toBeInTheDocument();
    expect(screen.getByText('AWAITING REVENUE DATA')).toBeInTheDocument();
  });

  it('renders chart when data is provided', () => {
    render(<RevenueTracker data={mockData} />);
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });

  it('renders KPI rows', () => {
    render(<RevenueTracker data={mockData} />);
    expect(screen.getByText("Today's Intercepts")).toBeInTheDocument();
    expect(screen.getByText('Avg Latency Edge')).toBeInTheDocument();
  });
});
