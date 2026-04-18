import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SessionMonitor from './SessionMonitor';
import { Session } from '@/lib/soc-types';

const mockSessions: Session[] = [
  {
    id: 's1',
    address: '0x1234567890abcdef1234567890abcdef12345678',
    status: 'SAFE',
    timeRemaining: 180,
    txCount: 5,
    dappName: 'Initia DEX',
    startTime: Date.now()
  },
  {
    id: 's2',
    address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
    status: 'SUSPICIOUS',
    timeRemaining: 60,
    txCount: 12,
    dappName: 'Unknown Contract',
    startTime: Date.now()
  },
  {
    id: 's3',
    address: '0x3333333333333333333333333333333333333333',
    status: 'REVOKED',
    timeRemaining: 0,
    txCount: 2,
    dappName: 'Bad Game',
    startTime: Date.now()
  }
];

describe('SessionMonitor', () => {
  it('renders active sessions count', () => {
    render(<SessionMonitor sessions={mockSessions} />);
    expect(screen.getByText('3 LIVE')).toBeInTheDocument();
  });

  it('renders session details', () => {
    render(<SessionMonitor sessions={mockSessions} />);
    expect(screen.getByText('Initia DEX')).toBeInTheDocument();
    expect(screen.getByText('0x1234...5678')).toBeInTheDocument();
    expect(screen.getByText('Unknown Contract')).toBeInTheDocument();
    expect(screen.getByText('Bad Game')).toBeInTheDocument();
  });

  it('formats time correctly', () => {
    render(<SessionMonitor sessions={mockSessions} />);
    expect(screen.getByText('3:00')).toBeInTheDocument(); // 180 seconds
    expect(screen.getByText('1:00')).toBeInTheDocument(); // 60 seconds
  });

  it('calls onRevoke when revoke button is clicked', async () => {
    const mockOnRevoke = jest.fn().mockResolvedValue(undefined);
    render(<SessionMonitor sessions={mockSessions} onRevoke={mockOnRevoke} />);
    
    // There are 3 sessions, but REVOKED is disabled. So get them by getAllByRole
    const revokeButtons = screen.getAllByRole('button', { name: /revoke auth/i });
    
    // The button for s1 is active
    fireEvent.click(revokeButtons[0]);
    
    expect(mockOnRevoke).toHaveBeenCalledWith('s1');
    expect(screen.getByText('REVOKING...')).toBeInTheDocument();

    await waitFor(() => {
      expect(mockOnRevoke).toHaveBeenCalledTimes(1);
    });
  });

  it('does nothing when revoke button is clicked if onRevoke is not provided', () => {
    render(<SessionMonitor sessions={mockSessions} />);
    const revokeButtons = screen.getAllByRole('button', { name: /revoke auth/i });
    fireEvent.click(revokeButtons[0]);
    // It should not throw or change to "REVOKING..." because it returned early
    expect(screen.queryByText('REVOKING...')).not.toBeInTheDocument();
  });

  it('renders empty state when no sessions provide', () => {
    render(<SessionMonitor sessions={[]} />);
    expect(screen.getByText('No Active Sessions')).toBeInTheDocument();
  });
});
