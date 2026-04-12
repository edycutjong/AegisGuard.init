"use client";

import { Activity, ShieldOff, CheckCircle2, Clock } from "lucide-react";
import { Session } from "@/lib/soc-types";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function SessionMonitor({ sessions }: { sessions: Session[] }) {
  return (
    <div className="flex flex-col h-full bg-dark-slate/50 border border-sol-border rounded-xl overflow-hidden">
      <div className="p-4 border-b border-sol-border bg-dark-slate/80 flex items-center gap-2">
        <Activity className="w-5 h-5 text-aegis-cyan" />
        <h3 className="font-mono font-bold text-foreground tracking-wide uppercase">Active Sessions</h3>
        <div className="ml-auto bg-aegis-cyan/10 text-aegis-cyan text-xs font-mono px-2 py-0.5 rounded border border-aegis-cyan/20">
          {sessions.length} LIVE
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {sessions.map((session) => (
          <div 
            key={session.id}
            className={`p-4 rounded-lg border transition-colors ${
              session.status === "SAFE" ? "border-shield-green/30 bg-shield-green/5" :
              session.status === "SUSPICIOUS" ? "border-warning-amber/50 bg-warning-amber/10 shadow-[0_0_15px_rgba(245,158,11,0.1)]" :
              "border-threat-red/30 bg-threat-red/5 opacity-50"
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="font-bold text-foreground text-sm tracking-wide">{session.dappName}</div>
                <div className="text-xs text-muted-text font-mono mt-0.5">{session.address.slice(0,6)}...{session.address.slice(-4)}</div>
              </div>
              
              {/* Status Badge */}
              <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-mono font-bold uppercase ${
                session.status === "SAFE" ? "bg-shield-green/10 text-shield-green border border-shield-green/20" :
                session.status === "SUSPICIOUS" ? "bg-warning-amber/20 text-warning-amber border border-warning-amber/30 animate-pulse" :
                "bg-threat-red/10 text-threat-red border border-threat-red/20"
              }`}>
                {session.status === "SAFE" && <CheckCircle2 className="w-3 h-3" />}
                {session.status === "SUSPICIOUS" && <Activity className="w-3 h-3" />}
                {session.status === "REVOKED" && <ShieldOff className="w-3 h-3" />}
                {session.status}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="flex items-center gap-1.5 text-muted-text">
                <Clock className="w-3.5 h-3.5" />
                <span>TTL: <span className="text-foreground">{formatTime(session.timeRemaining)}</span></span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-text justify-end">
                <Activity className="w-3.5 h-3.5" />
                <span>TXs: <span className="text-foreground">{session.txCount}</span></span>
              </div>
            </div>
            
            {/* Action Bar */}
            <div className="mt-3 pt-3 border-t border-white/5 flex gap-2">
               <button 
                 disabled={session.status === "REVOKED"}
                 className="flex-1 py-1.5 bg-threat-red/10 hover:bg-threat-red/20 text-threat-red border border-threat-red/20 rounded text-[10px] font-mono font-bold uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 Revoke Auth
               </button>
            </div>
          </div>
        ))}

        {sessions.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-muted-text font-mono text-sm py-10">
            <ShieldOff className="w-8 h-8 mb-2 opacity-50" />
            <div>No Active Sessions</div>
          </div>
        )}
      </div>
    </div>
  );
}
