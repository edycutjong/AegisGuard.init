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

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "latency_ms": 14.2,  # Mock latency showing sub-20ms advantage
        "active_models": 3
    }
