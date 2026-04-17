import { render } from '@testing-library/react';
import RootLayout, { metadata } from './layout';

// Mock fonts since they error in JSDOM sometimes
jest.mock('next/font/google', () => ({
  Geist: () => ({ variable: '--font-geist-sans', className: 'geist-sans' }),
  Geist_Mono: () => ({ variable: '--font-geist-mono', className: 'geist-mono' }),
}));

describe('RootLayout', () => {
  it('renders children', () => {
    const { getByText } = render(
      <RootLayout>
        <div>Test Child</div>
      </RootLayout>
    );
    expect(getByText('Test Child')).toBeInTheDocument();
  });

  it('exports valid metadata', () => {
    expect(metadata).toBeDefined();
    expect(metadata.title).toBe('AegisGuard.init — AI-Powered Security Appchain');
  });
});
