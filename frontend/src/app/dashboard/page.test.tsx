import { render, screen, waitFor, act } from '@testing-library/react';
import DashboardPage from './page';

// Mock child components to prevent canvas or recharts DOM issues
jest.mock('@/components/soc/SessionMonitor', () => ({ onRevoke }: any) => (
  <div data-testid="session-monitor">
    <button data-testid="mock-revoke" onClick={() => onRevoke('s1')}>Revoke Session 1</button>
  </div>
));
jest.mock('@/components/soc/ThreatTimeline', () => () => <div data-testid="threat-timeline" />);
jest.mock('@/components/soc/RevenueTracker', () => () => <div data-testid="revenue-tracker" />);
jest.mock('@/components/soc/RedAlertOverlay', () => ({ onDismiss }: any) => (
  <div data-testid="red-alert-overlay">
    <button data-testid="mock-dismiss" onClick={onDismiss}>Dismiss</button>
  </div>
));
jest.mock('@/components/effects/HexGridCanvas', () => () => <div data-testid="hex-grid-canvas" />);
jest.mock('@/components/effects/LiveStatsBar', () => () => <div data-testid="live-stats-bar" />);
jest.mock('@/components/effects/GlitchText', () => ({ text }: any) => <span>{text}</span>);
jest.mock('@/components/effects/StatusTicker', () => () => <div data-testid="status-ticker" />);

describe('Dashboard Page', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('renders the standard dashboard', async () => {
    render(<DashboardPage />);
    expect(screen.getByText(/Aegis SOC Command/i)).toBeInTheDocument();
  });

  it('handles session revoke', async () => {
    render(<DashboardPage />);
    const revokeBtn = screen.getByTestId('mock-revoke');
    require('@testing-library/react').fireEvent.click(revokeBtn);
  });

  it('shows threat after timeout and can dismiss it', async () => {
    render(<DashboardPage />);
    
    // Fast-forward until timer is executed
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    const dismissBtn = screen.getByTestId('mock-dismiss');
    require('@testing-library/react').fireEvent.click(dismissBtn);
  });
});
