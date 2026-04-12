"use client";

import { ShieldAlert, Crosshair, Cpu, AlertTriangle } from "lucide-react";
import { Threat, Severity } from "@/lib/soc-types";
import { motion, AnimatePresence } from "framer-motion";

function SeverityBadge({ severity }: { severity: Severity }) {
  const styles = {
    CRITICAL: "bg-threat-red/20 text-threat-red border-threat-red/50",
    HIGH: "bg-warning-amber/20 text-warning-amber border-warning-amber/50",
    MEDIUM: "bg-aegis-cyan/20 text-aegis-cyan border-aegis-cyan/50",
    LOW: "bg-muted-text/20 text-muted-text border-muted-text/50",
  };

  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border uppercase tracking-wider ${styles[severity]}`}>
      {severity}
    </span>
  );
}

function ThreatIcon({ type, severity }: { type: string; severity: Severity }) {
  const colorClass = severity === "CRITICAL" ? "text-threat-red" : severity === "HIGH" ? "text-warning-amber" : "text-aegis-cyan";
  
  if (type.includes("Flash Loan") || type.includes("Drain")) {
    return <ShieldAlert className={`w-4 h-4 ${colorClass}`} />;
  }
  if (type.includes("Oracle") || type.includes("Price")) {
    return <Crosshair className={`w-4 h-4 ${colorClass}`} />;
  }
  if (type.includes("Reentrancy")) {
    return <Cpu className={`w-4 h-4 ${colorClass}`} />;
  }
  return <AlertTriangle className={`w-4 h-4 ${colorClass}`} />;
}

export default function ThreatTimeline({ threats }: { threats: Threat[] }) {
  return (
    <div className="flex flex-col h-full bg-dark-slate/50 border border-sol-border rounded-xl overflow-hidden">
      <div className="p-4 border-b border-sol-border bg-dark-slate/80 flex items-center gap-2">
        <ShieldAlert className="w-5 h-5 text-threat-red" />
        <h3 className="font-mono font-bold text-foreground tracking-wide uppercase">Threat Intel Timeline</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <div className="relative pl-3 space-y-6">
          {/* Timeline connecting line */}
          <div className="absolute top-2 bottom-2 left-4 w-px bg-sol-border/50" />

          <AnimatePresence initial={false}>
            {threats.map((threat, index) => (
              <motion.div
                key={threat.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(index * 0.1, 0.5) }}
                className="relative pl-6"
              >
                {/* Timeline node */}
                <div className={`absolute left-[-21px] top-1 w-6 h-6 rounded-full border-2 bg-dark-slate flex items-center justify-center z-10 ${
                  threat.severity === "CRITICAL" ? "border-threat-red" : 
                  threat.severity === "HIGH" ? "border-warning-amber" : "border-aegis-cyan"
                }`}>
                  <ThreatIcon type={threat.type} severity={threat.severity} />
                </div>

                <div className="bg-background/40 border border-white/5 p-3 rounded-lg hover:bg-background/60 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <SeverityBadge severity={threat.severity} />
                    <span className="text-[10px] font-mono text-muted-text">
                      {new Date(threat.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' })}
                    </span>
                  </div>
                  
                  <h4 className="text-sm font-bold text-foreground mb-1 font-mono tracking-tight">{threat.type}</h4>
                  
                  <div className="text-xs text-muted-text font-mono truncate mb-2 pb-2 border-b border-white/5">
                    {threat.action}
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono uppercase text-muted-text">
                    <span>Target: {threat.targetUser.slice(0,6)}...</span>
                    {threat.severity === "CRITICAL" && (
                      <span className="text-shield-green font-bold">Intercepted & Secured</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {threats.length === 0 && (
            <div className="text-center text-muted-text font-mono text-sm py-10 relative z-10">
              No recent threats detected.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
