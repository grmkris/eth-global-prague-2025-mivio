// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.25 <0.9.0;

import { MivioNFT } from "../src/erc721.sol";
import { BaseScript } from "./Base.s.sol";
import { console } from "forge-std/console.sol";

/// @dev Script to mint NFT to a specific address
contract Mint is BaseScript {
    function run() public broadcast {
        // Contract address from the deployment on Flow testnet (chain 747)
        address contractAddress = 0x71a0B70Bfd27d37fA55a29702aFB3183224dE9D7;
        
        // Address to mint to
        address recipient = 0x81d786b35f3EA2F39Aa17cb18d9772E4EcD97206;
        
        // Get the deployed contract instance
        MivioNFT mivioNFT = MivioNFT(contractAddress);
        
        // Check if the address already has an NFT
        if (mivioNFT.hasNFT(recipient)) {
            console.log("Address already has an NFT");
            return;
        }
        
        // Mint the NFT
        uint256 tokenId = mivioNFT.safeMint(recipient);
        
        console.log("NFT minted successfully!");
        console.log("Recipient:", recipient);
        console.log("Token ID:", tokenId);
        console.log("Contract:", contractAddress);
    }
} 