// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {EmailDomainProver} from "./EmailDomainProver.sol";

import {Proof} from "vlayer-0.1.0/Proof.sol";
import {Verifier} from "vlayer-0.1.0/Verifier.sol";

contract EmailDomainVerifier is Verifier {
    address public prover;

    mapping(bytes32 => bool) public takenEmailHashes;

    constructor(address _prover) {
        prover = _prover;
    }

    function verify(Proof calldata, bytes32 _emailHash)
        public
        onlyVerified(prover, EmailDomainProver.main.selector)
        returns (bool)
    {
        require(takenEmailHashes[_emailHash] == false, "email taken");
        takenEmailHashes[_emailHash] = true;
        return true;
    }
}
