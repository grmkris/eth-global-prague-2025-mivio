import { getAddress, keccak256, toBytes, toHex, type Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import type { MessageSigner, RequestData, ResponsePayload } from "@erc7824/nitrolite";

/**
 * Interface for a wallet signer that can sign messages
 * @deprecated Use keyManager.ts instead for new implementations
 */
export interface WalletSigner {
    /** Optional Ethereum address derived from the public key */
    address: Hex;
    /** Function to sign a message and return a hex signature */
    sign: MessageSigner;
}

/**
 * Creates a signer from a private key
 * @deprecated Use keyManager.ts createStateWalletClient instead
 *
 * @param privateKey - The private key to create the signer from
 * @returns A WalletSigner object that can sign messages
 * @throws Error if signer creation fails
 */
export const createEthersSigner = (privateKey: Hex): WalletSigner => {
    try {
        // Create viem account from private key
        const wallet = privateKeyToAccount(privateKey);

        return {
            address: getAddress(wallet.address),
            sign: async (payload: RequestData | ResponsePayload): Promise<Hex> => {
                try {
                    const message = JSON.stringify(payload);
                    console.log("Signing message in Sign function:", message);
                    
	                  const digestHex = keccak256(toHex(message));
                    console.log("Digest Hex:", digestHex);
                    const messageBytes = toBytes(digestHex);

                    const signature = await wallet.sign({ hash: digestHex });

                    return signature as Hex;
                } catch (error) {
                    console.error("Error signing message:", error);
                    throw error;
                }
            },
        };
    } catch (error) {
        console.error("Error creating ethers signer:", error);
        throw error;
    }
};

// Legacy exports for backward compatibility
export { generateKeyPair } from "./keyManager";
export type { CryptoKeypair } from "./keyManager";