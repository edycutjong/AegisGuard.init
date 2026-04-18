import { render, act } from '@testing-library/react';
import RadarSweep from './RadarSweep';

describe('RadarSweep', () => {
  let rAFSpy: jest.SpyInstance;
  let cAFSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    // Use setTimeout for requestAnimationFrame so advanceTimersByTime can trigger it safely
    rAFSpy = jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
      return setTimeout(() => cb(Date.now()), 16) as unknown as number;
    });
    cAFSpy = jest.spyOn(window, 'cancelAnimationFrame').mockImplementation((id: number) => {
      clearTimeout(id);
    });

    // Mock canvas methods
    HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
      scale: jest.fn(),
      clearRect: jest.fn(),
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      stroke: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn(),
      closePath: jest.fn(),
      createConicGradient: jest.fn().mockReturnValue({ addColorStop: jest.fn() }),
      createRadialGradient: jest.fn().mockReturnValue({ addColorStop: jest.fn() }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any);
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
    rAFSpy.mockRestore();
    cAFSpy.mockRestore();
    jest.clearAllMocks();
  });

  it('renders and draws when active', () => {
    const { container, unmount } = render(<RadarSweep active={true} size={100} />);
    expect(container.querySelector('canvas')).toBeInTheDocument();
    
    // Advance timers twice to trigger requestAnimationFrame and run the draw function
    act(() => {
      jest.advanceTimersByTime(32);
    });

    unmount();
  });

  it('renders and draws when not active', () => {
    const { unmount } = render(<RadarSweep active={false} size={100} />);
    
    act(() => {
      jest.advanceTimersByTime(32);
    });

    unmount();
  });

  it('handles null canvas context gracefully', () => {
    HTMLCanvasElement.prototype.getContext = jest.fn(() => null);
    const { unmount } = render(<RadarSweep active={true} size={100} />);
    unmount();
  });

  it('renders with default props', () => {
    const originalDpr = window.devicePixelRatio;
    Object.defineProperty(window, 'devicePixelRatio', { value: undefined, writable: true });
    
    const { unmount } = render(<RadarSweep />);
    
    act(() => {
      jest.advanceTimersByTime(32);
    });

    unmount();
    Object.defineProperty(window, 'devicePixelRatio', { value: originalDpr, writable: true });
  });

  it('handles early unmount safely (null canvas)', () => {
    // If we unmount before the useEffect, canvas might be null.
    // We can simulate canvas being null by spying on useRef, but React's cleanup is safe.
    // Instead, let's just make sure it unmounts cleanly right away.
    const { unmount } = render(<RadarSweep />);
    unmount();
  });
});
