// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.25 <0.9.0;

import { MivioNFT } from "../src/erc721.sol";

import { BaseScript } from "./Base.s.sol";

/// @dev See the Solidity Scripting tutorial: https://book.getfoundry.sh/tutorials/solidity-scripting
contract Deploy is BaseScript {
    function run() public broadcast returns (MivioNFT mivioNFT) {
        // Deploy MivioNFT with constructor parameters
        address initialOwner = msg.sender; // The deployer becomes the owner
        string memory name = "Mivio Identity";
        string memory symbol = "MIVIO";
        string memory baseURI = "https://api.mivio.com/metadata";
        
        mivioNFT = new MivioNFT(initialOwner, name, symbol, baseURI);
    }
}
