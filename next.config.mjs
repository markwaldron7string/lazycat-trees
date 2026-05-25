import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: false, // workaround for Next.js 16 + Node.js compression module bug
  turbopack: {
    root: __dirname, // Fix: Next.js was picking up ~/pnpm-lock.yaml and using HOME as workspace root
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
