import Link from "next/link";
import { ShieldOff, TerminalSquare } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans relative overflow-hidden items-center justify-center">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />

      {/* Main Container */}
      <main className="relative z-10 flex flex-col items-center">
        {/* Warning Icon Badge */}
        <div className="bg-threat-red/10 border border-threat-red/30 p-4 rounded-full mb-6">
          <ShieldOff className="w-12 h-12 text-threat-red" />
        </div>

        <div className="text-[100px] md:text-[140px] font-orbitron font-bold leading-none tracking-tighter text-threat-red/80 mb-2 select-none">
          404
        </div>
        
        <h2 className="text-2xl md:text-3xl font-orbitron font-bold mb-4 uppercase text-white tracking-wide">
          System Fault: Module Offline
        </h2>
        
        <div className="bg-dark-slate/50 border border-sol-border rounded-lg p-4 font-mono text-xs md:text-sm text-aegis-cyan/70 mb-8 max-w-md w-full">
          <div className="flex items-center gap-2 mb-2 text-threat-red">
            <TerminalSquare className="w-4 h-4" />
            <span>CRITICAL ERROR</span>
          </div>
          <p className="mb-1">{">"} ROUTING PROTOCOL FAILED</p>
          <p className="mb-1">{">"} TARGET SUBSYSTEM NOT FOUND</p>
          <p className="animate-pulse">{">"} AWAITING RECOVERY INSTRUCTIONS_</p>
        </div>

        <Link
          href="/"
          className="group relative inline-flex items-center justify-center px-8 py-3 font-mono font-bold uppercase tracking-wider text-sm transition-all"
        >
          {/* Subtle Outer Border */}
          <div className="absolute inset-0 border border-aegis-cyan/30 rounded" />
          
          {/* Animated Background */}
          <div className="absolute inset-0 bg-aegis-cyan/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out rounded" />
          
          <span className="relative z-10 flex items-center gap-2 text-aegis-cyan">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Return to SOC Command
          </span>
        </Link>
      </main>
    </div>
  );
}
