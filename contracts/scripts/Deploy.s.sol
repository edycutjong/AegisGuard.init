// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/AegisGuard.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // Use the Initia standard derivation path/RPC if configuring cast later
        vm.startBroadcast(deployerPrivateKey);

        AegisGuard aegis = new AegisGuard();

        vm.stopBroadcast();

        // Output info for the frontend .env
        console.log("------------------------------------------");
        console.log("AegisGuard Deployed Address:", address(aegis));
        console.log("Insurance Fee:", aegis.insuranceFee());
        console.log("------------------------------------------");
    }
}
