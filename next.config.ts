import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	output: "standalone",
	images: {
		remotePatterns: [
			{ hostname: "cdn.discordapp.com" },
			{ hostname: "imgur.com" },
			{ hostname: "i.imgur.com" },
		],
	},
};

export default nextConfig;
