// config/index.tsx

import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { flowTestnet, flowMainnet, baseSepolia } from "@reown/appkit/networks";
import { cookieStorage, createStorage } from "@wagmi/core";

// Get projectId from https://cloud.reown.com
export const projectId = "f79c0744d4d8e18650537565886b52ab";

if (!projectId) {
	throw new Error("Project ID is not defined");
}

export const networks = [baseSepolia];

export const createWagmiConfig = () => {
	const wagmiAdapter = new WagmiAdapter({
		storage: createStorage({
			storage: cookieStorage,
		}),
		ssr: true,
		projectId,
		networks,
		chains: [baseSepolia],
	});
	const defaultNetwork = baseSepolia; //networks[0];
	return {
		wagmiAdapter,
		defaultNetwork,
	};
};
