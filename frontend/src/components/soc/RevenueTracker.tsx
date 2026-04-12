"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { DollarSign, ArrowUpRight } from "lucide-react";
import { RevenueData } from "@/lib/soc-types";

// Needs exact structure for Recharts tooltip custom render outside of render tree, as per AGENTS.md rule:
// `CustomTooltip` components must be declared **outside** the render function
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-dark-slate/90 border border-sol-border p-3 rounded-lg shadow-xl backdrop-blur-sm">
        <p className="text-muted-text font-mono text-[10px] mb-1">{label}</p>
        <p className="text-shield-green font-mono font-bold text-sm">
          +{payload[0].value.toFixed(2)} INIT
        </p>
      </div>
    );
  }
  return null;
};

export default function RevenueTracker({ data }: { data: RevenueData[] }) {
  const totalRevenue = data.reduce((acc, curr) => acc + curr.fees, 0);
  
  return (
    <div className="flex flex-col h-full bg-dark-slate/50 border border-sol-border rounded-xl overflow-hidden">
      <div className="p-4 border-b border-sol-border bg-dark-slate/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-shield-green" />
          <h3 className="font-mono font-bold text-foreground tracking-wide uppercase">Insurance Rev.</h3>
        </div>
        <div className="flex items-center gap-1.5 bg-shield-green/10 text-shield-green px-2.5 py-1 rounded-full border border-shield-green/20">
          <ArrowUpRight className="w-3.5 h-3.5" />
          <span className="text-xs font-mono font-bold">{totalRevenue.toFixed(1)} INIT Total</span>
        </div>
      </div>

      <div className="flex-1 p-4 flex flex-col">
        {/* KPI Row */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-background/40 border border-white/5 p-3 rounded-lg">
            <div className="text-[10px] text-muted-text font-mono uppercase mb-1">Today's Intercepts</div>
            <div className="text-xl font-mono font-bold text-foreground">143</div>
            <div className="text-[10px] text-shield-green font-mono mt-1">+12% vs ytd</div>
          </div>
          <div className="bg-background/40 border border-white/5 p-3 rounded-lg">
            <div className="text-[10px] text-muted-text font-mono uppercase mb-1">Avg Latency Edge</div>
            <div className="text-xl font-mono font-bold text-aegis-cyan">185ms</div>
            <div className="text-[10px] text-aegis-cyan/70 font-mono mt-1">Liquify Optimized</div>
          </div>
        </div>

        {/* Chart */}
        <div className="flex-1 min-h-[150px] w-full relative">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
                <XAxis 
                  dataKey="time" 
                  stroke="#475569" 
                  fontSize={10} 
                  tickMargin={10}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#475569" 
                  fontSize={10}
                  tickFormatter={(val) => `${val}`}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#06b6d4", strokeWidth: 1, strokeDasharray: "3 3" }} />
                <Line 
                  type="monotone" 
                  dataKey="fees" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  dot={{ r: 2, fill: "#1e293b", stroke: "#22c55e", strokeWidth: 2 }}
                  activeDot={{ r: 4, fill: "#22c55e", stroke: "#020617" }}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
             <div className="absolute inset-0 flex items-center justify-center font-mono text-xs text-muted-text">
               AWAITING REVENUE DATA
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
