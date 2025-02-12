import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	env: {
		NEXT_PUBLIC_LOTTERY_KEYPAIR: process.env.NEXT_PUBLIC_LOTTERY_KEYPAIR,
	},
};

export default nextConfig;
