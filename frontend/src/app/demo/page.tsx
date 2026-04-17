"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAddress } from "@initia/interwovenkit-react";
import { TrendingUp, AlertCircle, Shield, Zap, Lock } from "lucide-react";
import RedAlertOverlay from "@/components/soc/RedAlertOverlay";
import { Threat } from "@/lib/soc-types";

const floatingTokens = [
  { symbol: "INIT", x: "10%", y: "20%", delay: 0, size: 40 },
  { symbol: "USDC", x: "85%", y: "15%", delay: 1.5, size: 32 },
  { symbol: "ETH", x: "75%", y: "70%", delay: 3, size: 36 },
  { symbol: "ATOM", x: "15%", y: "75%", delay: 2, size: 28 },
];

export default function MockYieldFarm() {
  const address = useAddress();
  const [staking, setStaking] = useState(false);
  const [staked, setStaked] = useState(false);
  const [attackTriggered, setAttackTriggered] = useState(false);
  const [activeThreat, setActiveThreat] = useState<Threat | null>(null);
  const [amount, setAmount] = useState("1000");
  const [apy, setApy] = useState(14284);

  // Fluctuating APY for realism
  useEffect(() => {
    const interval = setInterval(() => {
      setApy(prev => prev + Math.floor((Math.random() - 0.48) * 50));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleStake = () => {
    setStaking(true);
    setTimeout(() => {
      setStaking(false);
      setStaked(true);
    }, 2000);
  };

  const triggerAttack = async () => {
    setAttackTriggered(true);
    
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      const res = await fetch(`${backendUrl}/api/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to_address: "0xYieldAggregator",
          data: "transferFrom(YieldAggregator, attacker) flashloan",
          value: 0,
          user_address: address || "0xUNKNOWN"
        })
      });
      
      const data = await res.json();
      console.log("[AegisGuard] Heuristics engine response:", data);
      
      setActiveThreat({
        id: "demo-threat-1",
        timestamp: new Date().toISOString(),
        type: "Malicious Contract Upgrade",
        severity: "CRITICAL",
        action: "Simulated extraction of yield vault 0xYieldAggregator",
        targetUser: address || "0xUNKNOWN"
      });
      
    } catch (e) {
      console.error("AegisGuard Demo Error", e);
      setActiveThreat({
        id: "demo-threat-fallback",
        timestamp: new Date().toISOString(),
        type: "Malicious Contract Upgrade",
        severity: "CRITICAL",
        action: "Simulated extraction of yield vault 0xYieldAggregator",
        targetUser: address || "0xUNKNOWN"
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-hidden">
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-600/[0.07] blur-[120px] animate-drift-slow" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-pink-600/[0.06] blur-[100px] animate-drift-slow-reverse" />
        <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] rounded-full bg-cyan-500/[0.04] blur-[80px] animate-drift-slow" />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(168,85,247,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.3) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Floating token badges */}
      {floatingTokens.map((token, i) => (
        <motion.div
          key={token.symbol}
          className="absolute pointer-events-none hidden md:flex items-center justify-center rounded-full border border-white/5 bg-slate-900/40 backdrop-blur-sm font-mono text-[10px] text-slate-500 font-bold"
          style={{ left: token.x, top: token.y, width: token.size, height: token.size }}
          animate={{
            y: [0, -15, 0],
            rotate: [0, 5, -5, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 6 + i,
            repeat: Infinity,
            delay: token.delay,
            ease: "easeInOut",
          }}
        >
          {token.symbol.slice(0, 2)}
        </motion.div>
      ))}

      {/* "Under attack" background effect */}
      <AnimatePresence>
        {attackTriggered && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none z-0"
          >
            <div className="absolute inset-0 bg-red-900/20 animate-pulse" />
            {/* Red scan lines */}
            <div className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(239,68,68,0.3) 2px, rgba(239,68,68,0.3) 4px)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center justify-between max-w-4xl mx-auto px-6 pt-8 pb-4 relative z-10"
      >
        <div className="flex items-center gap-3">
          <motion.div 
            className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/25 relative"
            whileHover={{ scale: 1.1, rotate: 6 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <TrendingUp className="w-5 h-5 text-white" />
            {/* Glow ring */}
            <div className="absolute inset-[-3px] rounded-2xl bg-gradient-to-tr from-purple-500/30 to-pink-500/30 blur-md -z-10" />
          </motion.div>
          <div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              InitiaYield
            </span>
            <div className="text-[10px] font-mono text-slate-500 tracking-widest uppercase">Mock Exploit Target</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* AegisGuard badge */}
          <motion.div 
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-[10px] font-mono font-bold uppercase tracking-widest"
            animate={{ boxShadow: ["0 0 0 0 rgba(6,182,212,0)", "0 0 15px 2px rgba(6,182,212,0.15)", "0 0 0 0 rgba(6,182,212,0)"] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Shield className="w-3 h-3" />
            AegisGuard Active
          </motion.div>
          <div className="px-4 py-2 bg-slate-800/80 backdrop-blur-sm rounded-full text-sm font-medium border border-slate-700">
            {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "0x82A..3F1"}
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-xl mx-auto px-6 relative z-10">
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Stake $INIT. <br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 animate-gradient-shift">
              Earn {apy.toLocaleString()}% APY.
            </span>
          </h1>
          <p className="text-slate-400 max-w-md mx-auto">
            The next generation of high-frequency liquidity provisioning on Initia. Completely definitely safe.
          </p>
        </motion.div>

        <motion.div 
          className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-800/80 p-6 md:p-8 shadow-2xl relative overflow-hidden"
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.35, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Shine sweep */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
            <div className="absolute top-0 left-[-100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/[0.02] to-transparent animate-shine-slow" />
          </div>

          {/* APY Display */}
          <div className="flex items-center justify-between bg-slate-800/50 p-4 rounded-2xl mb-6 relative overflow-hidden">
            <div>
              <div className="text-sm text-slate-400 font-medium mb-1 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-green-400" />
                Current APY
              </div>
              <motion.div 
                className="text-3xl font-bold text-green-400 tabular-nums"
                key={apy}
                initial={{ scale: 1.05 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {apy.toLocaleString()}%
              </motion.div>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-400 font-medium mb-1 flex items-center gap-1.5 justify-end">
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                TVL
              </div>
              <div className="text-xl font-bold text-slate-200">$45.2M</div>
            </div>
            {/* Sparkle dot */}
            <motion.div
              className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-green-400"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>

          {/* Staking Form */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-slate-400 mb-2 font-medium">
                <span>Amount to Stake</span>
                <span>Balance: {address ? "1,000 INIT" : "1,000 INIT"}</span>
              </div>
              <div className="relative group">
                <input 
                  type="text" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 pl-4 pr-16 text-xl font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                />
                <button 
                  onClick={() => setAmount("1000")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 font-bold text-sm bg-purple-500/10 px-3 py-1.5 rounded-lg hover:bg-purple-500/20 transition-colors active:scale-95"
                >
                  MAX
                </button>
              </div>
            </div>

            <motion.button 
              onClick={handleStake}
              disabled={(false) || staking || staked}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4 relative overflow-hidden group"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Button shine */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              {staking ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Staking...
                </>
              ) : staked ? (
                <>
                  <Shield className="w-5 h-5" />
                  ✓ Staked 1,000 INIT
                </>
              ) : (
                "Approve & Stake INIT"
              )}
            </motion.button>
          </div>

          {/* Post-stake success message */}
          <AnimatePresence>
            {staked && !attackTriggered && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-center"
              >
                <div className="text-green-400 text-sm font-medium flex items-center justify-center gap-2">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 0.6 }}
                  >
                    ✓
                  </motion.div>
                  Successfully staked! Your funds are now earning yield...
                </div>
                <div className="text-slate-500 text-xs font-mono mt-1">Protected by AegisGuard.init</div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hidden Malicious Trigger for Demo purposes */}
          <motion.div 
            className="mt-8 pt-6 border-t border-slate-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
             <motion.button 
               onClick={triggerAttack}
               disabled={attackTriggered}
               className="w-full py-3.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl font-mono text-sm font-bold tracking-wider transition-all flex items-center justify-center gap-2 relative overflow-hidden group disabled:opacity-50"
               whileHover={{ scale: 1.01 }}
               whileTap={{ scale: 0.98 }}
             >
               {/* Danger shimmer */}
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
               <AlertCircle className="w-4 h-4" />
               {attackTriggered ? "⚠ EXPLOIT IN PROGRESS..." : "Simulate Malicious Contract Upgrade"}
             </motion.button>
             <AnimatePresence>
               {attackTriggered && (
                 <motion.div 
                   initial={{ opacity: 0, y: -5 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="mt-3 space-y-1"
                 >
                   <div className="text-red-400 text-xs text-center font-mono animate-pulse">
                     ⚠ Exploit initiated! Payload targeting vault funds...
                   </div>
                   <div className="text-cyan-400 text-xs text-center font-mono">
                     🛡 AegisGuard intercepting — analyzing heuristics...
                   </div>
                 </motion.div>
               )}
             </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Trust badge */}
        <motion.div 
          className="flex items-center justify-center gap-2 mt-6 mb-20 text-slate-600 text-xs font-mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Shield className="w-3.5 h-3.5" />
          Protected by AegisGuard.init — Initia Appchain Security Layer
        </motion.div>
      </main>

      <RedAlertOverlay 
        threat={activeThreat} 
        onDismiss={() => {
          setActiveThreat(null);
          setAttackTriggered(false);
        }} 
      />
    </div>
  );
}
