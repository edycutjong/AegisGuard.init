"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SessionMonitor from "@/components/soc/SessionMonitor";
import ThreatTimeline from "@/components/soc/ThreatTimeline";
import RevenueTracker from "@/components/soc/RevenueTracker";
import RedAlertOverlay from "@/components/soc/RedAlertOverlay";
import HexGridCanvas from "@/components/effects/HexGridCanvas";
import LiveStatsBar from "@/components/effects/LiveStatsBar";
import GlitchText from "@/components/effects/GlitchText";
import StatusTicker from "@/components/effects/StatusTicker";
import { Session, Threat, RevenueData } from "@/lib/soc-types";

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

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
  const [sessions, setSessions] = useState<Session[]>(mockSessions);
  const [threats] = useState<Threat[]>(mockThreats);
  const [revenue] = useState<RevenueData[]>(mockRevenue);
  const [activeThreat, setActiveThreat] = useState<Threat | null>(null);
  const [systemTime, setSystemTime] = useState("");

  // Live clock
  useEffect(() => {
    const tick = () => {
      setSystemTime(new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  // Example of triggering the RedAlertOverlay for demo purposes
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveThreat(mockThreats[0]);
    }, 5000); // Trigger after 5 seconds for visual impact
    
    return () => clearTimeout(timer);
  }, []);

  const handleRevoke = (id: string) => {
    setSessions(prev => prev.map(s => 
      s.id === id ? { ...s, status: "REVOKED", timeRemaining: 0 } : s
    ));
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative overflow-hidden">
      {/* Animated Network Background */}
      <HexGridCanvas threatLevel={activeThreat ? 1 : 0} />
      
      {/* Ambient corner glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-ai-purple/[0.04] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-aegis-cyan/[0.03] rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="border-b border-sol-border/50 backdrop-blur-md bg-dark-slate/30 relative z-10"
      >
        <div className="px-6 pt-5 pb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-orbitron font-bold tracking-tight text-white uppercase flex items-center gap-3">
              <GlitchText text="Aegis SOC Command" className="inline" />
              <span className="inline-flex items-center gap-1.5 bg-ai-purple/10 text-ai-purple text-[10px] font-mono px-2.5 py-1 rounded-full border border-ai-purple/20 uppercase tracking-widest">
                MOCK MODE
              </span>
            </h1>
            <div className="flex items-center gap-4 mt-1.5">
              <p className="text-aegis-cyan font-mono text-sm">Real-time Initia Appchain Monitoring</p>
              <span className="hidden md:inline text-muted-text/40 font-mono text-xs">|</span>
              <span className="hidden md:inline text-muted-text font-mono text-xs tabular-nums">{systemTime} UTC</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden lg:block max-w-sm">
              <StatusTicker />
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-shield-green animate-pulse"></span>
              <span className="text-xs font-mono uppercase tracking-wider text-muted-text">System Active</span>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Live Stats Bar */}
      <LiveStatsBar />

      {/* Main */}
      <motion.main
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-260px)] p-6 relative z-10"
      >
        <motion.div variants={fadeUp}>
          <SessionMonitor sessions={sessions} onRevoke={handleRevoke} />
        </motion.div>
        <motion.div variants={fadeUp}>
          <ThreatTimeline threats={threats} />
        </motion.div>
        <motion.div variants={fadeUp}>
          <RevenueTracker data={revenue} />
        </motion.div>
      </motion.main>

      <RedAlertOverlay 
        threat={activeThreat} 
        onDismiss={() => setActiveThreat(null)} 
      />
    </div>
  );
}
