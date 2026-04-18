"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface StatConfig {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  color: string;
  icon: string;
}

function AnimatedCounter({ target, duration, prefix = "", suffix = "", color }: {
  target: number;
  duration: number;
  prefix?: string;
  suffix?: string;
  color: string;
}) {
  const [count, setCount] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      }
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [target, duration]);

  return (
    <span className="font-mono font-bold tabular-nums" style={{ color }}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

const STATS: StatConfig[] = [
  { label: "TX Scanned", value: 284719, color: "#06b6d4", icon: "⬡" },
  { label: "Threats Blocked", value: 1437, color: "#ef4444", icon: "⛨" },
  { label: "Assets Secured", value: 45200000, prefix: "$", color: "#22c55e", icon: "◈" },
  { label: "Avg Latency", value: 47, suffix: "ms", color: "#a855f7", icon: "◎" },
];

export default function LiveStatsBar() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    if (entries[0].isIntersecting) setIsVisible(true);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, { threshold: 0.3 });
    const el = ref.current;
    /* istanbul ignore next */
    if (el) observer.observe(el);
    return () => {
      // istanbul ignore else
      if (el) observer.unobserve(el);
    };
  }, [handleIntersection]);

  const [dataStream] = useState(() => Array.from({ length: 40 }, () => `0x${Math.random().toString(16).slice(2, 10)} `).join("│ "));

  return (
    <div
      ref={ref}
      className="w-full border-y border-sol-border/50 bg-dark-slate/30 backdrop-blur-sm relative overflow-hidden"
    >
      {/* Scrolling data stream underneath */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden">
        <div className="animate-marquee whitespace-nowrap font-mono text-[10px] text-aegis-cyan leading-none py-1">
          {dataStream}
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 py-3 grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            className="flex items-center gap-3 group"
            style={{ animationDelay: `${i * 150}ms` }}
          >
            {/* Glowing icon */}
            <div
              className="text-lg select-none opacity-60 group-hover:opacity-100 transition-opacity duration-300"
              style={{ 
                textShadow: `0 0 10px ${stat.color}40`,
                filter: `drop-shadow(0 0 4px ${stat.color}30)`
              }}
            >
              {stat.icon}
            </div>
            <div className="flex flex-col">
              <div className="text-[10px] font-mono text-muted-text uppercase tracking-widest">{stat.label}</div>
              <div className="text-sm">
                {isVisible ? (
                  <AnimatedCounter
                    target={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    color={stat.color}
                    duration={2500 + i * 300}
                  />
                ) : (
                  <span className="font-mono text-muted-text">—</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
