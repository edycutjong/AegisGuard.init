import { render, screen, act } from '@testing-library/react';
import GlitchText from './GlitchText';

describe('GlitchText', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders initial text correctly', () => {
    render(<GlitchText text="SYSTEM OK" />);
    expect(screen.getByText('SYSTEM OK')).toBeInTheDocument();
  });

  it('keeps original text when active is false', () => {
    render(<GlitchText text="STATIC" active={false} />);
    
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    
    expect(screen.getByText('STATIC')).toBeInTheDocument();
  });

  it('can trigger a glitch cycle with spaces', () => {
    const origMathRandom = global.Math.random;
    
    // We mock Math.random to sometimes trigger a glitch
    let randomVal = 0.9;
    global.Math.random = () => {
      // Return 0.9 to start glitch, then alternate to cover both char replacement and original char
      randomVal = randomVal === 0.9 ? 0.3 : 0.9; 
      return randomVal;
    };

    // Include a space to cover `if (char === " ")`
    render(<GlitchText text="HELLO WORLD" active={true} speed={10} />);
    
    expect(screen.getByText('HELLO WORLD')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(3000); // Trigger the interval
    });

    act(() => {
      jest.advanceTimersByTime(10); 
    });

    const el = document.querySelector('[data-text="HELLO WORLD"]');
    expect(el).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(100); 
    });
    
    expect(screen.getByText('HELLO WORLD')).toBeInTheDocument();

    global.Math.random = origMathRandom;
  });

  it('skips glitch cycle if Math.random is low', () => {
    const origMathRandom = global.Math.random;
    global.Math.random = () => 0.1; // never trigger > 0.7

    render(<GlitchText text="NO GLITCH" active={true} />);
    
    act(() => {
      jest.advanceTimersByTime(3000); // Trigger interval
    });
    
    expect(screen.getByText('NO GLITCH')).toBeInTheDocument();
    global.Math.random = origMathRandom;
  });

  it('can trigger a glitch cycle', () => {
    // We mock Math.random to always trigger a glitch
    const mockMath = Object.create(global.Math);
    mockMath.random = () => 0.9;
    global.Math = mockMath;

    render(<GlitchText text="HELLO" active={true} speed={10} />);
    
    // Initial
    expect(screen.getByText('HELLO')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(3000); // Trigger the interval
    });

    // Should be in a glitch payload interval since we advanced 3000ms
    act(() => {
      jest.advanceTimersByTime(10); 
    });

    // Glitching makes text obscure, so it might not be HELLO anymore
    const el = document.querySelector('[data-text="HELLO"]');
    expect(el).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(100); // let it finish maxIterations
    });
    
    expect(screen.getByText('HELLO')).toBeInTheDocument(); // Restored
  });
});
