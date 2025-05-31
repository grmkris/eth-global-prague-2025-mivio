"use client";

import { ProofProvider } from "@vlayer/react";

const proverConfig = {
    proverUrl: process.env.NEXT_PUBLIC_PROVER_URL,
    token: process.env.NEXT_PUBLIC_VLAYER_API_TOKEN,
  };
export const VlayerProvider = ({ children }: { children: React.ReactNode }) => {
  return <ProofProvider config={proverConfig}>{children}</ProofProvider>;
};