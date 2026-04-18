import { render, screen, act } from '@testing-library/react';
import LiveStatsBar from './LiveStatsBar';

describe('LiveStatsBar', () => {
  let mockObserve: jest.Mock;
  let mockUnobserve: jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    mockObserve = jest.fn();
    mockUnobserve = jest.fn();
    
    let simulatedTime = 0;
    global.requestAnimationFrame = jest.fn((cb) => {
      return setTimeout(() => {
        simulatedTime += 16;
        cb(simulatedTime);
      }, 16) as unknown as number;
    });
    global.cancelAnimationFrame = jest.fn((id) => clearTimeout(id));
    
    // Mock intersection observer
    global.IntersectionObserver = jest.fn().mockImplementation((callback) => {
      // Expose a way to trigger it manually via window variable for tests if needed, 
      // but here we can just capture the callback and call it
      (global as typeof globalThis & { triggerIntersection?: () => void }).triggerIntersection = () => callback([{ isIntersecting: true } as unknown as IntersectionObserverEntry], {} as IntersectionObserver);
      return {
        observe: mockObserve,
        unobserve: mockUnobserve,
        disconnect: jest.fn(),
      };
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    delete (global as typeof globalThis & { triggerIntersection?: () => void }).triggerIntersection;
  });

  it('renders initial state with dashes', () => {
    render(<LiveStatsBar />);
    expect(screen.getByText('TX Scanned')).toBeInTheDocument();
    
    // Should be invisible initially, so showing em-dashes
    const dashes = screen.getAllByText('—');
    expect(dashes.length).toBeGreaterThan(0);
  });

  it('starts animating numbers when intersecting', () => {
    render(<LiveStatsBar />);
    
    act(() => {
      // Trigger intersection
      (global as typeof globalThis & { triggerIntersection?: () => void }).triggerIntersection?.();
    });

    // Animate some time so AnimatedCounter renders values
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(screen.queryAllByText('—')).toHaveLength(0);
    // It should reach target value 284719, so look for a string containing "284,719"
    expect(screen.getByText(/284,719/)).toBeInTheDocument();
    expect(screen.getByText(/1,437/)).toBeInTheDocument();
  });

  it('ignores intersection observer if isIntersecting is false', () => {
    render(<LiveStatsBar />);
    act(() => {
      // Trigger intersection with false
      const observerCallback = (global.IntersectionObserver as jest.Mock).mock.calls[0][0];
      observerCallback([{ isIntersecting: false }]);
    });
    // Should still be hidden (dashes)
    expect(screen.getAllByText('—').length).toBeGreaterThan(0);
  });
});
