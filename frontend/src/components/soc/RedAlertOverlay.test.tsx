import { render, screen, act, fireEvent } from '@testing-library/react';
import RedAlertOverlay from './RedAlertOverlay';
import { Threat } from '@/lib/soc-types';

const mockThreat: Threat = {
  id: '1',
  type: 'Flash Loan Attack',
  severity: 'CRITICAL',
  action: 'Draining Liquidity Pool',
  targetUser: '0x1234...5678',
  timestamp: new Date('2026-04-17T12:00:00Z').toISOString()
};

describe('RedAlertOverlay', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('renders nothing when no threat is provided', () => {
    const { container } = render(<RedAlertOverlay threat={null} onDismiss={jest.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders threat details when threat is provided', () => {
    render(<RedAlertOverlay threat={mockThreat} onDismiss={jest.fn()} />);
    expect(screen.getByText('THREAT DETECTED')).toBeInTheDocument();
    expect(screen.getByText(mockThreat.targetUser)).toBeInTheDocument();
    expect(screen.getByText(mockThreat.type)).toBeInTheDocument();
  });

  it('progresses through interception phases', () => {
    render(<RedAlertOverlay threat={mockThreat} onDismiss={jest.fn()} />);
    
    // Initial phase
    expect(screen.getByText('THREAT DETECTED')).toBeInTheDocument();
    
    // Advance to phase 1 (Analyzing) at 800ms
    act(() => {
      jest.advanceTimersByTime(800);
    });
    expect(screen.getByText('ANALYZING PAYLOAD')).toBeInTheDocument();
    
    // Advance to phase 2 (Intercepting) at 2000ms
    act(() => {
      jest.advanceTimersByTime(1200); // 800 + 1200 = 2000
    });
    expect(screen.getByText('INTERCEPTING TX')).toBeInTheDocument();

    // Advance to phase 3 (Secured) at 3500ms
    act(() => {
      jest.advanceTimersByTime(1500); // 2000 + 1500 = 3500
    });
    expect(screen.getByText('ASSETS SECURED')).toBeInTheDocument();
  });

  it('calls onDismiss when close button is clicked after secured phase', () => {
    const mockOnDismiss = jest.fn();
    render(<RedAlertOverlay threat={mockThreat} onDismiss={mockOnDismiss} />);
    
    // Fast forward to secured phase
    act(() => {
      jest.advanceTimersByTime(3500);
    });

    const closeButtons = screen.getAllByRole('button');
    expect(closeButtons.length).toBeGreaterThan(0);
    fireEvent.click(closeButtons[0]);
    expect(mockOnDismiss).toHaveBeenCalledTimes(1);
  });

  it('clears timers and skips phase updates if unmounted early', () => {
    const { unmount } = render(<RedAlertOverlay threat={mockThreat} onDismiss={jest.fn()} />);
    
    // unmount the component immediately, setting isMounted to false in the useEffect closure
    unmount();
    
    // advance timers, the callbacks will run but should not trigger state updates or errors
    act(() => {
      jest.advanceTimersByTime(4000);
    });
    
    // If it threw an error due to state update on unmounted component, the test would fail.
    // Also covers the false branch of `if (isMounted)`
  });
});
