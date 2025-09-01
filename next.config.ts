import type { NextConfig } from "next";

const nextConfig = {
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'goodchickenusa.com' }
        ]
    }
};

export default nextConfig;
