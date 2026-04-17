"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import SessionMonitor from "@/components/soc/SessionMonitor";
import ThreatTimeline from "@/components/soc/ThreatTimeline";
import RevenueTracker from "@/components/soc/RevenueTracker";
import RedAlertOverlay from "@/components/soc/RedAlertOverlay";
import HexGridCanvas from "@/components/effects/HexGridCanvas";
import LiveStatsBar from "@/components/effects/LiveStatsBar";
import RadarSweep from "@/components/effects/RadarSweep";
import GlitchText from "@/components/effects/GlitchText";
import StatusTicker from "@/components/effects/StatusTicker";
import { Session, Threat, RevenueData } from "@/lib/soc-types";

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

export default function SOCDashboard() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [threats, setThreats] = useState<Threat[]>([]);
  const [revenue, setRevenue] = useState<RevenueData[]>([]);
  
  const [activeThreat, setActiveThreat] = useState<Threat | null>(null);

  const [isHalting, setIsHalting] = useState(false);
  const [isHalted, setIsHalted] = useState(false);
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

  useEffect(() => {
    async function loadDashboard() {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
        const res = await fetch(`${backendUrl}/api/dashboard`);
        if (res.ok) {
          const data = await res.json();
          setSessions(data.sessions || []);
          setThreats(data.threats || []);
          setRevenue(data.revenue || []);
        }
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      }
    }
    loadDashboard();
  }, []);

  const handleRevoke = async (id: string) => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      await fetch(`${backendUrl}/api/revoke`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: id })
      });
      setSessions(prev => prev.map(s => 
        s.id === id ? { ...s, status: "REVOKED", timeRemaining: 0 } : s
      ));
    } catch (e) {
      console.error("Failed to revoke session", e);
      setSessions(prev => prev.map(s => 
        s.id === id ? { ...s, status: "REVOKED", timeRemaining: 0 } : s
      ));
    }
  };

  const handleGlobalHalt = async () => {
    setIsHalting(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      await fetch(`${backendUrl}/api/halt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: "SOC Override Triggered" })
      });
      setIsHalted(true);
      setSessions(prev => prev.map(s => ({ ...s, status: "REVOKED", timeRemaining: 0 })));
    } catch (e) {
      console.error("Failed to global halt", e);
      setIsHalted(true);
      setSessions(prev => prev.map(s => ({ ...s, status: "REVOKED", timeRemaining: 0 })));
    } finally {
      setIsHalting(false);
    }
  };

  // Hidden Trigger Mechanism for Demo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + Shift + A to trigger intercept
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        const newThreat: Threat = {
          id: `t_${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: "Flash Loan Drain",
          severity: "CRITICAL",
          action: "transferFrom(YieldAggregator, attacker)",
          targetUser: "0x2B99...8F11"
        };
        
        setActiveThreat(newThreat);
        setThreats(prev => [newThreat, ...prev].slice(0, 10)); // keep last 10
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans relative overflow-hidden">
      {/* Animated Network Background */}
      <HexGridCanvas threatLevel={activeThreat ? 1 : 0} />
      
      {/* Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />

      {/* Ambient corner glows */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-aegis-cyan/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-ai-purple/[0.03] rounded-full blur-[100px] pointer-events-none" />
      
      {/* Top Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="border-b border-sol-border/50 backdrop-blur-md bg-dark-slate/30 relative z-10"
      >
        <div className="px-6 pt-5 pb-4 flex items-center justify-between w-full max-w-[1440px] mx-auto">
          <div className="flex items-center gap-5">
            {/* Radar */}
            <div className="hidden md:block relative">
              <RadarSweep size={80} />
              <div className="absolute inset-0 rounded-full border border-aegis-cyan/10" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-orbitron font-bold tracking-tight text-white uppercase flex items-center gap-3">
                <GlitchText text="Aegis SOC Command" className="inline" />
                <span className="hidden md:inline-flex items-center gap-1.5 bg-shield-green/10 text-shield-green text-[10px] font-mono px-2.5 py-1 rounded-full border border-shield-green/20 uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-shield-green animate-pulse" />
                  ONLINE
                </span>
              </h1>
              <div className="flex items-center gap-4 mt-1.5">
                <p className="text-aegis-cyan font-mono text-sm">Real-time Initia Appchain Monitoring</p>
                <span className="hidden md:inline text-muted-text/40 font-mono text-xs">|</span>
                <span className="hidden md:inline text-muted-text font-mono text-xs tabular-nums">{systemTime} UTC</span>
              </div>
            </div>
          </div>
          
          {/* Status Ticker */}
          <div className="hidden lg:block max-w-md">
            <StatusTicker />
          </div>
        </div>
      </motion.header>

      {/* Live Stats Bar */}
      <LiveStatsBar />

      {/* Main 3-Column Layout */}
      <motion.main
        variants={stagger}
        initial="hidden"
        animate="show"
        className="flex-1 w-full max-w-[1440px] mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10"
      >
        {/* Left Col: Sessions */}
        <motion.section variants={fadeUp} className="h-[calc(100vh-220px)]">
          <SessionMonitor sessions={sessions} onRevoke={handleRevoke} />
        </motion.section>

        {/* Center Col: Threat Timeline */}
        <motion.section variants={fadeUp} className="h-[calc(100vh-220px)]">
          <ThreatTimeline threats={threats} />
        </motion.section>

        {/* Right Col: Revenue & Controls */}
        <motion.section variants={fadeUp} className="h-[calc(100vh-220px)] flex flex-col gap-6">
          <div className="flex-1">
            <RevenueTracker data={revenue} />
          </div>
          
          {/* System Control Panel (Bottom Right) */}
          <div className="bg-dark-slate/50 border border-sol-border rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden">
             {/* Scanline effect */}
             <div className="absolute inset-0 pointer-events-none opacity-30 scanlines" />
             
             <div className="text-xs font-mono text-muted-text uppercase tracking-wider mb-2 flex items-center gap-2 relative z-10">
               <span className="w-1 h-1 rounded-full bg-threat-red animate-pulse" />
               SOC Overrides
             </div>
             
             <button 
                onClick={async () => {
                  try {
                    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
                    const res = await fetch(`${backendUrl}/api/scan`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        to_address: "0xMockedHoneypot",
                        data: "withdraw() reentrancy",
                        value: 0,
                        user_address: "0xAttacker"
                      })
                    });
                    const data = await res.json();
                    
                    const newThreat: Threat = {
                      id: `t_${Date.now()}`,
                      timestamp: new Date().toISOString(),
                      type: data.threat_detected ? (data.reason.includes("flash loan") ? "Flash Loan Drain" : "Reentrancy Exploit") : "Reentrancy Exploit",
                      severity: (data.severity as "CRITICAL" | "HIGH" | "MEDIUM" | "LOW") || "CRITICAL",
                      action: "withdraw()",
                      targetUser: "0xMockedHoneypot"
                    };
                    setActiveThreat(newThreat);
                    setThreats(prev => [newThreat, ...prev].slice(0, 10));
                  } catch(e) {
                     console.error("Backend unreachable", e);
                     // Fallback mock if backend is down
                     const newThreat: Threat = {
                        id: `t_${Date.now()}`,
                        timestamp: new Date().toISOString(),
                        type: "Reentrancy Exploit",
                        severity: "CRITICAL",
                        action: "withdraw()",
                        targetUser: "0xMockedHoneypot"
                      };
                      setActiveThreat(newThreat);
                      setThreats(prev => [newThreat, ...prev].slice(0, 10));
                  }
                }}
                className="w-full py-2.5 bg-threat-red/10 hover:bg-threat-red/20 text-threat-red border border-threat-red/30 rounded font-mono text-sm font-bold tracking-wider transition-all relative group overflow-hidden hover:shadow-[0_0_20px_rgba(239,68,68,0.15)] active:scale-[0.98]"
             >
                <div className="absolute inset-0 bg-threat-red/10 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-threat-red animate-pulse" />
                  SIMULATE EXPLOIT
                </span>
             </button>

             <button 
               onClick={handleGlobalHalt}
               disabled={isHalting || isHalted}
               className={`w-full py-2.5 border rounded font-mono text-sm tracking-wider transition-all active:scale-[0.98]
                 ${isHalted ? 'bg-threat-red text-white border-threat-red cursor-not-allowed shadow-[0_0_30px_rgba(239,68,68,0.3)]' : 
                   'bg-background hover:bg-threat-red/10 text-muted-text hover:text-threat-red border-white/10 hover:border-threat-red/30 hover:shadow-[0_0_20px_rgba(239,68,68,0.1)]'
                 }
               `}
             >
                {isHalting ? "HALTING..." : isHalted ? "⛔ SYSTEM HALTED" : "GLOBAL HALT (UNLOCK)"}
             </button>

             <div className="mt-2 text-[10px] text-muted-text/50 font-mono text-center relative z-10">
               Press CMD+SHIFT+A to trigger stealth intercept
             </div>
          </div>
        </motion.section>

      </motion.main>

      {/* Full Screen Red Alert Overlay */}
      <RedAlertOverlay 
        threat={activeThreat} 
        onDismiss={() => setActiveThreat(null)} 
      />
    </div>
  );
}
