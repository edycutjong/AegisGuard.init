"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, LayoutDashboard, Crosshair } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "SOC Command", icon: Shield, color: "aegis-cyan", dotColor: "bg-aegis-cyan" },
  { href: "/dashboard", label: "Alt Dash", icon: LayoutDashboard, color: "white", dotColor: "bg-white" },
  { href: "/demo", label: "Demo dApp", icon: Crosshair, color: "purple-400", dotColor: "bg-purple-500" },
];

export default function NavPill() {
  const pathname = usePathname();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.8, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="flex gap-1 bg-slate-950/85 backdrop-blur-2xl border border-white/[0.08] p-1.5 rounded-full shadow-2xl shadow-black/50 font-mono text-xs uppercase tracking-wider relative overflow-hidden">
        {/* Animated border glow */}
        <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
          <div className="absolute inset-[-1px] rounded-full bg-gradient-to-r from-aegis-cyan/20 via-transparent to-ai-purple/20 opacity-50" />
        </div>

        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative px-4 py-2.5 rounded-full font-bold flex items-center gap-2 transition-all duration-300 ${
                isActive
                  ? `text-${item.color} bg-white/[0.06]`
                  : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.03]"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-active-bg"
                  className="absolute inset-0 rounded-full bg-white/[0.06] border border-white/[0.06]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {isActive && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`w-1.5 h-1.5 rounded-full ${item.dotColor} animate-pulse`}
                  />
                )}
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{item.label}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}
