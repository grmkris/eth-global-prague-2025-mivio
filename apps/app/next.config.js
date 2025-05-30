/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  // Don't use standalone output for Vercel
  output: undefined,
  
  // This can help with build issues
  transpilePackages: ['shared'],
  
  // Disable type checking during build (if it's causing issues)
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Ensure ESLint doesn't block the build
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default config;
