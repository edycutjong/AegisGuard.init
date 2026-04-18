-- AegisGuard.init Supabase Schema
-- Designed for DoraHacks Liquify Indexer Hacks 
-- Optimized for Realtime SOC Analytics

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Mock Supabase roles for local Postgres deployment
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'anon') THEN 
    CREATE ROLE anon NOLOGIN; 
  END IF; 
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'service_role') THEN 
    CREATE ROLE service_role NOLOGIN; 
  END IF; 
END 
$$;

-- Table: chains
-- Purpose: Tracks monitored rollups/L2s integrated via InterwovenKit
CREATE TABLE chains (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chain_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    rpc_url TEXT NOT NULL,
    liquify_rpc_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Table: alerts
-- Purpose: Core SOC detections and heartbeat logs
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255) NOT NULL,
    threat_type VARCHAR(255) NOT NULL,
    severity VARCHAR(50) CHECK (severity IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'NONE')),
    target_user_address VARCHAR(255) NOT NULL,
    action_payload TEXT,
    intercepted BOOLEAN DEFAULT false,
    confidence_score DECIMAL(5, 4),
    gas_saved BIGINT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Table: benchmarks
-- Purpose: Latency metrics proving Liquify API superiority
CREATE TABLE benchmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chain_id VARCHAR(255) REFERENCES chains(chain_id),
    standard_latency_ms DECIMAL(8, 2) NOT NULL,
    liquify_latency_ms DECIMAL(8, 2) NOT NULL,
    measured_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Table: exploits
-- Purpose: Catalog of known historical signatures for AI scanning
CREATE TABLE exploits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    signature_hash VARCHAR(255) UNIQUE NOT NULL,
    exploit_family VARCHAR(255) NOT NULL, -- e.g., 'Flash Loan', 'Reentrancy'
    description TEXT,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Enable Row Level Security (RLS)
ALTER TABLE chains ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE benchmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE exploits ENABLE ROW LEVEL SECURITY;

-- Policies for anon reads (SOC Dashboard view)
CREATE POLICY "Enable read access for all users on chains" ON chains FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users on alerts" ON alerts FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users on benchmarks" ON benchmarks FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users on exploits" ON exploits FOR SELECT USING (true);

-- Polices for service_role writes (Python Backend insertion)
-- These allow the backend to insert without exposing write access to the client.
-- Note: Service_role bypasses RLS by default, but defining them explicitly is good practice.
CREATE POLICY "Enable insert access for service_role on alerts" ON alerts FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY "Enable insert access for service_role on benchmarks" ON benchmarks FOR INSERT TO service_role WITH CHECK (true);
