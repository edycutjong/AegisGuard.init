export type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export interface Session {
  id: string;
  dappName: string;
  address: string;
  timeRemaining: number; // in seconds
  txCount: number;
  status: "SAFE" | "SUSPICIOUS" | "REVOKED";
  startTime: number;
}

export interface Threat {
  id: string;
  timestamp: string;
  type: string;
  severity: Severity;
  action: string;
  targetUser: string;
}

export interface RevenueData {
  time: string;
  fees: number;
}
