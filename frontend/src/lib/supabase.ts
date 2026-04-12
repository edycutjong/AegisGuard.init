import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper types
export type SessionRow = Database["public"]["Tables"]["sessions"]["Row"];
export type AlertRow = Database["public"]["Tables"]["alerts"]["Row"];
export type RevenueRow = Database["public"]["Tables"]["revenue"]["Row"];

export async function fetchActiveSessions() {
  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  return { data, error };
}

export async function fetchRecentAlerts(limit = 50) {
  const { data, error } = await supabase
    .from("alerts")
    .select("*, sessions(owner_address, dapp_address)")
    .order("detected_at", { ascending: false })
    .limit(limit);
  return { data, error };
}
