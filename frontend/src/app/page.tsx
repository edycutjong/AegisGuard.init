"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import SessionMonitor from "@/components/soc/SessionMonitor";
import ThreatTimeline from "@/components/soc/ThreatTimeline";
import RevenueTracker from "@/components/soc/RevenueTracker";
import RedAlertOverlay from "@/components/soc/RedAlertOverlay";
import { Session, Threat, RevenueData } from "@/lib/soc-types";

// Mock data generators
const MOCK_SESSIONS: Session[] = [
  { id: "s1", dappName: "InitiaSwap", address: "0x7F5C...3A91", timeRemaining: 3450, txCount: 12, status: "SAFE", startTime: Date.now() },
  { id: "s2", dappName: "YieldAggregator", address: "0x2B99...8F11", timeRemaining: 120, txCount: 84, status: "SUSPICIOUS", startTime: Date.now() },
  { id: "s3", dappName: "Unknown Contract", address: "0x991A...1C20", timeRemaining: 0, txCount: 5, status: "REVOKED", startTime: Date.now() },
];

const INITIAL_THREATS: Threat[] = [
  { id: "t1", timestamp: new Date(Date.now() - 120000).toISOString(), type: "Flash Loan Attack", severity: "CRITICAL", action: "borrow(1000000 USDC)", targetUser: "0x2B99...8F11" },
  { id: "t2", timestamp: new Date(Date.now() - 360000).toISOString(), type: "Oracle Manipulation", severity: "HIGH", action: "updatePrice(INIT/USDC)", targetUser: "0xProtocol" },
  { id: "t3", timestamp: new Date(Date.now() - 860000).toISOString(), type: "Suspicious Approval", severity: "MEDIUM", action: "approve(MAX_UINT)", targetUser: "0x7F5C...3A91" },
];

const MOCK_REVENUE: RevenueData[] = [
  { time: "10:00", fees: 2.4 },
  { time: "10:05", fees: 3.1 },
  { time: "10:10", fees: 8.5 },
  { time: "10:15", fees: 14.2 },
  { time: "10:20", fees: 15.8 },
  { time: "10:25", fees: 22.4 },
];

export default function SOCDashboard() {
  const [sessions] = useState<Session[]>(MOCK_SESSIONS);
  const [threats, setThreats] = useState<Threat[]>(INITIAL_THREATS);
  const [revenue] = useState<RevenueData[]>(MOCK_REVENUE);
  
  const [activeThreat, setActiveThreat] = useState<Threat | null>(null);

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
      {/* Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
      
      {/* Top Header */}
      <Header />

      {/* Main 3-Column Layout */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        
        {/* Left Col: Sessions */}
        <section className="h-[calc(100vh-120px)]">
          <SessionMonitor sessions={sessions} />
        </section>

        {/* Center Col: Threat Timeline */}
        <section className="h-[calc(100vh-120px)]">
          <ThreatTimeline threats={threats} />
        </section>

        {/* Right Col: Revenue & Controls */}
        <section className="h-[calc(100vh-120px)] flex flex-col gap-6">
          <div className="flex-1">
            <RevenueTracker data={revenue} />
          </div>
          
          {/* System Control Panel (Bottom Right) */}
          <div className="bg-dark-slate/50 border border-sol-border rounded-xl p-4 flex flex-col gap-3">
             <div className="text-xs font-mono text-muted-text uppercase tracking-wider mb-2">SOC Overrides</div>
             
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
                      severity: data.severity as any || "CRITICAL",
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
                className="w-full py-2 bg-threat-red/10 hover:bg-threat-red/20 text-threat-red border border-threat-red/30 rounded font-mono text-sm font-bold tracking-wider transition-colors relative group overflow-hidden"
             >
                <div className="absolute inset-0 bg-threat-red/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                SIMULATE EXPLOIT
             </button>

             <button className="w-full py-2 bg-background hover:bg-background/80 text-muted-text border border-white/10 rounded font-mono text-sm tracking-wider transition-colors cursor-not-allowed opacity-50">
                GLOBAL HALT (LOCKED)
             </button>

             <div className="mt-2 text-[10px] text-muted-text/50 font-mono text-center">
               Press CMD+SHIFT+A to trigger stealth intercept
             </div>
          </div>
        </section>

      </main>

      {/* Full Screen Red Alert Overlay */}
      <RedAlertOverlay 
        threat={activeThreat} 
        onDismiss={() => setActiveThreat(null)} 
      />
    </div>
  );
}
