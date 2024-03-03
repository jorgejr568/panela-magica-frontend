/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    transpilePackages: ['@mdxeditor/editor'],
    webpack: (config) => {
        // this will override the experiments
        config.experiments = {...config.experiments, topLevelAwait: true}
        // this will just update topLevelAwait property of config.experiments
        // config.experiments.topLevelAwait = true
        return config
    },
    images: {
        // domains: ['http://localhost:8000'],
        remotePatterns: [
            {
                hostname: 'localhost',
            }
        ]
    },
};

export default nextConfig;
