from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import time
import uuid

app = FastAPI(title="AegisGuard.init Heuristics Engine")

# CORS for local hackathon frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TxSimulateRequest(BaseModel):
    to_address: str
    data: str
    value: int
    user_address: str

class RevokeRequest(BaseModel):
    session_id: str
    
class HaltRequest(BaseModel):
    reason: str

class HeuristicResult(BaseModel):
    threat_detected: bool
    severity: str
    confidence: float
    reason: str
    intercept_recommended: bool
    estimated_gas_saved: int

@app.get("/")
def read_root():
    return {"status": "AegisGuard Heuristics Engine Operational", "version": "1.0.0"}

@app.post("/api/scan", response_model=HeuristicResult)
def scan_transaction(tx: TxSimulateRequest):
    """
    Simulates a transaction against the Aegis AI heuristics models.
    For the hackathon MVP, we mock the detection logic based on payload patterns.
    """
    
    data_lower = tx.data.lower()
    
    # Mock Heuristics Ruleset
    if "flashloan" in data_lower or "drain" in data_lower or "0x0000000000000000000" in data_lower:
        return HeuristicResult(
            threat_detected=True,
            severity="CRITICAL",
            confidence=0.98,
            reason="High probability of atomic flash loan drain attack.",
            intercept_recommended=True,
            estimated_gas_saved=145000
        )
        
    if "updateprice" in data_lower or "oracle" in data_lower:
        return HeuristicResult(
            threat_detected=True,
            severity="HIGH",
            confidence=0.85,
            reason="Suspicious oracle price manipulation detected within block window.",
            intercept_recommended=True,
            estimated_gas_saved=85000
        )
        
    if "approve" in data_lower and ("max_uint" in data_lower or "ffffffff" in data_lower):
        return HeuristicResult(
            threat_detected=True,
            severity="MEDIUM",
            confidence=0.72,
            reason="Infinite approval requested by untrusted contract address.",
            intercept_recommended=False,
            estimated_gas_saved=0
        )

    # Safe Transaction
    return HeuristicResult(
        threat_detected=False,
        severity="NONE",
        confidence=0.99,
        reason="Transaction pattern matches standard safe interactions.",
        intercept_recommended=False,
        estimated_gas_saved=0
    )

@app.post("/api/revoke")
def revoke_session(req: RevokeRequest):
    """
    Mocks revoking a session on the Initia chain.
    """
    # In a real scenario, this would interact with the smart contract
    # to nullify the session key or permissions.
    time.sleep(0.5) # Simulate slight network delay
    return {"status": "success", "session_id": req.session_id, "message": "Session revoked on Initia chain"}

@app.post("/api/halt")
def global_halt(req: HaltRequest):
    """
    Mocks triggering the Global Halt function on the protocol.
    """
    time.sleep(0.8) # Simulate transaction confirmation time
    return {
        "status": "success", 
        "message": f"Global halt executed successfully. Reason: {req.reason}",
        "tx_hash": f"0x{uuid.uuid4().hex}"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "latency_ms": 14.2,  # Mock latency showing sub-20ms advantage
        "active_models": 3
    }

@app.get("/api/dashboard")
def get_dashboard_data():
    """
    Returns initial state for the SOC Dashboard.
    """
    now_ms = int(time.time() * 1000)
    
    return {
        "sessions": [
            { "id": "s1", "dappName": "InitiaSwap", "address": "0x7F5C...3A91", "timeRemaining": 3450, "txCount": 12, "status": "SAFE", "startTime": now_ms },
            { "id": "s2", "dappName": "YieldAggregator", "address": "0x2B99...8F11", "timeRemaining": 120, "txCount": 84, "status": "SUSPICIOUS", "startTime": now_ms },
            { "id": "s3", "dappName": "Unknown Contract", "address": "0x991A...1C20", "timeRemaining": 0, "txCount": 5, "status": "REVOKED", "startTime": now_ms },
            { "id": "s4", "dappName": "DEX Router", "address": "0x5A0B...2E33", "timeRemaining": 2100, "txCount": 420, "status": "SAFE", "startTime": now_ms }
        ],
        "threats": [
            { "id": "t1", "timestamp": time.strftime('%Y-%m-%dT%H:%M:%S.%fZ', time.gmtime(time.time() - 120)), "type": "Flash Loan Attack", "severity": "CRITICAL", "action": "borrow(1000000 USDC)", "targetUser": "0x2B99...8F11" },
            { "id": "t2", "timestamp": time.strftime('%Y-%m-%dT%H:%M:%S.%fZ', time.gmtime(time.time() - 360)), "type": "Oracle Manipulation", "severity": "HIGH", "action": "updatePrice(INIT/USDC)", "targetUser": "0xProtocol" },
            { "id": "t3", "timestamp": time.strftime('%Y-%m-%dT%H:%M:%S.%fZ', time.gmtime(time.time() - 860)), "type": "Suspicious Approval", "severity": "MEDIUM", "action": "approve(MAX_UINT)", "targetUser": "0x7F5C...3A91" },
        ],
        "revenue": [
            { "time": "10:00", "fees": 2.4 },
            { "time": "10:05", "fees": 3.1 },
            { "time": "10:10", "fees": 8.5 },
            { "time": "10:15", "fees": 14.2 },
            { "time": "10:20", "fees": 15.8 },
            { "time": "10:25", "fees": 22.4 },
            { "time": "10:30", "fees": 25.1 }
        ]
    }
