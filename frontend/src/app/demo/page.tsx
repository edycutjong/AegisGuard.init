"use client";

import { useState } from "react";
import { ConnectButton, useAddress } from "@initia/interwovenkit-react";
import { ArrowLeftRight, TrendingUp, AlertCircle } from "lucide-react";

export default function MockYieldFarm() {
  const address = useAddress();
  const [staking, setStaking] = useState(false);
  const [attackTriggered, setAttackTriggered] = useState(false);

  const handleStake = () => {
    setStaking(true);
    setTimeout(() => {
      setStaking(false);
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
      
      // The RedAlertOverlay on the main dashboard would ideally listen via websockets
      // or global state in a real app. For the demo, we log the JSON payload
      // that Supabase RT would propagate to the SOC dashboard.
      
    } catch (e) {
      console.error("AegisGuard Demo Error", e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-12 relative overflow-hidden">
      {/* "Under attack" background effect */}
      {attackTriggered && (
        <div className="absolute inset-0 bg-red-900/20 animate-pulse pointer-events-none z-0" />
      )}

      {/* Header */}
      <header className="flex items-center justify-between max-w-4xl mx-auto mb-16 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            InitiaYield
          </span>
        </div>
        <ConnectButton />
      </header>

      {/* Main Content */}
      <main className="max-w-xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Stake $INIT. <br/><span className="text-purple-400">Earn 14,000% APY.</span>
          </h1>
          <p className="text-slate-400">
            The next generation of high-frequency liquidity provisioning on Initia. Completely definitely safe.
          </p>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-800 p-6 md:p-8 shadow-2xl">
          {/* APY Display */}
          <div className="flex items-center justify-between bg-slate-800/50 p-4 rounded-2xl mb-6">
            <div>
              <div className="text-sm text-slate-400 font-medium mb-1">Current APY</div>
              <div className="text-3xl font-bold text-green-400">14,284%</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-400 font-medium mb-1">TVL</div>
              <div className="text-xl font-bold text-slate-200">$45.2M</div>
            </div>
          </div>

          {/* Staking Form */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-slate-400 mb-2 font-medium">
                <span>Amount to Stake</span>
                <span>Balance: {address ? "1,000 INIT" : "0 INIT"}</span>
              </div>
              <div className="relative">
                <input 
                  type="text" 
                  defaultValue="1000"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 pl-4 pr-16 text-xl font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-shadow"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 font-bold text-sm bg-purple-500/10 px-3 py-1.5 rounded-lg hover:bg-purple-500/20 transition-colors">
                  MAX
                </button>
              </div>
            </div>

            <button 
              onClick={handleStake}
              disabled={!address || staking}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
            >
              {staking ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Staking...
                </>
              ) : (
                "Approve & Stake INIT"
              )}
            </button>
          </div>

          {/* Hidden Malicious Trigger for Demo purposes */}
          <div className="mt-8 pt-6 border-t border-slate-800">
             <button 
               onClick={triggerAttack}
               className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl font-mono text-sm font-bold tracking-wider transition-colors flex items-center justify-center gap-2"
             >
               <AlertCircle className="w-4 h-4" />
               Simulate Malicious Contract Upgrade
             </button>
             {attackTriggered && (
               <div className="mt-3 text-red-400 text-xs text-center font-mono animate-pulse">
                 Exploit initiated! Payload targeting vault funds...
               </div>
             )}
          </div>
        </div>
      </main>
    </div>
  );
}
