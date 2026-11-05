import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  serverExternalPackages: ["esbuild"],
  transpilePackages: ["monaco-editor"],
};

export default nextConfig;
