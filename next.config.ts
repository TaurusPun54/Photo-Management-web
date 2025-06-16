import type { NextConfig } from "next";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'smart-photo-management-system-photo-binary-bucket.s3.amazonaws.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
    webpack(config) {
        config.plugins.push(new MiniCssExtractPlugin());
        return config;
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '10mb',
        },
    },
};

export default nextConfig;
