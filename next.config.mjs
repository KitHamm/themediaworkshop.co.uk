/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
	async headers() {
		return isProd
			? [
					{
						// matching all API routes
						source: "/api/:path*",
						headers: [
							{
								key: "Access-Control-Allow-Credentials",
								value: "true",
							},
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
					{
						source: "/_next/static/:path*",
						headers: [
							{
								key: "Cache-Control",
								value: "public, max-age=31536000, immutable",
							},
						],
					},
					{
						source: "/images/:path*",
						headers: [
							{
								key: "Cache-Control",
								value: "public, max-age=31536000, immutable",
							},
						],
					},
					{
						source: "/favicon.ico",
						headers: [
							{
								key: "Cache-Control",
								value: "public, max-age=31536000, immutable",
							},
						],
					},
			  ]
			: [
					{
						// matching all API routes
						source: "/api/:path*",
						headers: [
							{
								key: "Access-Control-Allow-Credentials",
								value: "true",
							},
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
	images: {
		minimumCacheTTL: 31536000, // Cache for 1 year
		disableStaticImages: true,
		remotePatterns: [
			{
				protocol: "https",
				hostname: "staging.themediaworkshop.co.uk",
				pathname: "**",
			},
			{
				protocol: "https",
				hostname: "themediaworkshop.co.uk",
				pathname: "**",
			},
			{
				protocol: "https",
				hostname: "tmw-website-media.lon1.cdn.digitaloceanspaces.com",
				pathname: "**",
			},
			{
				protocol: "http",
				hostname: "localhost",
				pathname: "**",
			},
		],
	},
	experimental: {
		serverComponentsExternalPackages: ["@prisma/client", "bcrypt"],
		serverActions: {
			bodySizeLimit: "300mb",
		},
	},
};

export default nextConfig;
