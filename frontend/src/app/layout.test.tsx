import { render, screen } from '@testing-library/react';
import RootLayout, { metadata } from './layout';

// Mock fonts since they error in JSDOM sometimes
jest.mock('next/font/google', () => ({
  Geist: () => ({ variable: '--font-geist-sans', className: 'geist-sans' }),
  Geist_Mono: () => ({ variable: '--font-geist-mono', className: 'geist-mono' }),
}));

describe('RootLayout', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    // Suppress expected console.error logs to keep test output clean
    // RTL wraps render in a <div>, and Next.js layout returns <html>, which triggers validateDOMNesting
    consoleSpy = jest.spyOn(console, 'error').mockImplementation((...args) => {
      const msg = args[0];
      if (typeof msg === 'string' && (msg.includes('cannot be a child of') || msg.includes('hydration error'))) {
        return;
      }
      consoleSpy.mockRestore();
      console.error(...args);
      consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('renders children within the application shell', () => {
    render(
      <RootLayout>
        <div data-testid="test-child">Child Content</div>
      </RootLayout>
    );
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('exports valid metadata', () => {
    expect(metadata).toBeDefined();
    expect(metadata.title).toBe('AegisGuard.init — AI-Powered Security Appchain');
  });
});
