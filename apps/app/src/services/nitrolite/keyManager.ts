import { keccak256, toBytes, toHex, type Hex } from "viem";
import type { WalletClient } from "viem";
import { ethers } from "ethers";
import type { RequestData, ResponsePayload } from "@erc7824/nitrolite";

export type WalletSigner = {
  address: `0x${string}`;
  sign: (payload: RequestData | ResponsePayload) => Promise<Hex>;
}

const CRYPTO_KEYPAIR_KEY = "nitrolite_crypto_keypair";

export interface CryptoKeypair {
  /** Private key in hexadecimal format */
  privateKey: string;
  /** Optional Ethereum address derived from the public key */
  address?: string;
}


export interface StateWalletClient {
  account: {
    address: `0x${string}`;
  };
  signMessage: (args: { message: { raw: Uint8Array | Hex } }) => Promise<Hex>;
}

/**
 * Generates a new keypair for state channel operations
 */
export const generateKeyPair = async (): Promise<CryptoKeypair> => {
  try {
    const wallet = ethers.Wallet.createRandom();

        // Hash the private key with Keccak256 for additional security
        const privateKeyHash = ethers.keccak256(wallet.privateKey as string);

        // Derive public key from hashed private key to create a new wallet
        const walletFromHashedKey = new ethers.Wallet(privateKeyHash);

        return {
            privateKey: privateKeyHash,
            address: ethers.getAddress(walletFromHashedKey.address),
        };
  } catch (error) {
    console.error("Error generating keypair:", error);
    throw error;
  }
};

/**
 * Loads keypair from localStorage or generates a new one
 */
export const loadOrGenerateKeyPair = async (): Promise<CryptoKeypair> => {
  if (typeof window === "undefined") {
    throw new Error("Key management only works in browser environment");
  }

  try {
    // Check for existing keys
    const savedKeys = localStorage.getItem(CRYPTO_KEYPAIR_KEY);
    console.log("savedKeys", savedKeys);
    if (savedKeys) {
      try {
        const parsed = JSON.parse(savedKeys) as CryptoKeypair;
        if (parsed.privateKey && parsed.address) {
          console.log("Loaded existing keypair from storage");
          return parsed;
        }
      } catch (error) {
        console.error("Failed to parse saved keys, generating new ones:", error);
        localStorage.removeItem(CRYPTO_KEYPAIR_KEY);
      }
    }

    // Generate new keys
    const newKeyPair = await generateKeyPair();
    localStorage.setItem(CRYPTO_KEYPAIR_KEY, JSON.stringify(newKeyPair));
    console.log("Generated and stored new keypair");
    return newKeyPair;
  } catch (error) {
    console.error("Failed to load or generate keys:", error);
    throw error;
  }
};

/**
 * Creates a state wallet client from a keypair
 * This is used for signing state channel messages
 */
export const createStateWalletClient = (keyPair: CryptoKeypair): WalletSigner => {
  try {
    // Create ethers wallet from private key
    const wallet = new ethers.Wallet(keyPair.privateKey);

    return {
        address: ethers.getAddress(wallet.address) as Hex,
        sign: async (payload: RequestData | ResponsePayload): Promise<Hex> => {
            try {
                const message = JSON.stringify(payload);
                console.log("Signing message in Sign function:", message);
                const digestHex = ethers.id(message);
                console.log("Digest Hex:", digestHex);
                const messageBytes = ethers.getBytes(digestHex);

                const { serialized: signature } = wallet.signingKey.sign(messageBytes);

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

/**
 * Clear stored keys
 */
export const clearStoredKeys = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(CRYPTO_KEYPAIR_KEY);
    console.log("Cleared stored keypair");
  }
};

/**
 * Creates a message signer function that uses the state wallet
 */
export const createMessageSigner = (stateWallet: WalletSigner) => {
  return async (props: { payload: unknown; walletClient: WalletClient }) => {
    const { payload } = props;
    console.log("signing message", payload);
    const message = JSON.stringify(payload);
    const digestHex = keccak256(toHex(message));
    const messageBytes = toBytes(digestHex);
    console.log("stateWallet", stateWallet);

    const signature = await stateWallet.sign(payload as RequestData | ResponsePayload);

    return signature;
  };
}; 