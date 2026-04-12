// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract AegisGuard {
    struct Session {
        address owner;
        address dApp;
        uint256 createdAt;
        uint256 expiresAt;
        bool active;
        uint256 txCount;
        uint256 revokedAt;
        string revokeReason;
    }

    mapping(bytes32 => Session) public sessions;
    mapping(address => bytes32[]) public userSessions;
    
    uint256 public insuranceFee = 0.001 ether; // per protected TX
    uint256 public totalRevenue;
    uint256 public totalThreatsBlocked;

    event SessionRegistered(bytes32 indexed sessionId, address owner, address dApp);
    event ThreatDetected(bytes32 indexed sessionId, string reason, uint256 timestamp);
    event SessionRevoked(bytes32 indexed sessionId, string reason);
    event InsuranceFeeCollected(bytes32 indexed sessionId, uint256 amount);

    function registerSession(address _dApp, uint256 _duration) external payable returns (bytes32 sessionId) {
        require(msg.value >= insuranceFee, "Insurance fee required");
        
        sessionId = keccak256(abi.encodePacked(msg.sender, _dApp, block.timestamp));
        sessions[sessionId] = Session({
            owner: msg.sender,
            dApp: _dApp,
            createdAt: block.timestamp,
            expiresAt: block.timestamp + _duration,
            active: true,
            txCount: 0,
            revokedAt: 0,
            revokeReason: ""
        });
        userSessions[msg.sender].push(sessionId);
        
        totalRevenue += msg.value;
        emit SessionRegistered(sessionId, msg.sender, _dApp);
        emit InsuranceFeeCollected(sessionId, msg.value);
    }

    function revokeSession(bytes32 _sessionId, string calldata _reason) external {
        Session storage session = sessions[_sessionId];
        require(session.active, "Session not active");
        
        session.active = false;
        session.revokedAt = block.timestamp;
        session.revokeReason = _reason;
        totalThreatsBlocked++;
        
        emit ThreatDetected(_sessionId, _reason, block.timestamp);
        emit SessionRevoked(_sessionId, _reason);
    }

    function getSessionStatus(bytes32 _sessionId) external view returns (
        bool active, uint256 txCount, string memory revokeReason
    ) {
        Session storage session = sessions[_sessionId];
        return (session.active, session.txCount, session.revokeReason);
    }
}
