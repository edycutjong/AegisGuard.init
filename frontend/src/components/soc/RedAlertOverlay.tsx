"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Zap, X, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Threat } from "@/lib/soc-types";

// Intercept phases: 0=Detecting, 1=Analyzing, 2=Intercepting, 3=Secured
export default function RedAlertOverlay({
  threat,
  onDismiss,
}: {
  threat: Threat | null;
  onDismiss: () => void;
}) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!threat) {
      setPhase(0);
      return;
    }
    
    // Simulate the interception lifecycle
    const t1 = setTimeout(() => setPhase(1), 800);
    const t2 = setTimeout(() => setPhase(2), 2000);
    const t3 = setTimeout(() => setPhase(3), 3500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [threat]);

  return (
    <AnimatePresence>
      {threat && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
        >
          {/* Backdrop with red pulse if not secured, green if secured */}
          <div 
            className={`absolute inset-0 bg-background/95 backdrop-blur-md transition-colors duration-1000 ${
              phase === 3 ? "bg-background/90" : "bg-threat-red/10"
            }`} 
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -20 }}
            className={`relative w-full max-w-2xl border ${
              phase === 3 ? "border-shield-green shadow-[0_0_50px_rgba(34,197,94,0.3)]" : "border-threat-red shadow-[0_0_50px_rgba(239,68,68,0.3)]"
            } bg-dark-slate/90 overflow-hidden ${phase < 3 ? "animate-pulse-slow" : ""}`}
          >
            {/* Header */}
            <div className={`p-4 border-b flex justify-between items-center ${
              phase === 3 ? "border-shield-green/30 bg-shield-green/10" : "border-threat-red/30 bg-threat-red/10"
            }`}>
              <div className="flex items-center gap-3">
                {phase === 3 ? (
                  <ShieldCheck className="w-6 h-6 text-shield-green" />
                ) : (
                  <ShieldAlert className="w-6 h-6 text-threat-red animate-bounce" />
                )}
                <h2 className={`font-mono text-xl font-bold uppercase tracking-wider ${
                  phase === 3 ? "text-shield-green" : "text-threat-red"
                }`}>
                  {phase === 0 ? "THREAT DETECTED" : phase === 1 ? "ANALYZING PAYLOAD" : phase === 2 ? "INTERCEPTING TX" : "ASSETS SECURED"}
                </h2>
              </div>
              {phase === 3 && (
                <button
                  onClick={onDismiss}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-muted-text" />
                </button>
              )}
            </div>

            {/* Body */}
            <div className="p-6 font-mono space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-text mb-1 uppercase text-xs">Target Session</div>
                  <div className="text-foreground">{threat.targetUser}</div>
                </div>
                <div>
                  <div className="text-muted-text mb-1 uppercase text-xs">Attack Vector</div>
                  <div className="text-warning-amber">{threat.type}</div>
                </div>
                <div>
                  <div className="text-muted-text mb-1 uppercase text-xs">Payload</div>
                  <div className="text-foreground truncate">{threat.action}</div>
                </div>
                <div>
                  <div className="text-muted-text mb-1 uppercase text-xs">Timestamp</div>
                  <div className="text-foreground">{new Date(threat.timestamp).toLocaleTimeString()}</div>
                </div>
              </div>

              {/* Progress Tracker */}
              <div className="space-y-3">
                {[
                  { label: "Signatures Verified", active: phase >= 0 },
                  { label: "Heuristics Matching", active: phase >= 1 },
                  { label: "Counter-TX Broadcast", active: phase >= 2 },
                  { label: "Insurance Fee Captured", active: phase >= 3 },
                ].map((step, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      step.active 
                        ? (phase === 3 ? "bg-shield-green border-shield-green" : "bg-warning-amber border-warning-amber")
                        : "border-muted-text bg-transparent"
                    }`}>
                      {step.active && <Zap className="w-2.5 h-2.5 text-black" />}
                    </div>
                    <span className={`text-sm ${step.active ? "text-foreground" : "text-muted-text"}`}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
              
              {/* Status Footer */}
              <div className={`p-4 border rounded relative overflow-hidden ${
                phase === 3 ? "border-shield-green/30 bg-shield-green/5" : "border-aegis-cyan/30 bg-aegis-cyan/5"
              }`}>
                {phase < 3 && (
                  <motion.div 
                    className="absolute inset-0 bg-aegis-cyan/10"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  />
                )}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-xs text-muted-text uppercase">System Action</span>
                  <span className={`font-bold ${
                    phase === 3 ? "text-shield-green" : "text-aegis-cyan"
                  }`}>
                    {phase === 0 && "Halt Requested..."}
                    {phase === 1 && "Simulating Revert..."}
                    {phase === 2 && "Front-running with AegisGuardian..."}
                    {phase === 3 && "Success: 0.1 INIT Fee Captured"}
                  </span>
                </div>
              </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
