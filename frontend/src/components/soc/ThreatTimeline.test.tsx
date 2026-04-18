import { render, screen } from '@testing-library/react';
import ThreatTimeline from './ThreatTimeline';
import { Threat } from '@/lib/soc-types';

const mockThreats: Threat[] = [
  {
    id: 't1',
    type: 'Flash Loan Attack',
    severity: 'CRITICAL',
    action: 'Draining Pool',
    targetUser: '0x11112222',
    timestamp: new Date('2026-04-17T10:00:00Z').toISOString()
  },
  {
    id: 't2',
    type: 'Oracle Manipulation',
    severity: 'HIGH',
    action: 'Price feed skew',
    targetUser: '0x33334444',
    timestamp: new Date('2026-04-17T11:00:00Z').toISOString()
  },
  {
    id: 't3',
    type: 'Reentrancy Exploit',
    severity: 'MEDIUM',
    action: 'Recursive calls detected',
    targetUser: '0x55556666',
    timestamp: new Date('2026-04-17T12:00:00Z').toISOString()
  },
  {
    id: 't4',
    type: 'Unknown Attack',
    severity: 'LOW',
    action: 'Suspicious anomaly',
    targetUser: '0x77778888',
    timestamp: new Date('2026-04-17T13:00:00Z').toISOString()
  }
];

describe('ThreatTimeline', () => {
  it('renders threats from provided data', () => {
    render(<ThreatTimeline threats={mockThreats} />);
    
    expect(screen.getByText('Flash Loan Attack')).toBeInTheDocument();
    expect(screen.getByText('Oracle Manipulation')).toBeInTheDocument();
    expect(screen.getByText('Draining Pool')).toBeInTheDocument();
    // target user slices
    expect(screen.getByText(/Target: 0x1111\.\.\./)).toBeInTheDocument();
    expect(screen.getByText('Intercepted & Secured')).toBeInTheDocument(); // for CRITICAL
  });

  it('renders empty state when no threats', () => {
    render(<ThreatTimeline threats={[]} />);
    expect(screen.getByText('No recent threats detected.')).toBeInTheDocument();
  });

  it('renders severity badges correctly', () => {
    render(<ThreatTimeline threats={mockThreats} />);
    expect(screen.getByText('CRITICAL')).toBeInTheDocument();
    expect(screen.getByText('HIGH')).toBeInTheDocument();
  });
});
