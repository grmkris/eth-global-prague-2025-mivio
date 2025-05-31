// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.22;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract MivioNFT is ERC721, Ownable {
    uint256 private _nextTokenId;
    string private _baseTokenURI;
    
    // Track which addresses have already minted
    mapping(address => bool) private _hasMinted;

    // Events
    event BaseURIUpdated(string newBaseURI);
    event MivioNFTMinted(address indexed to, uint256 indexed tokenId);

    constructor(
        address initialOwner, 
        string memory name, 
        string memory symbol, 
        string memory baseURI
    )
        ERC721(name, symbol)
        Ownable(initialOwner)
    {
        _baseTokenURI = baseURI;
    }

    function safeMint(address to) public onlyOwner returns (uint256) {
        // Check if this address already has an NFT
        require(!_hasMinted[to], "MivioNFT: address already has an NFT");
        
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _hasMinted[to] = true;
        
        emit MivioNFTMinted(to, tokenId);
        return tokenId;
    }

    // Batch mint function for efficiency
    function safeMintBatch(address[] calldata recipients) public onlyOwner {
        for (uint256 i = 0; i < recipients.length; i++) {
            safeMint(recipients[i]);
        }
    }

    // Update the base URI for metadata resolution
    function setBaseURI(string memory newBaseURI) public onlyOwner {
        _baseTokenURI = newBaseURI;
        emit BaseURIUpdated(newBaseURI);
    }

    // Get the current base URI
    function getBaseURI() public view returns (string memory) {
        return _baseTokenURI;
    }

    // Override tokenURI to use base URI + token ID
    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        _requireOwned(tokenId);
        
        string memory baseURI = _baseTokenURI;
        if (bytes(baseURI).length == 0) {
            return "";
        }
        
        return string(abi.encodePacked(baseURI, "/", _toString(tokenId)));
    }

    // Utility function to convert uint to string
    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

    // Check if an address has an NFT
    function hasNFT(address addr) public view returns (bool) {
        return _hasMinted[addr];
    }

    // SOULBOUND: Override _update to prevent transfers (except minting)
    function _update(address to, uint256 tokenId, address auth)
        internal
        override
        returns (address)
    {
        address from = _ownerOf(tokenId);
        
        // Allow minting (from == address(0)) but block transfers
        if (from != address(0) && to != address(0)) {
            revert("MivioNFT: transfers are not allowed");
        }
        
        return super._update(to, tokenId, auth);
    }

    // Override approve functions to prevent approvals (since transfers are not allowed)
    function approve(address to, uint256 tokenId) public override {
        require(to == address(0), "MivioNFT: approvals are not allowed");
        super.approve(to, tokenId);
    }

    function setApprovalForAll(address operator, bool approved) public override {
        require(!approved, "MivioNFT: approvals are not allowed");
        super.setApprovalForAll(operator, approved);
    }

    // Allow burning (optional - remove if you don't want burning)
    function burn(uint256 tokenId) public {
        address tokenOwner = ownerOf(tokenId);
        require(tokenOwner == msg.sender || owner() == msg.sender, "MivioNFT: not authorized to burn");
        
        _hasMinted[tokenOwner] = false; // Allow them to mint again after burning
        _burn(tokenId);
    }

    // Get total supply
    function totalSupply() public view returns (uint256) {
        return _nextTokenId;
    }

    // Check if a token exists
    function exists(uint256 tokenId) public view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }
}
