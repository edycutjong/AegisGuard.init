import { render, screen, act } from '@testing-library/react';
import StatusTicker from './StatusTicker';

describe('StatusTicker', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders the initial message', () => {
    render(<StatusTicker />);
    expect(screen.getByText('BLOCK #18,429,331 VALIDATED')).toBeInTheDocument();
  });

  it('cycles to the next message after interval', () => {
    render(<StatusTicker />);
    
    expect(screen.getByText('BLOCK #18,429,331 VALIDATED')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(3000); // Trigger the interval
    });

    act(() => {
      jest.advanceTimersByTime(400); // Trigger the visibility timeout
    });

    expect(screen.getByText('SESSION 0x7A3F...2C89 APPROVED → InitiaDEX')).toBeInTheDocument();
  });

  it('cycles through other message types including warn', () => {
    render(<StatusTicker />);
    
    // index 0: info
    // index 1: safe
    // index 2: safe
    // index 3: info
    // index 4: warn
    
    act(() => {
      // Advance to index 4 exactly
      for (let i = 0; i < 4; i++) {
        jest.advanceTimersByTime(3000);
        jest.advanceTimersByTime(400);
      }
    });
    
    expect(screen.getByText('FLASH LOAN PATTERN MATCH → MONITORING')).toBeInTheDocument();
  });
});
