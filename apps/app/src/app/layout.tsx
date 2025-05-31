import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import type React from "react";
import "~/styles/globals.css";
import { ContextProvider } from "~/WalletContext";
import { ThemeProvider } from "~/components/theme-provider";
import { TRPCReactProvider } from "~/trpc/react";
import { ProofProvider } from "@vlayer/react";

const inter = Inter({ subsets: ["latin"] });
const nunito = Inter({ subsets: ["latin"], variable: "--font-nunito" });
const ptSans = Inter({ subsets: ["latin"], variable: "--font-pt-sans" });

export const metadata: Metadata = {
	title: "Mivio",
	description: "Mivio",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const headersList = await headers();
	const cookies = headersList.get("cookie");
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${nunito.variable} ${ptSans.variable} relative antialiased`}
			>
				<div className="texture" />
				<TRPCReactProvider>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<ContextProvider cookies={cookies}>
							<ProofProvider>{children}</ProofProvider>
						</ContextProvider>
					</ThemeProvider>
				</TRPCReactProvider>
			</body>
		</html>
	);
}
