"use client";

import {
	useCallProver,
	useChain,
	useWaitForProvingResult,
} from "@vlayer/react";
import { preverifyEmail } from "@vlayer/sdk";
import debug from "debug";
import { useEffect, useState } from "react";
import type {
	Abi,
	AbiStateMutability,
	Address,
	ContractFunctionArgs,
} from "viem";
import {
	useAccount,
	useBalance,
	useWaitForTransactionReceipt,
	useWriteContract,
} from "wagmi";
import proverSpec from "./EmailDomainProver.json";
import verifierSpec from "./EmailDomainVerifier.json";

const log = debug("vlayer:email-proof-verification");

export const useEmailProofVerification = () => {
	const { address } = useAccount();

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
		process.env.NEXT_PUBLIC_CHAIN_NAME,
	);
	if (chainError) {
		throw new Error(chainError);
	}

	const {
		callProver,
		data: proofHash,
		error: callProverError,
	} = useCallProver({
		address: process.env.NEXT_PUBLIC_PROVER_ADDRESS as `0x${string}`,
		proverAbi: proverSpec.abi as Abi,
		functionName: "main",
		gasLimit: Number(process.env.NEXT_PUBLIC_GAS_LIMIT),
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
			address: process.env.NEXT_PUBLIC_VERIFIER_ADDRESS as `0x${string}`,
			abi: verifierSpec.abi,
			functionName: "verify",
			args: proof as unknown as ContractFunctionArgs<
				typeof verifierSpec.abi,
				AbiStateMutability,
				"verify"
			>,
		};

		writeContract(contractArgs);
	};

	const [preverifyError, setPreverifyError] = useState<Error | null>(null);
	const startProving = async (emlContent: string) => {
		try {
			const email = await preverifyEmail({
				mimeEmail: emlContent,
				dnsResolverUrl: process.env.NEXT_PUBLIC_DNS_SERVICE_URL as string,
				token: process.env.NEXT_PUBLIC_VLAYER_API_TOKEN as string,
			});
			await callProver([email]);
		} catch (error) {
			setPreverifyError(error as Error);
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (proof) {
			void verifyProofOnChain();
		}
	}, [proof]);

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
