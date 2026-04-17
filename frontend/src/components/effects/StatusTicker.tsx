"use client";

import { useEffect, useState, useRef } from "react";

const MESSAGES = [
  { text: "BLOCK #18,429,331 VALIDATED", type: "info" as const },
  { text: "SESSION 0x7A3F...2C89 APPROVED → InitiaDEX", type: "safe" as const },
  { text: "HEURISTIC SCAN PASSED → swap(INIT, USDC)", type: "safe" as const },
  { text: "ANOMALY SCORE 0.02 — WITHIN BOUNDS", type: "info" as const },
  { text: "FLASH LOAN PATTERN MATCH → MONITORING", type: "warn" as const },
  { text: "SESSION 0xB12D...9E44 EXPIRED — AUTO-REVOKED", type: "info" as const },
  { text: "INSURANCE POOL: 2,481 INIT RESERVED", type: "safe" as const },
  { text: "CROSS-CHAIN BRIDGE RELAY VERIFIED ✓", type: "safe" as const },
  { text: "MEMPOOL SCAN: 847 PENDING TX ANALYZED", type: "info" as const },
  { text: "GUARDIAN CONTRACT: v2.1.0 ACTIVE ON INITIA L1", type: "safe" as const },
  { text: "REENTRANCY GUARD: 3 CONTRACTS SHIELDED", type: "safe" as const },
  { text: "PRICE ORACLE DEVIATION: 0.3% — NOMINAL", type: "info" as const },
];

export default function StatusTicker() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const cycle = () => {
      setIsVisible(false);
      timerRef.current = setTimeout(() => {
        setCurrentIdx(prev => (prev + 1) % MESSAGES.length);
        setIsVisible(true);
      }, 400);
    };

    const interval = setInterval(cycle, 3000);
    return () => {
      clearInterval(interval);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const msg = MESSAGES[currentIdx];
  const colorClass = msg.type === "safe" 
    ? "text-shield-green" 
    : msg.type === "warn" 
      ? "text-warning-amber" 
      : "text-aegis-cyan";

  const dotColor = msg.type === "safe"
    ? "bg-shield-green"
    : msg.type === "warn"
      ? "bg-warning-amber"
      : "bg-aegis-cyan";

  return (
    <div className="flex items-center gap-2 font-mono text-[11px] tracking-wide h-5 overflow-hidden">
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor} animate-pulse shrink-0`} />
      <span
        className={`${colorClass} transition-all duration-300 ${
          isVisible 
            ? "opacity-100 translate-y-0" 
            : "opacity-0 -translate-y-2"
        }`}
      >
        {msg.text}
      </span>
    </div>
  );
}
