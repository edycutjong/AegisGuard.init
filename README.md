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

### 1. Environment Setup
1. Copy `.env.example` to `.env.local` in the root of the project:
   ```bash
   cp .env.example .env.local
   ```
2. Open `.env.local` and populate your missing keys (Supabase, Reown/WalletConnect).

### 2. Local Smart Contract Deployment
If the public testnet is down or you want to test the full stack locally, spin up a local node using Foundry.
1. Install [Foundry](https://getfoundry.sh/) if you haven't already:
   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   foundryup
   ```
2. Start a local blockchain node in a separate terminal:
   ```bash
   anvil
   ```
3. Deploy the smart contract to your local node (using Anvil's default funded key):
   ```bash
   cd contracts
   PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 forge script scripts/Deploy.s.sol:DeployScript --rpc-url http://127.0.0.1:8545 --broadcast
   ```
4. Copy the `AegisGuard Deployed Address` from the terminal output and paste it into `NEXT_PUBLIC_AEGIS_GUARD_ADDRESS` inside your `.env.local` file.

### 3. Backend Heuristics Engine
Start the Python FastAPI indexer (which uses mock models for the demo flow):
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 4. Frontend SOC Dashboard
Start the Next.js frontend:
```bash
cd frontend
npm install
npm run dev
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
