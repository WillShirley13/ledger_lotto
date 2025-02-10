"use client";

import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer"
import { Titan_One } from "next/font/google";
import { Providers } from "./components/anchor/Providers";

const titan = Titan_One({
	weight: ["400"],
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {

	return (
		<html lang="en">
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </head>
			<body className={`${titan.className} bg-background`}>
                <Providers> 
                        <Header />
                        {children}
                        <Footer />
                </Providers>
			</body>
		</html>
	);
}
