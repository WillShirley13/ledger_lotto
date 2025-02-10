'use client';

import React, { createContext, useMemo } from "react";
import {
	ConnectionProvider,
	WalletProvider,
	useConnection,
    useAnchorWallet,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { AnchorProvider, setProvider, Program} from "@coral-xyz/anchor";
import type { SolanaLottery} from "../../../onchain/target/types/solana_lottery";
import idl from "../../../onchain/target/idl/solana_lottery.json";

export const ProgramProviderContext = createContext<{
    provider: AnchorProvider | null;
    program: Program<SolanaLottery> | null;
} | null>(null);

export function Providers({ children }: { children: React.ReactNode }) {
	const endpoint = "http://127.0.0.1:8899";
	const wallets = useMemo(() => [], []);

	return (
		<ConnectionProvider endpoint={endpoint}>
			<WalletProvider wallets={wallets}>
				<WalletModalProvider>
					<ProgramProviderWithWallet>
						{children}
					</ProgramProviderWithWallet>
				</WalletModalProvider>
			</WalletProvider>
		</ConnectionProvider>
	);
}

function ProgramProviderWithWallet({ children }: { children: React.ReactNode }) {
	const { provider, program } = useAnchorProvider();
	return (
		<ProgramProviderContext.Provider value={{ provider, program }}>
			{children}
		</ProgramProviderContext.Provider>
	);
}

export function useAnchorProvider() : {provider: AnchorProvider | null, program: Program<SolanaLottery>} {
	const { connection } = useConnection();
	const wallet = useAnchorWallet();

	if (!wallet) {
        const program = new Program<SolanaLottery>(idl as SolanaLottery, {connection});
        return { program, provider: null};
    }

	const provider = new AnchorProvider(
		connection,
		wallet,
		{
			commitment: "confirmed",
		}
	);

	setProvider(provider);
    const program = new Program<SolanaLottery>(idl as SolanaLottery, provider)

	return { provider, program };
}