export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      sessions: {
        Row: {
          id: string
          session_hash: string
          owner_address: string
          owner_init_name: string | null
          dapp_address: string
          dapp_name: string | null
          created_at: string
          expires_at: string
          is_active: boolean
          tx_count: number
          revoked_at: string | null
          revoke_reason: string | null
        }
        Insert: {
          id?: string
          session_hash: string
          owner_address: string
          owner_init_name?: string | null
          dapp_address: string
          dapp_name?: string | null
          created_at?: string
          expires_at: string
          is_active?: boolean
          tx_count?: number
          revoked_at?: string | null
          revoke_reason?: string | null
        }
        Update: {
          id?: string
          session_hash?: string
          owner_address?: string
          owner_init_name?: string | null
          dapp_address?: string
          dapp_name?: string | null
          created_at?: string
          expires_at?: string
          is_active?: boolean
          tx_count?: number
          revoked_at?: string | null
          revoke_reason?: string | null
        }
      }
      alerts: {
        Row: {
          id: string
          session_id: string | null
          threat_type: string
          severity: string
          details: Json
          tx_hash: string | null
          blocked: boolean
          detected_at: string
        }
        Insert: {
          id?: string
          session_id?: string | null
          threat_type: string
          severity: string
          details: Json
          tx_hash?: string | null
          blocked?: boolean
          detected_at?: string
        }
        Update: {
          id?: string
          session_id?: string | null
          threat_type?: string
          severity?: string
          details?: Json
          tx_hash?: string | null
          blocked?: boolean
          detected_at?: string
        }
      }
      revenue: {
        Row: {
          id: string
          session_id: string | null
          fee_amount: number
          fee_token: string
          tx_hash: string | null
          captured_at: string
        }
        Insert: {
          id?: string
          session_id?: string | null
          fee_amount: number
          fee_token?: string
          tx_hash?: string | null
          captured_at?: string
        }
        Update: {
          id?: string
          session_id?: string | null
          fee_amount?: number
          fee_token?: string
          tx_hash?: string | null
          captured_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
