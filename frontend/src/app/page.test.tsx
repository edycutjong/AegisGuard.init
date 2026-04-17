import { render, screen, waitFor } from '@testing-library/react';
import Page from './page';

// Mock child components to prevent canvas or recharts DOM issues
jest.mock('@/components/soc/SessionMonitor', () => ({ onRevoke }: any) => (
  <div data-testid="session-monitor">
    <button data-testid="mock-revoke" onClick={() => onRevoke('session1')}>Revoke Session 1</button>
  </div>
));
jest.mock('@/components/soc/ThreatTimeline', () => () => <div data-testid="threat-timeline" />);
jest.mock('@/components/soc/RevenueTracker', () => () => <div data-testid="revenue-tracker" />);
jest.mock('@/components/soc/RedAlertOverlay', () => ({ onDismiss }: any) => (
  <div data-testid="red-alert-overlay">
    <button data-testid="mock-dismiss" onClick={onDismiss}>Dismiss</button>
  </div>
));
jest.mock('@/components/effects/HexGridCanvas', () => () => <div data-testid="hex-grid-canvas" />);
jest.mock('@/components/effects/LiveStatsBar', () => () => <div data-testid="live-stats-bar" />);
jest.mock('@/components/effects/RadarSweep', () => () => <div data-testid="radar-sweep" />);
jest.mock('@/components/effects/GlitchText', () => ({ text }: any) => <span>{text}</span>);
jest.mock('@/components/effects/StatusTicker', () => () => <div data-testid="status-ticker" />);

