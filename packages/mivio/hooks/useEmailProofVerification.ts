import { useState, useEffect } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
  useBalance,
} from "wagmi";
import {
  useCallProver,
  useWaitForProvingResult,
  useChain,
} from "@vlayer/react";
import { preverifyEmail } from "@vlayer/sdk";
import proverSpec from "../spec/EmailDomainProver.sol/EmailDomainProver";
import verifierSpec from "../spec/EmailProofVerifier.sol/EmailDomainVerifier";
import { AbiStateMutability, ContractFunctionArgs, Address, parseEther } from "viem";
import debug from "debug";

const log = debug("vlayer:email-proof-verification");


export const ensureBalance = async (address: Address, balance: bigint) => {
    console.log("ensureBalance", address, balance);
    if (balance > parseEther("0.00002")) {
      return;
    }
  };

export const useEmailProofVerification = () => {
  const { address } = useAccount();
  const { data: balance } = useBalance({ address });

  const {
    writeContract,
    data: txHash,
    error: verificationError,
    status,
  } = useWriteContract();

  const { status: onChainVerificationStatus } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const { chain, error: chainError } = useChain(
    import.meta.env.VITE_CHAIN_NAME,
  );
  if (chainError) {
    throw new Error(chainError);
  }

  const {
    callProver,
    data: proofHash,
    error: callProverError,
  } = useCallProver({
    address: import.meta.env.VITE_PROVER_ADDRESS,
    proverAbi: proverSpec.abi,
    functionName: "main",
    gasLimit: Number(import.meta.env.VITE_GAS_LIMIT),
    chainId: chain?.id,
  });

  if (callProverError) {
    throw new Error(callProverError.message);
  }

  const { data: proof, error: provingError } =
    useWaitForProvingResult(proofHash);

  if (provingError) {
    throw new Error(provingError.message);
  }

  const verifyProofOnChain = async () => {

    if (!proof) {
      throw new Error("No proof available to verify on-chain");
    }

    const contractArgs: Parameters<typeof writeContract>[0] = {
      address: import.meta.env.VITE_VERIFIER_ADDRESS,
      abi: verifierSpec.abi,
      functionName: "verify",
      args: proof as unknown as ContractFunctionArgs<
        typeof verifierSpec.abi,
        AbiStateMutability,
        "verify"
      >,
    };

    await ensureBalance(address as `0x${string}`, balance?.value ?? 0n);

    writeContract(contractArgs);
  };

  const [preverifyError, setPreverifyError] = useState<Error | null>(null);
  const startProving = async (emlContent: string) => {

    try {
      const email = await preverifyEmail({
        mimeEmail: emlContent,
        dnsResolverUrl: import.meta.env.VITE_DNS_SERVICE_URL,
        token: import.meta.env.VITE_VLAYER_API_TOKEN,
      });
      await callProver([email]);
    } catch (error) {
      setPreverifyError(error as Error);
    }
  };

  useEffect(() => {
    if (proof) {
      log("proof", proof);
      void verifyProofOnChain();
    }
  }, [proof]);

  /* useEffect(() => {
    if (status === "success" && proof) {
      const proofArray = proof as unknown[];
      void navigate(
        `/success?txHash=${txHash}&domain=${String(proofArray[3])}&recipient=${String(proofArray[2])}`,
      );
    }
  }, [status]); */

  

  useEffect(() => {
    if (preverifyError) {
      throw new Error(preverifyError.message);
    }
  }, [preverifyError]);

  return {
    txHash,
    onChainVerificationStatus,
    verificationError,
    provingError,
    startProving,
  };
};
