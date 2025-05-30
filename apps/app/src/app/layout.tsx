import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { headers } from "next/headers"
import "./globals.css"
import { ThemeProvider } from "~/components/theme-provider"
import { ContextProvider } from "~/WalletContext"

const inter = Inter({ subsets: ["latin"] })
const nunito = Inter({ subsets: ["latin"], variable: "--font-nunito" })
const ptSans = Inter({ subsets: ["latin"], variable: "--font-pt-sans" })

export const metadata: Metadata = {
  title: "Mivio",
  description: "Mivio",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const headersList = await headers();
  const cookies = headersList.get("cookie");
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${nunito.variable} ${ptSans.variable} antialiased relative`}
      >
        <div className="texture" />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ContextProvider cookies={cookies}>{children}</ContextProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
