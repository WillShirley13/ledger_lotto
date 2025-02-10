"use client";
import { useContext, useEffect, useState } from "react";
import { ProgramProviderContext } from "./anchor/Providers";
import { PublicKey } from "@solana/web3.js";

function TimeChecker() {
	const context = useContext(ProgramProviderContext);
	const program = context?.program;
	const provider = context?.provider;
	const [targetTimestamp, setTargetTimestamp] = useState(1739145600); // Initial timestamp

	useEffect(() => {
		const checkTime = async () => {
			try {
				if (!program || !provider) return;
				
				const currentTime = Math.floor(Date.now() / 1000);
				if (currentTime < targetTimestamp) return;

				// Get lottery vault PDA
				const [lotteryVaultPda] = PublicKey.findProgramAddressSync(
					[Buffer.from("LotteryVault")],
					program.programId
				);

				// Fetch lottery vault data
				let lotteryVault = await program.account.lotteryVault.fetch(
					lotteryVaultPda
				);

				// Generate winning tickets (assuming 3 winners)
				const winningTickets = Array.from({ length: 3 }, () => 
					Math.floor(Math.random() * lotteryVault.totalTicketsSold.toNumber())
				);

				// Select winners
				const selectWinnersTx = await program.methods
					.selectWinners(winningTickets)
					.accounts({
						authority: provider.wallet.publicKey,
						lotteryVault: lotteryVaultPda,
					})
					.rpc();

				await provider.connection.confirmTransaction(selectWinnersTx);

				// Process payout
				const payoutTx = await program.methods
					.lotteryPayout()
					.accounts({
						authority: provider.wallet.publicKey,
						lotteryVault: lotteryVaultPda,
						protocolTreasury: protocolTreasuryPda, //REMOVE THIS, SEND TO PERSONLA ACCOUNT
						firstWinner: lotteryVault.latestLotoWinners.firstPlace,
						secondWinner: lotteryVault.latestLotoWinners.secondPlace,
						thirdWinner: lotteryVault.latestLotoWinners.thirdPlace,
					})
					.rpc();

				await provider.connection.confirmTransaction(payoutTx);

				// Update the target timestamp for the next check
				setTargetTimestamp(lotteryVault.finishTime);
				console.log("Lottery payout completed! Next target:", lotteryVault.finishTime);
			} catch (error) {
				console.error("Error processing lottery payout:", error);
			}
		};

		// Check every 5 seconds
		const interval = setInterval(checkTime, 5000);

		// Initial check
		checkTime();

		// Cleanup
		return () => clearInterval(interval);
	}, [program, provider, targetTimestamp]); // Add dependencies

	return null;
}
