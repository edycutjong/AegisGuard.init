// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/AegisGuard.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // Use the Initia standard derivation path/RPC if configuring cast later
        vm.startBroadcast(deployerPrivateKey);

        // Insurance fee minimum (e.g. 0.001 init)
        uint256 requiredInsuranceFee = 0.001 ether;
        
        AegisGuard aegis = new AegisGuard(requiredInsuranceFee);

        vm.stopBroadcast();

        // Output info for the frontend .env
        console.log("------------------------------------------");
        console.log("AegisGuard Deployed Address:", address(aegis));
        console.log("Insurance Fee Target:", requiredInsuranceFee);
        console.log("------------------------------------------");
    }
}
