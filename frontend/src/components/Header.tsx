"use client";

import Link from "next/link";
import { ConnectButton, useAddress } from "@initia/interwovenkit-react";
import { Shield } from "lucide-react";
import { useEffect, useState } from "react";

export default function Header() {
  const address = useAddress();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 transition-all duration-500 bg-background/80 backdrop-blur-xl border-b border-sol-border shadow-md">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6">
        {/* Left: Logo & Status */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-dark-slate to-background border border-sol-border overflow-hidden">
              {/* Subtle pulsing background glow */}
              <div className="absolute inset-0 bg-aegis-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md" />
              <Shield className="w-5 h-5 text-aegis-cyan relative z-10 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight leading-none font-mono text-foreground">
                AEGISGUARD<span className="text-aegis-cyan">.init</span>
              </span>
              <span className="text-[10px] font-medium text-muted-text tracking-widest uppercase leading-none mt-1">
                SOC Dashboard
              </span>
            </div>
          </Link>

          {/* System Status Badge */}
          <div className="hidden sm:flex items-center gap-2 rounded-full bg-shield-green/10 border border-shield-green/20 px-3 py-1.5 ml-4">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-shield-green opacity-75" />
              <span className="relative inline-block h-2 w-2 rounded-full bg-shield-green" />
            </span>
            <span className="text-[10px] font-mono font-bold text-shield-green tracking-widest uppercase">
              System Operational
            </span>
          </div>
        </div>

        {/* Center: Monitored Name Display */}
        <div className="hidden md:flex flex-col items-center justify-center">
          <span className="text-xs font-mono text-muted-text uppercase tracking-wider mb-1">
            Intercept Target
          </span>
          {mounted && address ? (
            <div className="text-sm font-mono font-bold text-aegis-cyan bg-aegis-cyan/10 px-4 py-1 rounded-full border border-aegis-cyan/20">
              {address.slice(0, 6)}...{address.slice(-4)}
            </div>
          ) : (
            <div className="text-sm font-mono font-bold text-warning-amber bg-warning-amber/10 px-4 py-1 rounded-full border border-warning-amber/20">
              AWAITING CONNECTION
            </div>
          )}
        </div>

        {/* Right: Wallet Connect */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex text-xs font-mono text-muted-text text-right flex-col mr-2">
            <span>Sessions Monitored</span>
            <span className="text-foreground font-bold font-sans text-sm">3 Active</span>
          </div>
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}
