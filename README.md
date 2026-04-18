<div align="center">
  <h1>🛡️ AegisGuard.init</h1>
  <p><em>Sub-millisecond smart contract interceptor for Initia — catching exploits before they hit the chain.</em></p>

  <br />

  [![Live Demo](https://img.shields.io/badge/🔴_Live-Demo-06b6d4?style=for-the-badge)](https://aegisguard-init.vercel.app)
  [![Pitch Video](https://img.shields.io/badge/🎬_Pitch-Video-ef4444?style=for-the-badge)](https://youtube.com/placeholder-demo)
  [![DoraHacks](https://img.shields.io/badge/🏆_DoraHacks-Initia_2026-8b5cf6?style=for-the-badge)](https://dorahacks.io/buidl/placeholder)

  <br />

  ![Next.js](https://img.shields.io/badge/Next.js_16-000?logo=nextdotjs&logoColor=white)
  ![React](https://img.shields.io/badge/React_19-61DAFB?logo=react&logoColor=black)
  ![Tailwind](https://img.shields.io/badge/Tailwind_v4-06B6D4?logo=tailwindcss&logoColor=white)
  ![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
  ![Solidity](https://img.shields.io/badge/Solidity-363636?logo=solidity&logoColor=white)
  ![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=white)
  ![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)

</div>

---

## 📸 See it in Action

<!-- Main Hero / Full Dashboard -->
<img width="100%" alt="01_soc_load" src="https://github.com/user-attachments/assets/e7f0c069-dbee-443c-b2e5-e57e7fb97540" />

> **SOC Command Center** — Real-time threat detection, session revocation, and insurance tracking rendered as a military-grade security operations dashboard with animated hex grid, radar sweep, and live statistics.

### Threat Detection & Interception

| Exploit Detected | AegisGuard Interception | Session Revocation |
|:---:|:---:|:---:|
| <img width="100%" alt="10_demo_attack" src="https://github.com/user-attachments/assets/dea15867-8718-4043-a8d2-d8a6382c4d78" /> | <img width="100%" alt="06_intercept" src="https://github.com/user-attachments/assets/9ca1475a-dc4a-4e2b-b2b1-b4ecca179a41" /> | <img width="100%" alt="03_sessions" src="https://github.com/user-attachments/assets/1a9387d8-aefe-4c66-9c13-8c31d8beee9d" /> |
| *Malicious contract upgrade attempt on InitiaYield* | *Sub-millisecond automated interception overlay* | *Immediate isolation and session suspension* |

<details>
<summary><strong>🎥 View More Dashboard Features (Click to expand)</strong></summary>

| Feature Overview | Advanced Controls |
|:---:|:---:|
| **Live Event Timeline**<br><img width="100%" alt="04_threats" src="https://github.com/user-attachments/assets/e78dfa9a-afa7-449c-890d-6028810393b4" /> | **SOC Overrides**<br><img width="100%" alt="05_revenue" src="https://github.com/user-attachments/assets/ef453a79-364b-43ab-801b-5453c51e4fc2" /> |
| **Stealth Intercept**<br><img width="100%" alt="07_stealth" src="https://github.com/user-attachments/assets/78d2bd41-f462-4421-bacf-f189e722449a" /> | **Global Halt State**<br><img width="100%" alt="08_halt" src="https://github.com/user-attachments/assets/fd3d5942-b934-499b-8483-5012b76e5b34" /> |
| **Hex Grid Ambience**<br><img width="100%" alt="11_hexgrid_bg" src="https://github.com/user-attachments/assets/54bdf72c-832e-400d-a35c-431105c2129b" /> | **Dashboard view**<br><img width="100%" alt="12_dashboard" src="https://github.com/user-attachments/assets/0c73603f-ad38-41fa-b270-0db1845f6740" /> |
| **Live Stats**<br><img width="100%" alt="02_livestats" src="https://github.com/user-attachments/assets/4a393d12-4c07-4447-8e85-2d7d8c4dc6fe" /> | **Demo Load**<br><img width="100%" alt="09_demo_load" src="https://github.com/user-attachments/assets/6d7a357e-1fda-4172-93bc-161ac548358b" /> |
</details>

---

## 💡 The Problem

DeFi exploits drained **$1.7B+ in 2025 alone**. Flash loan attacks, oracle manipulation, and reentrancy hacks execute in milliseconds — far faster than any human analyst can react. On Initia's interwoven architecture, where appchains share execution contexts, a single exploit can cascade across multiple chains.

## ✅ The Solution

**AegisGuard.init** is an automated on-chain Security Operations Center (SOC) that:

- ⚡ **Intercepts in <1ms** — Monitors the mempool and deploys deterministic counter-transactions via Initia appchain validators before malicious state commits.
- 🔒 **Insures user sessions** — Users deposit small `INIT` protocol fees to protect their interactions with complex inter-woven dApps.
- 🚨 **Revokes instantly** — Suspends application execution privileges the moment zero-day heuristics fire.
- 📊 **Full audit trail** — Every threat, session, and insurance event is stored in Supabase with real-time streaming to the SOC dashboard.

---

## 🔥 Key Features

| Feature | Description |
|---|---|
| **Deterministic Interception** | Counter-transactions deployed directly via Initia appchain validators when suspicious mempool activity is detected |
| **On-Chain SOC Dashboard** | Military-grade command center with hex grid visualization, radar sweep, threat timeline, and live statistics |
| **Decentralized Protection Insurance** | Users stake small `INIT` fees into AegisGuard to insure their sessions across inter-woven dApps |
| **Granular Session Revocation** | Immediate privilege suspension upon detection of flash loans, oracle manipulation, or reentrancy patterns |
| **Red Alert System** | Full-screen animated overlay with emergency actions (Global Halt, Isolate Chain) when critical threats are detected |
| **Revenue Tracking** | Real-time insurance pool and fee collection visualization |

---

## 🏗️ Architecture & Tech Stack

![Architecture](docs/demo/architecture.png)

| Layer | Technology |
|---|---|
| **Smart Contracts** | Solidity, Foundry (Anvil, Forge) |
| **Blockchain** | Initia Appchain (`initiation-1` testnet) |
| **Heuristic Engine** | Python 3.12, FastAPI |
| **Frontend** | Next.js 16 (App Router), React 19, Tailwind CSS v4 |
| **Visual Effects** | HexGridCanvas, RadarSweep, GlitchText, LiveStatsBar |
| **Database & Realtime** | Supabase (PostgreSQL + Realtime subscriptions) |
| **Wallet Connection** | Reown (WalletConnect) + InterwovenKit |
| **Containerization** | Docker Compose (3 services) |
| **CI/CD** | GitHub Actions · Jest + pytest (100% coverage) |

---

## 🏆 Sponsor Tracks Targeted

| Sponsor | Integration | Code Location |
|---|---|---|
| **Initia** | Native appchain smart contract deployment with `weave init` validators and interwoven session management | [`contracts/src/AegisGuard.sol`](contracts/src/AegisGuard.sol) |
| **Supabase** | PostgreSQL schema with RLS policies, Realtime subscriptions for live SOC event streaming | [`db/schema.sql`](db/schema.sql) |

---

## 🚀 Run it Locally (For Judges)

### Option A: One-Command Docker (Recommended ⭐)

The fastest way to see AegisGuard in action — no manual configuration required:

```bash
git clone https://github.com/edycutjong/AegisGuard.init.git
cd AegisGuard.init
cp .env.example .env.local
make up
```

This spins up **3 containers**: local blockchain (Anvil on `:8545`), heuristic engine (FastAPI on `:8000`), and SOC dashboard (Next.js on `:3000`).

> **🎯 For Judges:** Open [http://localhost:3000](http://localhost:3000) — the dashboard is fully functional with mock threat data. No wallet or API keys required to explore the SOC interface.

---

### Option B: Native Development

<details>
<summary>Click to expand manual setup instructions</summary>

#### Prerequisites
- Node.js ≥ 20.9.0
- Python 3.12+
- [Foundry](https://getfoundry.sh/)

#### 1. Environment Setup
```bash
cp .env.example .env.local
# Edit .env.local with your Supabase and Reown keys (optional for local demo)
```

#### 2. Local Blockchain
```bash
# Terminal 1 — Start Anvil
make local-node

# Terminal 2 — Deploy smart contract
make deploy-local
# Copy the deployed address → paste into NEXT_PUBLIC_AEGIS_GUARD_ADDRESS in .env.local
```

#### 3. Backend Heuristic Engine
```bash
# Terminal 3
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

#### 4. Frontend SOC Dashboard
```bash
# Terminal 4
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access the command center.

</details>

---

## 🧪 Testing & CI

AegisGuard maintains **100% test coverage** across both frontend and backend:

```bash
make ci              # Full CI suite: lint + typecheck + test:coverage
make test            # Run all tests (frontend Jest + backend pytest)
make test-coverage   # Run with coverage reports
```

---

## 📁 Repository Structure

```
🛡️ AegisGuard.init/
│
├── 📂 frontend/                   # Next.js 16 SOC Dashboard
│   └── src/
│       ├── app/                   # App Router pages (SOC, Dashboard, Demo)
│       ├── components/
│       │   ├── soc/               # ThreatTimeline, SessionMonitor, RedAlertOverlay, RevenueTracker
│       │   └── effects/           # HexGridCanvas, RadarSweep, GlitchText, LiveStatsBar, StatusTicker
│       └── lib/                   # Types, constants, utilities
│
├── 📂 contracts/                  # Foundry workspace
│   ├── src/AegisGuard.sol         # Insurance pool, session mgmt, revocations
│   ├── scripts/                   # Deployment scripts
│   └── test/                      # Solidity tests
│
├── 📂 backend/                    # Python heuristic engine
│   ├── main.py                    # FastAPI endpoints (threat API, session API, halt controls)
│   └── test_main.py               # pytest suite (100% coverage)
│
├── 📂 db/                         # Supabase schema + RLS policies
│   └── schema.sql
│
├── 📄 docker-compose.yml          # 3-service stack (anvil + backend + frontend)
├── 📄 Makefile                    # Developer shortcuts (make up, make ci, etc.)
├── 📄 .env.example                # Environment template for judges
└── 📄 .nvmrc                      # Node v20.9.0
```

---

## 👥 Team

- **[@edycutjong](https://github.com/edycutjong)** — Full Stack & Smart Contract Engineer

---

<div align="center">
  <sub>Built with ⚡ for the <strong>DoraHacks Initia 2026</strong> hackathon.</sub>
</div>
