import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',

  // On the Railway preview box only, the front door is the concept lab.
  // Without this the root serves the OLD site, which is the one thing a
  // review link must never open with. Guarded by an env var so merging
  // this branch can never redirect the real itairotem.com away from home.
  async redirects() {
    if (process.env.LAB_PREVIEW !== '1') return [];
    return [
      { source: '/', destination: '/lab', permanent: false },
    ];
  },
};

export default nextConfig;
