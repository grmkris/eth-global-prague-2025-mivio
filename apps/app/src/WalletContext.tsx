// context/index.tsx
"use client";


import { baseSepolia } from "@reown/appkit/networks";
import { createAppKit } from "@reown/appkit/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { type ReactNode } from "react";
import { type Config, WagmiProvider, cookieToInitialState } from "wagmi";
import { createWagmiConfig, projectId } from "~/wagmiConfig";

// Set up queryClient
const queryClient = new QueryClient();

if (!projectId) {
	throw new Error("Project ID is not defined");
}

// Set up metadata
const metadata = {
	name: "Mivio",
	description: "Mivio",
	url: "https://mivio.io", // origin must match your domain & subdomain
	icons: ["https://assets.reown.com/reown-profile-pic.png"],
};

const { wagmiAdapter } = createWagmiConfig();

// Create the modal
createAppKit({
	adapters: [wagmiAdapter],
	projectId,
	networks: [baseSepolia],
	defaultNetwork: baseSepolia,
	metadata: metadata,
	features: {
		analytics: true, // Optional - defaults to your Cloud configuration
	},
});

export function ContextProvider({
	children,
	cookies,
}: {
	children: ReactNode;
	cookies: string | null;
}) {
	const initialState = cookieToInitialState(
		wagmiAdapter.wagmiConfig as Config,
		cookies,
	);

	return (
		<WagmiProvider
			config={wagmiAdapter.wagmiConfig as Config}
			initialState={initialState}
		>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</WagmiProvider>
	);
}
