import { render, act } from '@testing-library/react';
import HexGridCanvas from './HexGridCanvas';

describe('HexGridCanvas', () => {
  let rAFSpy: jest.SpyInstance;
  let cAFSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    rAFSpy = jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
      return setTimeout(() => cb(performance.now()), 16) as unknown as number;
    });
    cAFSpy = jest.spyOn(window, 'cancelAnimationFrame').mockImplementation((id: number) => {
      clearTimeout(id);
    });

    // basic canvas polyfill setup since JSDOM lacks canvas API implementation
    HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
      scale: jest.fn(),
      clearRect: jest.fn(),
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      stroke: jest.fn(),
      createRadialGradient: jest.fn().mockReturnValue({ addColorStop: jest.fn() }),
      arc: jest.fn(),
      fill: jest.fn(),
    }) as unknown as CanvasRenderingContext2D);
    
    // Polyfill getBoundingClientRect for canvas
    HTMLCanvasElement.prototype.getBoundingClientRect = () => ({
      width: 500, height: 500, top: 0, left: 0, bottom: 500, right: 500, x: 0, y: 0, toJSON: () => {}
    });
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

  it('renders canvas element and draws grid at low threat', () => {
    const { container, unmount } = render(<HexGridCanvas threatLevel={0} />);
    expect(container.querySelector('canvas')).toBeInTheDocument();
    
    // Advance timers enough to trigger draw, multiple pulses, and pulse removal
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    unmount();
  });

  it('handles resizes cleanly', () => {
    const { unmount } = render(<HexGridCanvas threatLevel={1} />);
    
    act(() => {
      window.dispatchEvent(new Event('resize'));
      jest.advanceTimersByTime(100);
    });
    
    unmount();
  });

  it('handles mouse movements cleanly with repulsion', () => {
    const { unmount } = render(<HexGridCanvas threatLevel={0} />);
    
    act(() => {
      // Advance to spawn nodes
      jest.advanceTimersByTime(100);
      
      // Move mouse close to origin which pushes nodes
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 100, clientY: 100 }));
      
      // Advance timers to trigger draw with mouse interaction
      jest.advanceTimersByTime(500);
    });
    
    unmount();
  });

  it('draws at high threat level to spawn red pulses', () => {
    const { unmount } = render(<HexGridCanvas threatLevel={1} />);
    
    act(() => {
      jest.advanceTimersByTime(500); // 400ms is the threshold for threatLevel > 0
    });
    
    unmount();
  });

  it('handles null canvas context gracefully', () => {
    HTMLCanvasElement.prototype.getContext = jest.fn(() => null);
    const { unmount } = render(<HexGridCanvas threatLevel={0} />);
    unmount();
  });

  it('renders with default props and handles missing devicePixelRatio', () => {
    const originalDpr = window.devicePixelRatio;
    Object.defineProperty(window, 'devicePixelRatio', { value: undefined, writable: true });
    
    // We will advance timers by a huge amount so Math.random > 0.3 branch runs many times
    const { unmount } = render(<HexGridCanvas />);
    act(() => {
      jest.advanceTimersByTime(20000);
    });
    
    unmount();
    Object.defineProperty(window, 'devicePixelRatio', { value: originalDpr, writable: true });
  });

  it('handles isolated nodes (closestIdx === -1)', () => {
    // Canvas size 1,000,000 to spread nodes far apart
    HTMLCanvasElement.prototype.getBoundingClientRect = () => ({
      width: 1000000, height: 1000000, top: 0, left: 0, bottom: 1000000, right: 1000000, x: 0, y: 0, toJSON: () => {}
    });
    const { unmount } = render(<HexGridCanvas threatLevel={0} />);
    
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    
    unmount();
    // Restore back to 500x500 for other potential tests
    HTMLCanvasElement.prototype.getBoundingClientRect = () => ({
      width: 500, height: 500, top: 0, left: 0, bottom: 500, right: 500, x: 0, y: 0, toJSON: () => {}
    });
  });
});