describe('Main Page', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ sessions: [{ id: 'session1', status: 'ACTIVE', timeRemaining: 100 }, { id: 'session2', status: 'ACTIVE', timeRemaining: 100 }], threats: [], revenue: [] }),
      })
    ) as jest.Mock;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the SOC Command dashboard', async () => {
    render(<Page />);
    
    expect(screen.getByText('Aegis SOC Command')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/dashboard'));
    });
  });

  it('handles dashboard load when res is not ok', async () => {
    const fetchMock = global.fetch as jest.Mock;
    fetchMock.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({}),
      })
    );
    render(<Page />);
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/dashboard'));
    });
  });

  it('handles dashboard load with missing data arrays', async () => {
    const fetchMock = global.fetch as jest.Mock;
    fetchMock.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}), // missing sessions, threats, revenue
      })
    );
    render(<Page />);
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/dashboard'));
    });
  });

  it('renders the system control panel actions', async () => {
    render(<Page />);
    expect(screen.getByText('SIMULATE EXPLOIT')).toBeInTheDocument();
    expect(screen.getByText('GLOBAL HALT (UNLOCK)')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/dashboard'));
    });
  });
  it('handles global halt', async () => {
    render(<Page />);
    
    // Initial fetch from dashboard
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/dashboard'));
    });
    
    // Mock the halt API
    const fetchMock = global.fetch as jest.Mock;
    fetchMock.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
    );

    const { getByText, getByRole, fireEvent } = require('@testing-library/react');
    const haltButton = screen.getByText('GLOBAL HALT (UNLOCK)');
    
    require('@testing-library/react').fireEvent.click(haltButton);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/halt'),
        expect.objectContaining({ method: 'POST' })
      );
    });
  });

  it('handles simulate exploit', async () => {
    render(<Page />);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/dashboard'));
    });
    
    const fetchMock = global.fetch as jest.Mock;
    fetchMock.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ threat_detected: true, reason: 'flash loan', severity: 'CRITICAL' }),
      })
    );

    const simulateBtn = screen.getByText('SIMULATE EXPLOIT');
    require('@testing-library/react').fireEvent.click(simulateBtn);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/scan'),
        expect.objectContaining({ method: 'POST' })
      );
    });
  });

  it('handles simulate exploit without threat detected', async () => {
    render(<Page />);
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/dashboard'));
    });
    const fetchMock = global.fetch as jest.Mock;
    fetchMock.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ threat_detected: false }),
      })
    );
    const simulateBtn = screen.getByText('SIMULATE EXPLOIT');
    require('@testing-library/react').fireEvent.click(simulateBtn);
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/scan'), expect.anything());
    });
  });

  it('handles simulate exploit with non-flash-loan reason', async () => {
    render(<Page />);
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/dashboard'));
    });
    const fetchMock = global.fetch as jest.Mock;
    fetchMock.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ threat_detected: true, reason: 'some other reason', severity: null }),
      })
    );
    const simulateBtn = screen.getByText('SIMULATE EXPLOIT');
    require('@testing-library/react').fireEvent.click(simulateBtn);
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/scan'), expect.anything());
    });
  });

  it('triggers hidden shortcut cmd+shift+a', async () => {
    render(<Page />);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/dashboard'));
    });
    
    const { fireEvent } = require('@testing-library/react');
    // Wrong key
    fireEvent.keyDown(window, { metaKey: true, shiftKey: true, key: 'b' });
    // Correct combinations
    fireEvent.keyDown(window, { metaKey: true, shiftKey: true, key: 'a' });
    fireEvent.keyDown(window, { ctrlKey: true, shiftKey: true, key: 'a' });
  });

  it('handles revoke session', async () => {
    render(<Page />);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/dashboard'));
    });
    
    const fetchMock = global.fetch as jest.Mock;
    fetchMock.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
    );

    const { getByTestId, fireEvent } = require('@testing-library/react');
    const revokeBtn = screen.getByTestId('mock-revoke');
    require('@testing-library/react').fireEvent.click(revokeBtn);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/revoke'),
        expect.objectContaining({ method: 'POST', body: JSON.stringify({ session_id: 'session1' }) })
      );
    });
  });

  it('handles errors gracefully during initial load', async () => {
    // Override before each mock
    const fetchMock = global.fetch as jest.Mock;
    fetchMock.mockImplementationOnce(() => Promise.reject(new Error("Network fail")));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<Page />);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Failed to load dashboard data", expect.any(Error));
    });
    consoleSpy.mockRestore();
  });

  it('handles revoke session error', async () => {
    render(<Page />);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/dashboard'));
    });
    
    const fetchMock = global.fetch as jest.Mock;
    fetchMock.mockImplementationOnce(() => Promise.reject(new Error("API Down")));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const { getByTestId, fireEvent } = require('@testing-library/react');
    const revokeBtn = screen.getByTestId('mock-revoke');
    require('@testing-library/react').fireEvent.click(revokeBtn);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Failed to revoke session", expect.any(Error));
    });
    consoleSpy.mockRestore();
  });

  it('handles global halt error', async () => {
    render(<Page />);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/dashboard'));
    });
    
    const fetchMock = global.fetch as jest.Mock;
    fetchMock.mockImplementationOnce(() => Promise.reject(new Error("API Down")));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const { getByText, fireEvent } = require('@testing-library/react');
    const haltButton = screen.getByText('GLOBAL HALT (UNLOCK)');
    require('@testing-library/react').fireEvent.click(haltButton);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Failed to global halt", expect.any(Error));
    });
    consoleSpy.mockRestore();
  });

  it('handles simulate exploit error', async () => {
    render(<Page />);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/dashboard'));
    });
    
    const fetchMock = global.fetch as jest.Mock;
    fetchMock.mockImplementationOnce(() => Promise.reject(new Error("API Down")));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const simulateBtn = screen.getByText('SIMULATE EXPLOIT');
    require('@testing-library/react').fireEvent.click(simulateBtn);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Backend unreachable", expect.any(Error));
    });
    consoleSpy.mockRestore();
  });

  it('handles dismiss active threat', async () => {
    render(<Page />);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/dashboard'));
    });
    
    const fetchMock = global.fetch as jest.Mock;
    fetchMock.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ threat_detected: true, reason: 'flash loan', severity: 'CRITICAL' }),
      })
    );

    const { getByText, getByTestId, fireEvent } = require('@testing-library/react');
    const simulateBtn = screen.getByText('SIMULATE EXPLOIT');
    fireEvent.click(simulateBtn);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/scan'),
        expect.objectContaining({ method: 'POST' })
      );
    });

    const dismissBtn = screen.getByTestId('mock-dismiss');
    fireEvent.click(dismissBtn);
  });
});
