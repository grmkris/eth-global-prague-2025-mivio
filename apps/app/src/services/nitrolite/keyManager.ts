import { getAddress, keccak256, toBytes, toHex, type Hex } from "viem";
import { privateKeyToAccount, generatePrivateKey } from "viem/accounts";
import type { WalletClient } from "viem";

const CRYPTO_KEYPAIR_KEY = "nitrolite_crypto_keypair";

export interface CryptoKeypair {
  privateKey: Hex;
  address: `0x${string}`;
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
    const privateKey = generatePrivateKey();
    const account = privateKeyToAccount(privateKey);
    
    return {
      privateKey,
      address: getAddress(account.address),
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
export const createStateWalletClient = (keyPair: CryptoKeypair): StateWalletClient => {
  const account = privateKeyToAccount(keyPair.privateKey);

  return {
    account: {
      address: getAddress(account.address),
    },
    signMessage: async ({ message }) => {
      let messageBytes: Uint8Array;
      
      if (message.raw instanceof Uint8Array) {
        messageBytes = message.raw;
      } else if (typeof message.raw === 'string') {
        // If it's a hex string, convert to bytes
        messageBytes = toBytes(message.raw as Hex);
      } else {
        throw new Error("Invalid message format");
      }

      // Sign the message
      const signature = await account.signMessage({
        message: { raw: messageBytes },
      });

      return signature;
    },
  };
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
export const createMessageSigner = (stateWallet: StateWalletClient) => {
  return async (props: { payload: unknown; walletClient: WalletClient }) => {
    const { payload } = props;
    console.log("signing message", payload);
    const message = JSON.stringify(payload);
    const digestHex = keccak256(toHex(message));
    const messageBytes = toBytes(digestHex);
    console.log("stateWallet", stateWallet);

    const signature = await stateWallet.signMessage({
      message: { raw: messageBytes },
    });

    return signature;
  };
}; 