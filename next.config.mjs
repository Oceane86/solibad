import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            "@locales": path.resolve(process.cwd(), "locales"),
        };
        return config;
    },
};

export default nextConfig;
