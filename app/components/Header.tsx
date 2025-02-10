'use client';

import React from "react";
import { Doto } from "next/font/google";
import Link from "next/link";
import LocalActivityRoundedIcon from '@mui/icons-material/LocalActivityRounded';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import "@solana/wallet-adapter-react-ui/styles.css";
import { ConnectButton } from "./ConnectButton";


const doto = Doto({
	subsets: ["latin"],
	weight: ["400", "700"],
	variable: '--font-doto',
});

const header = () => {
	return (
		<div>
			<div className="@container mx-auto flex flex-col md:flex-row items-center p-4 md:p-6">
				<Link href="/" className="mb-4 md:mb-0 ">
					<h1 className={`${doto.className} sm:text-4xl md:text-5xl lg:text-6xl font-extrabold header-text`}>
						LedgerLotto
					</h1>
				</Link>
				<div className="flex space-x-6 md:ml-5 lg:mx-10">
					<Link href="/tickets" className="flex items-center">
						<h2 className={`${doto.className} sm:text-xl lg:text-2xl font-bold header-text header-route-link`}>
							Tickets
                            <LocalActivityRoundedIcon className="ml-1" />
						</h2>
					</Link>
					<Link href="/faq" className="flex items-center">
						<h2 className={`${doto.className} sm:text-xl lg:text-2xl font-bold header-text header-route-link`}>
							FAQ
                            <HelpOutlineRoundedIcon className="ml-1" />
						</h2>
					</Link>
				</div>  
                    <ConnectButton />
			</div>
			<div className="w-full my-4 border-t border-white"></div>
		</div>
        
	);
};

export default header;
