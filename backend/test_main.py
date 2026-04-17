from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"status": "AegisGuard Heuristics Engine Operational", "version": "1.0.0"}

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "latency_ms" in data
    assert "active_models" in data

def test_dashboard_data():
    response = client.get("/api/dashboard")
    assert response.status_code == 200
    data = response.json()
    assert "sessions" in data
    assert "threats" in data
    assert "revenue" in data
    assert len(data["sessions"]) > 0

def test_revoke_session():
    response = client.post("/api/revoke", json={"session_id": "test_session_123"})
    assert response.status_code == 200
    assert response.json()["status"] == "success"
    assert response.json()["session_id"] == "test_session_123"

def test_global_halt():
    response = client.post("/api/halt", json={"reason": "Emergency Test"})
    assert response.status_code == 200
    assert response.json()["status"] == "success"
    assert "Emergency Test" in response.json()["message"]
    assert "tx_hash" in response.json()

def test_scan_transaction_flashloan():
    payload = {
        "to_address": "0x123",
        "data": "Aabbcc flashloan xyz",
        "value": 0,
        "user_address": "0x456"
    }
    response = client.post("/api/scan", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["threat_detected"] is True
    assert data["severity"] == "CRITICAL"
    assert data["intercept_recommended"] is True

def test_scan_transaction_oracle():
    payload = {
        "to_address": "0x123",
        "data": "updatePRICE now",
        "value": 0,
        "user_address": "0x456"
    }
    response = client.post("/api/scan", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["threat_detected"] is True
    assert data["severity"] == "HIGH"
    assert data["intercept_recommended"] is True

def test_scan_transaction_approve():
    payload = {
        "to_address": "0x123",
        "data": "approve max_uint",
        "value": 0,
        "user_address": "0x456"
    }
    response = client.post("/api/scan", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["threat_detected"] is True
    assert data["severity"] == "MEDIUM"
    assert data["intercept_recommended"] is False

def test_scan_transaction_safe():
    payload = {
        "to_address": "0x123",
        "data": "normal transfer function no problem",
        "value": 1000,
        "user_address": "0x456"
    }
    response = client.post("/api/scan", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["threat_detected"] is False
    assert data["severity"] == "NONE"
    assert data["intercept_recommended"] is False
