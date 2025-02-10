'use client';

import React from "react";
import { Doto } from "next/font/google";
import Link from "next/link";
import TwitterIcon from '@mui/icons-material/Twitter';

const doto = Doto({
    subsets: ["latin"],
    weight: ["400", "700"],
    variable: '--font-doto',
});

const Footer = () => {
    const [year] = React.useState(() => "2025");

    return (
        <footer className="mt-5">
            <div className="w-full border-t border-white"></div>
            <div className="@container mx-auto p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* About Section */}
                    <div>
                        <h3 className={`${doto.className} text-xl font-bold mb-4 header-text`}>
                            About LedgerLotto
                        </h3>
                        <p className="text-white text-sm">
                            A decentralized lottery platform built on Solana.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className={`${doto.className} text-xl font-bold mb-4 header-text`}>
                            Quick Links
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="https://faucet.solana.com/" className="text-white hover:text-[var(--secondary)] text-sm">
                                    Solana devnet SOL faucet
                                </Link>
                            </li>
                            <li>
                                <Link href="/faq" className="text-white hover:text-[var(--secondary)] text-sm">
                                    FAQ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Social & Contact */}
                    <div>
                        <h3 className={`${doto.className} text-xl font-bold mb-4 header-text`}>
                            Connect With Us
                        </h3>
                        <div className="flex space-x-4">
                            <a href="[Your Twitter URL]" className="text-white hover:text-[var(--secondary)]">
                                <TwitterIcon />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 pt-4 border-t border-gray-700">
                    <p className="text-center text-sm text-gray-300 hover:text-[var(--secondary)]">
                        © {year} LedgerLotto. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
