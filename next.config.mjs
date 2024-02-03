/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                // matching all API routes
                source: "/api/:path*",
                headers: [
                    { key: "Access-Control-Allow-Credentials", value: "true" },
                    { key: "Access-Control-Allow-Origin", value: "*" }, // replace this your actual origin
                    {
                        key: "Access-Control-Allow-Methods",
                        value: "GET,DELETE,PATCH,POST,PUT",
                    },
                    {
                        key: "Access-Control-Allow-Headers",
                        value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
                    },
                ],
            },
        ];
    },
    remotePatterns: [
        {
            protocol: "https",
            hostname: "staging.themediaworkshop.co.uk",
            pathname: "**",
        },
    ],
    experimental: {
        serverComponentsExternalPackages: ["@prisma/client", "bcrypt"],
    },
    // publicRuntimeConfig: {
    //     NEXT_PUBLIC_BASE_VIDEO_URL: process.env.NEXT_PUBLIC_BASE_VIDEO_URL,
    //     NEXT_PUBLIC_BASE_IMAGE_URL: process.env.NEXT_PUBLIC_BASE_IMAGE_URL,
    // },
};

export default nextConfig;
