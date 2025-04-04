"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { FC, useState, useEffect } from "react";
import { Doto } from "next/font/google";

const doto = Doto({
	subsets: ["latin"],
	weight: ["400", "700"],
	variable: '--font-doto',
});

export const ConnectButton: FC = () => {
	const { wallet, connect, disconnect, connected } = useWallet();
	const { setVisible } = useWalletModal();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const handleClick = (): void => {
		if (!wallet) {
			setVisible(true);
		} else if (!connected) {
			connect().catch(() => {});
		} else {
			disconnect().catch(() => {});
		}
	};

	if (!mounted) {
		return (
			<button
				className={`${doto.className} xs:mt-2 md:mt-0 sm:text-xl lg:text-2xl font-bold header-text header-route-link md:ml-auto`}
			>
				Connect
			</button>
		);
	}

	return (
		<button
			onClick={handleClick}
			className={`${doto.className} xs:mt-2 md:mt-0 sm:text-xl lg:text-2xl font-bold header-text header-route-link md:ml-auto`}
		>
			{!wallet ? "Select Wallet" : !connected ? "Connect" : "Disconnect"}
		</button>
	);
};
