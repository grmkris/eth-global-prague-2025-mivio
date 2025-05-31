// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console2} from "forge-std/Test.sol";
import {MivioNFT} from "../src/erc721.sol";

contract MivioNFTTest is Test {
    MivioNFT public mivioNFT;
    address public owner;
    address public user1 = address(0x1);
    address public user2 = address(0x2);
    
    string constant NAME = "Mivio Identity";
    string constant SYMBOL = "MIVIO";
    string constant BASE_URI = "https://api.mivio.com/metadata";

    event MivioNFTMinted(address indexed to, uint256 indexed tokenId);
    event BaseURIUpdated(string newBaseURI);

    function setUp() public {
        owner = address(this);
        mivioNFT = new MivioNFT(owner, NAME, SYMBOL, BASE_URI);
    }

    function test_ConstructorInitialization() public {
        assertEq(mivioNFT.name(), NAME, "Name should match");
        assertEq(mivioNFT.symbol(), SYMBOL, "Symbol should match");
        assertEq(mivioNFT.owner(), owner, "Owner should match");
        assertEq(mivioNFT.getBaseURI(), BASE_URI, "Base URI should match");
        assertEq(mivioNFT.totalSupply(), 0, "Initial total supply should be 0");
    }

    function test_SafeMintSuccess() public {
        uint256 expectedTokenId = 0; // First token should have ID 0
        
        // Expect the mint event
        vm.expectEmit(true, true, false, false);
        emit MivioNFTMinted(user1, expectedTokenId);
        
        // Mint NFT
        uint256 mintedTokenId = mivioNFT.safeMint(user1);
        
        assertEq(mintedTokenId, expectedTokenId, "Minted token ID should match expected");
        assertEq(mivioNFT.ownerOf(mintedTokenId), user1, "User1 should own the token");
        assertEq(mivioNFT.balanceOf(user1), 1, "User1 should have balance of 1");
        assertEq(mivioNFT.totalSupply(), 1, "Total supply should be 1");
        assertTrue(mivioNFT.hasNFT(user1), "User1 should have an NFT");
        assertTrue(mivioNFT.exists(mintedTokenId), "Token should exist");
    }

    function test_CannotMintTwiceToSameAddress() public {
        // First mint should succeed
        mivioNFT.safeMint(user1);
        
        // Second mint to same address should fail
        vm.expectRevert("MivioNFT: address already has an NFT");
        mivioNFT.safeMint(user1);
    }

    function test_OnlyOwnerCanMint() public {
        vm.prank(user1);
        vm.expectRevert();
        mivioNFT.safeMint(user1);
    }

    function test_SafeMintBatch() public {
        address[] memory recipients = new address[](3);
        recipients[0] = user1;
        recipients[1] = user2;
        recipients[2] = address(0x3);
        
        mivioNFT.safeMintBatch(recipients);
        
        assertEq(mivioNFT.totalSupply(), 3, "Total supply should be 3");
        assertTrue(mivioNFT.hasNFT(user1), "User1 should have an NFT");
        assertTrue(mivioNFT.hasNFT(user2), "User2 should have an NFT");
        assertTrue(mivioNFT.hasNFT(recipients[2]), "User3 should have an NFT");
    }

    function test_TokenURI() public {
        uint256 tokenId = mivioNFT.safeMint(user1);
        
        string memory expectedURI = "https://api.mivio.com/metadata/0";
        string memory actualURI = mivioNFT.tokenURI(tokenId);
        
        assertEq(actualURI, expectedURI, "Token URI should match expected format");
    }

    function test_TokenURIWithEmptyBaseURI() public {
        // Deploy contract with empty base URI
        MivioNFT emptyURI = new MivioNFT(owner, NAME, SYMBOL, "");
        uint256 tokenId = emptyURI.safeMint(user1);
        
        string memory actualURI = emptyURI.tokenURI(tokenId);
        assertEq(actualURI, "", "Token URI should be empty when base URI is empty");
    }

    function test_SetBaseURI() public {
        string memory newBaseURI = "https://api.mivio.com/v2/metadata";
        
        vm.expectEmit(false, false, false, true);
        emit BaseURIUpdated(newBaseURI);
        
        mivioNFT.setBaseURI(newBaseURI);
        assertEq(mivioNFT.getBaseURI(), newBaseURI, "Base URI should be updated");
        
        // Test that token URI reflects the change
        uint256 tokenId = mivioNFT.safeMint(user1);
        string memory expectedURI = "https://api.mivio.com/v2/metadata/0";
        assertEq(mivioNFT.tokenURI(tokenId), expectedURI, "Token URI should use new base URI");
    }

    function test_OnlyOwnerCanSetBaseURI() public {
        vm.prank(user1);
        vm.expectRevert();
        mivioNFT.setBaseURI("https://malicious.com");
    }

    function test_SoulboundTransferRestrictions() public {
        uint256 tokenId = mivioNFT.safeMint(user1);
        
        // Test that transfers are blocked
        vm.prank(user1);
        vm.expectRevert("MivioNFT: transfers are not allowed");
        mivioNFT.transferFrom(user1, user2, tokenId);
        
        vm.prank(user1);
        vm.expectRevert("MivioNFT: transfers are not allowed");
        mivioNFT.safeTransferFrom(user1, user2, tokenId);
        
        vm.prank(user1);
        vm.expectRevert("MivioNFT: transfers are not allowed");
        mivioNFT.safeTransferFrom(user1, user2, tokenId, "");
    }

    function test_SoulboundApprovalRestrictions() public {
        uint256 tokenId = mivioNFT.safeMint(user1);
        
        // Test that approvals are blocked
        vm.prank(user1);
        vm.expectRevert("MivioNFT: approvals are not allowed");
        mivioNFT.approve(user2, tokenId);
        
        vm.prank(user1);
        vm.expectRevert("MivioNFT: approvals are not allowed");
        mivioNFT.setApprovalForAll(user2, true);
    }

    function test_Burn() public {
        uint256 tokenId = mivioNFT.safeMint(user1);
        
        // User can burn their own token
        vm.prank(user1);
        mivioNFT.burn(tokenId);
        
        assertEq(mivioNFT.totalSupply(), 1, "Total supply should still be 1 (not decremented)");
        assertFalse(mivioNFT.hasNFT(user1), "User1 should not have an NFT after burn");
        assertFalse(mivioNFT.exists(tokenId), "Token should not exist after burn");
    }

    function test_OwnerCanBurn() public {
        uint256 tokenId = mivioNFT.safeMint(user1);
        
        // Owner can burn any token
        mivioNFT.burn(tokenId);
        
        assertEq(mivioNFT.totalSupply(), 1, "Total supply should still be 1 (not decremented)");
        assertFalse(mivioNFT.hasNFT(user1), "User1 should not have an NFT after burn");
    }

    function test_CannotBurnUnauthorized() public {
        uint256 tokenId = mivioNFT.safeMint(user1);
        
        vm.prank(user2);
        vm.expectRevert("MivioNFT: not authorized to burn");
        mivioNFT.burn(tokenId);
    }

    function test_TokenURIRevertsForNonexistentToken() public {
        uint256 nonexistentTokenId = 999;
        
        vm.expectRevert();
        mivioNFT.tokenURI(nonexistentTokenId);
    }

    function test_HasNFTReturnsFalseForUnminted() public {
        assertFalse(mivioNFT.hasNFT(user1), "User1 should not have an NFT initially");
    }

    function test_MintAfterBurn() public {
        // Mint, burn, then mint again should work
        uint256 tokenId1 = mivioNFT.safeMint(user1);
        
        vm.prank(user1);
        mivioNFT.burn(tokenId1);
        
        // Should be able to mint again (gets new token ID)
        uint256 tokenId2 = mivioNFT.safeMint(user1);
        assertTrue(mivioNFT.hasNFT(user1), "User1 should have an NFT after re-mint");
        assertEq(mivioNFT.totalSupply(), 2, "Total supply should be 2 after re-mint");
        assertNotEq(tokenId1, tokenId2, "New token should have different ID");
    }

    function test_SequentialTokenIds() public {
        uint256 tokenId1 = mivioNFT.safeMint(user1);
        uint256 tokenId2 = mivioNFT.safeMint(user2);
        
        assertEq(tokenId1, 0, "First token should have ID 0");
        assertEq(tokenId2, 1, "Second token should have ID 1");
    }
}
