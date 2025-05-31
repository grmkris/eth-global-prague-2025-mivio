"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";

type UserData = {
	name: string;
	avatar?: string;
	displayName?: string;
};

type UserContextType = {
	user: UserData | null;
	loading: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
	const { address } = useAccount();
	const [user, setUser] = useState<UserData | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// In a real app, this would fetch user data from an API based on the wallet address
		const fetchUserData = async () => {
			setLoading(true);

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 300));

			if (address) {
				// Mock user data - in production, this would come from your backend
				setUser({
					name: "Anna",
					avatar: "/placeholder.svg?height=64&width=64",
					displayName: "Anna",
				});
			} else {
				setUser(null);
			}

			setLoading(false);
		};

		fetchUserData();
	}, [address]);

	return (
		<UserContext.Provider value={{ user, loading }}>
			{children}
		</UserContext.Provider>
	);
}

export function useUser() {
	const context = useContext(UserContext);
	if (context === undefined) {
		throw new Error("useUser must be used within a UserProvider");
	}
	return context;
}
