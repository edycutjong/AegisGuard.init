# 🛡️ AegisGuard.init

**AegisGuard.init** is a sub-millisecond smart contract interceptor natively built for Initia execution environments. AegisGuard actively monitors the mempool and directly intercepts malicious transactions (Flash Loans, Oracle manipulation, Reentrancy) before state commits, acting as an automated on-chain Security Operations Center (SOC).

## 🏆 DoraHacks Initia 2026 Submission

- **Track**: Security / Infrastructure
- **Buidl**: [AegisGuard.init](https://dorahacks.io/buidl/placeholder) 
- **Demo Video**: [YouTube](https://youtube.com/placeholder-demo)

---

## 🔥 Features
- **Deterministic Interception**: Deploys counter-transactions directly via Initia appchain validators when suspicious logic is detected in the mempool.
- **On-chain SOC**: Complete historical audit trail and live tracking of threat intelligence stored securely using Supabase Realtime.
- **Decentralized Protection Insurance**: Users deposit small protocol fees (`INIT`) into AegisGuard to insure their sessions when interacting with complex inter-woven dApps.
- **Granular Session Revocations**: Suspend application execution privileges immediately upon detection of zero-day heuristics. 

---

## 🛠️ Tech Stack
- **Smart Contracts**: Solidity, Foundry
- **Node & Network**: Initia Appchain (`weave init`)
- **Frontend / Dashboard**: Next.js 16 (App Router), React 19, Tailwind v4
- **Event Streaming Engine**: Python 3.12, FastAPI
- **Database & Realtime**: Supabase (PostgreSQL)

---

## 🚀 Quick Start

### 1. Smart Contracts
Run within the local appchain:
```bash
cd contracts
forge test
forge script scripts/Deploy.s.sol --broadcast --rpc-url <INITIA_RPC> 
```

### 2. Frontend SOC Dashboard
```bash
cd frontend
npm install
npm run dev
```

### 3. Backend Heuristics Engine
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

---

## 📁 Repository Structure
- `frontend/` - Next.js SOC Dashboard providing live visualizations of threat detection.
- `contracts/` - Foundry workspace covering the `AegisGuard.sol` insurance and revocation mechanisms.
- `backend/` - Python FastAPI indexer handling mempool observations and heuristic firing.
- `db/` - Relational schemas for persisting SOC activities via Supabase.
- `.initia/` - Submission metadata for DoraHacks.

## 👥 Team
- **edycutjong** - Full Stack & Smart Contract Engineer
