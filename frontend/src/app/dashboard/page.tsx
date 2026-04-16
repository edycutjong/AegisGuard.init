"use client";

import { useState, useEffect } from "react";
import SessionMonitor from "@/components/soc/SessionMonitor";
import ThreatTimeline from "@/components/soc/ThreatTimeline";
import RevenueTracker from "@/components/soc/RevenueTracker";
import RedAlertOverlay from "@/components/soc/RedAlertOverlay";
import { Session, Threat, RevenueData } from "@/lib/soc-types";

// Mock Data Generators Let's define some dummy data for the dashboard to render beautifully
const mockSessions: Session[] = [
  {
    id: "s1",
    dappName: "InitiaDEX",
    address: "0x1234567890abcdef1234567890abcdef12345678",
    timeRemaining: 120,
    txCount: 4,
    status: "SAFE",
    startTime: Date.now() - 30000,
  },
  {
    id: "s2",
    dappName: "CrossChainBridge",
    address: "0x9876543210fedcba9876543210fedcba98765432",
    timeRemaining: 45,
    txCount: 15,
    status: "SUSPICIOUS",
    startTime: Date.now() - 60000,
  },
  {
    id: "s3",
    dappName: "YieldAggregator",
    address: "0xabcdef1234567890abcdef1234567890abcdef12",
    timeRemaining: 0,
    txCount: 2,
    status: "REVOKED",
    startTime: Date.now() - 120000,
  }
];

const mockThreats: Threat[] = [
  {
    id: "t1",
    timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    type: "Flash Loan Attack",
    severity: "CRITICAL",
    action: "Attempted to drain liquidity pool via reentrancy",
    targetUser: "0x9876543210fedcba9876543210fedcba98765432",
  },
  {
    id: "t2",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    type: "Oracle Manipulation",
    severity: "HIGH",
    action: "Price significantly deviated from TWAP",
    targetUser: "0xabcdef1234567890abcdef1234567890abcdef12",
  },
  {
    id: "t3",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    type: "Suspicious Allowance",
    severity: "MEDIUM",
    action: "Infinite approval granted to unverified contract",
    targetUser: "0x1234567890abcdef1234567890abcdef12345678",
  }
];

const mockRevenue: RevenueData[] = [
  { time: "10:00", fees: 1.2 },
  { time: "11:00", fees: 1.5 },
  { time: "12:00", fees: 2.1 },
  { time: "13:00", fees: 1.8 },
  { time: "14:00", fees: 3.4 },
  { time: "15:00", fees: 2.9 },
  { time: "16:00", fees: 4.2 },
];

export default function DashboardPage() {
  const [sessions] = useState<Session[]>(mockSessions);
  const [threats] = useState<Threat[]>(mockThreats);
  const [revenue] = useState<RevenueData[]>(mockRevenue);
  const [activeThreat, setActiveThreat] = useState<Threat | null>(null);

  // Example of triggering the RedAlertOverlay for demo purposes
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveThreat(mockThreats[0]);
    }, 5000); // Trigger after 5 seconds for visual impact
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans p-6">
      <header className="mb-8 border-b border-sol-border pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-orbitron font-bold tracking-tight text-white mb-1 uppercase">Aegis SOC Command</h1>
          <p className="text-aegis-cyan font-mono text-sm">Real-time Initia Appchain Monitoring</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-shield-green animate-pulse"></span>
            <span className="text-xs font-mono uppercase tracking-wider text-muted-text">System Active</span>
          </div>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-160px)]">
        <SessionMonitor sessions={sessions} />
        <ThreatTimeline threats={threats} />
        <RevenueTracker data={revenue} />
      </main>

      <RedAlertOverlay 
        threat={activeThreat} 
        onDismiss={() => setActiveThreat(null)} 
      />
    </div>
  );
}
