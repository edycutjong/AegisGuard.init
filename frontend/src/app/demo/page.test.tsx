import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import DemoPage from './page';

import * as interwoven from '@initia/interwovenkit-react';

// Mock interwovenkit useAddress
jest.mock('@initia/interwovenkit-react', () => ({
  useAddress: jest.fn(() => '0xUserAddress')
}));

jest.mock('@/components/soc/RedAlertOverlay', () => function MockRedAlertOverlay({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div data-testid="red-alert-overlay">
      <button data-testid="mock-dismiss" onClick={onDismiss}>Dismiss</button>
    </div>
  );
});

describe('Demo Page', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ threat_detected: true }),
      })
    ) as jest.Mock;
    
    // Silence console
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('renders the mocked dApp demo', () => {
    render(<DemoPage />);
    expect(screen.getByText(/InitiaYield/i)).toBeInTheDocument();
  });

  it('handles fluctuating APY', () => {
    render(<DemoPage />);
    act(() => {
      jest.advanceTimersByTime(2000);
    });
  });

  it('handles stake process', () => {
    render(<DemoPage />);
    const maxBtn = screen.getByText('MAX');
    fireEvent.click(maxBtn);

    const stakeInput = screen.getByDisplayValue('1000');
    fireEvent.change(stakeInput, { target: { value: '500' } });

    const stakeBtn = screen.getByText('Approve & Stake INIT');
    fireEvent.click(stakeBtn);
    
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    
    expect(screen.getByText(/Staked 1,000 INIT/i)).toBeInTheDocument();
  });

  it('handles simulate attack success', async () => {
    render(<DemoPage />);
    
    const attackBtn = screen.getByText('Simulate Malicious Contract Upgrade');
    fireEvent.click(attackBtn);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/scan'),
        expect.objectContaining({ method: 'POST' })
      );
    });

    const dismissBtn = screen.getByTestId('mock-dismiss');
    fireEvent.click(dismissBtn);
  });

  it('handles simulate attack error fallback', async () => {
    const fetchMock = global.fetch as jest.Mock;
    fetchMock.mockImplementationOnce(() => Promise.reject(new Error("API Down")));

    render(<DemoPage />);
    
    const attackBtn = screen.getByText('Simulate Malicious Contract Upgrade');
    fireEvent.click(attackBtn);

    // wait for error
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith("AegisGuard Demo Error", expect.any(Error));
    });
  });

  it('renders and simulates attack with no address', async () => {
    (interwoven.useAddress as jest.Mock).mockReturnValueOnce(null);

    render(<DemoPage />);
    
    // Assert fallback text
    expect(screen.getByText('0x82A..3F1')).toBeInTheDocument();

    const attackBtn = screen.getByText('Simulate Malicious Contract Upgrade');
    fireEvent.click(attackBtn);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/scan'),
        expect.objectContaining({ body: expect.stringContaining('0xUNKNOWN') })
      );
    });
  });

  it('renders and simulates attack with no address and handles API error', async () => {
    (interwoven.useAddress as jest.Mock).mockReturnValueOnce(null);
    const fetchMock = global.fetch as jest.Mock;
    fetchMock.mockImplementationOnce(() => Promise.reject(new Error("API Down")));

    render(<DemoPage />);
    
    // Assert fallback text
    expect(screen.getByText('0x82A..3F1')).toBeInTheDocument();

    const attackBtn = screen.getByText('Simulate Malicious Contract Upgrade');
    fireEvent.click(attackBtn);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/scan'),
        expect.objectContaining({ body: expect.stringContaining('0xUNKNOWN') })
      );
      expect(console.error).toHaveBeenCalledWith("AegisGuard Demo Error", expect.any(Error));
    });
  });
});
