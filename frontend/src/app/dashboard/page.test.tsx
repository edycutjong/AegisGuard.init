import { render, screen, act, fireEvent } from '@testing-library/react';
import DashboardPage from './page';

// Mock child components to prevent canvas or recharts DOM issues
jest.mock('@/components/soc/SessionMonitor', () => function MockSessionMonitor({ onRevoke }: { onRevoke: (id: string) => void }) {
  return (
    <div data-testid="session-monitor">
      <button data-testid="mock-revoke" onClick={() => onRevoke('s1')}>Revoke Session 1</button>
    </div>
  );
});
jest.mock('@/components/soc/ThreatTimeline', () => function MockThreatTimeline() { return <div data-testid="threat-timeline" />; });
jest.mock('@/components/soc/RevenueTracker', () => function MockRevenueTracker() { return <div data-testid="revenue-tracker" />; });
jest.mock('@/components/soc/RedAlertOverlay', () => function MockRedAlertOverlay({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div data-testid="red-alert-overlay">
      <button data-testid="mock-dismiss" onClick={onDismiss}>Dismiss</button>
    </div>
  );
});
jest.mock('@/components/effects/HexGridCanvas', () => function MockHexGridCanvas() { return <div data-testid="hex-grid-canvas" />; });
jest.mock('@/components/effects/LiveStatsBar', () => function MockLiveStatsBar() { return <div data-testid="live-stats-bar" />; });
jest.mock('@/components/effects/GlitchText', () => function MockGlitchText({ text }: { text: string }) { return <span>{text}</span>; });
jest.mock('@/components/effects/StatusTicker', () => function MockStatusTicker() { return <div data-testid="status-ticker" />; });

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
    fireEvent.click(revokeBtn);
  });

  it('shows threat after timeout and can dismiss it', async () => {
    render(<DashboardPage />);
    
    // Fast-forward until timer is executed
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    const dismissBtn = screen.getByTestId('mock-dismiss');
    fireEvent.click(dismissBtn);
  });
});
