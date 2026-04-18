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
https://github.com/user-attachments/assets/1fdccf92-7eb7-43f7-bd02-5f8ece7f14e8
> **SOC Command Center** — Real-time threat detection, session revocation, and insurance tracking rendered as a military-grade security operations dashboard with animated hex grid, radar sweep, and live statistics.

### Threat Detection & Interception

| Exploit Detected | AegisGuard Interception | Session Revocation |
|:---:|:---:|:---:|
| https://github.com/user-attachments/assets/a8f972d6-bddb-4b44-87fe-449d0ec23be3 | https://github.com/user-attachments/assets/9829912e-ad30-4dee-a930-e94b59e1f9c1 | https://github.com/user-attachments/assets/821f4668-7788-447a-bdd4-f0a72df450f9 |
| *Malicious contract upgrade attempt on InitiaYield* | *Sub-millisecond automated interception overlay* | *Immediate isolation and session suspension* |

<details>
<summary><strong>🎥 View More Dashboard Features (Click to expand)</strong></summary>

| Live Event Timeline | SOC Overrides | Stealth Intercept |
|:---:|:---:|:---:|
| https://github.com/user-attachments/assets/463ef00f-e2d3-4a96-a9b4-d9b69a3fab8a | https://github.com/user-attachments/assets/d1189db8-501c-42f9-9c27-d8e9950f7938 | https://github.com/user-attachments/assets/a73e5765-92a5-452a-b465-577c656af3c2 |

| Global Halt State | Hex Grid Ambience | Dashboard view |
|:---:|:---:|:---:|
| https://github.com/user-attachments/assets/9018d9fc-bfec-42df-a49c-0b2b8b85e76a | https://github.com/user-attachments/assets/34d21dc6-fb21-4ede-bf35-fa90ea1dd5a5 | https://github.com/user-attachments/assets/35ebd14a-b8bb-4529-bd37-ee94b90dcac1 |

| Live Stats | Demo Load |
|:---:|:---:|
| https://github.com/user-attachments/assets/4e05bdfc-08d7-4099-b7b5-528c34da672e | https://github.com/user-attachments/assets/4eaa14e0-d9c7-4120-9868-8818e02ba2ab |
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
