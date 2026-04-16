// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/AegisGuard.sol";

contract AegisGuardTest is Test {
    AegisGuard public guard;
    address owner = address(this);
    address user1 = address(0x1);
    address mockDApp = address(0x2);

    function setUp() public {
        guard = new AegisGuard();
        vm.deal(user1, 1 ether);
    }

    function testRegisterSession() public {
        vm.prank(user1);
        bytes32 sessionId = guard.registerSession{value: 0.001 ether}(mockDApp, 1 hours);
        
        (bool active, uint256 txCount, string memory revokeReason) = guard.getSessionStatus(sessionId);
        
        assertTrue(active);
        assertEq(txCount, 0);
        assertEq(revokeReason, "");
        assertEq(guard.totalRevenue(), 0.001 ether);
    }

    function testRegisterSessionFailsInsufficientFee() public {
        vm.prank(user1);
        vm.expectRevert("Insurance fee required");
        guard.registerSession{value: 0.0005 ether}(mockDApp, 1 hours);
    }

    function testRevokeSession() public {
        vm.prank(user1);
        bytes32 sessionId = guard.registerSession{value: 0.001 ether}(mockDApp, 1 hours);
        
        // Owner revokes the session
        guard.revokeSession(sessionId, "Suspicious activity detected: Flash loan reentrancy pattern");
        
        (bool active, , string memory revokeReason) = guard.getSessionStatus(sessionId);
        
        assertFalse(active);
        assertEq(revokeReason, "Suspicious activity detected: Flash loan reentrancy pattern");
        assertEq(guard.totalThreatsBlocked(), 1);
    }

    function testRevokeInactiveSessionFails() public {
        vm.prank(user1);
        bytes32 sessionId = guard.registerSession{value: 0.001 ether}(mockDApp, 1 hours);
        
        guard.revokeSession(sessionId, "First revocation");
        
        vm.expectRevert("Session not active");
        guard.revokeSession(sessionId, "Second revocation"); // Should fail
    }
}
