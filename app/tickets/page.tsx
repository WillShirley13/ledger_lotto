"use client";

import React, { useState, useEffect, useCallback, useContext } from "react";
import { PublicKey } from "@solana/web3.js";
import { ProgramProviderContext } from "../components/anchor/Providers";
import BuyTickets from "../components/BuyTickets";
import UserTickets from "../components/UserTickets";
import CurrentParticipants from "../components/CurrentParticipants";

const Tickets = () => {
	const [tickets, setTickets] = useState<number[] | null>(null);
	const context = useContext(ProgramProviderContext);
	const provider = context?.provider;
	const program = context?.program;

	const setUserTickets = useCallback(async () => {
		if (program && provider?.wallet) {
			const [lotteryVaultPDA] = PublicKey.findProgramAddressSync(
				[Buffer.from("LotteryVault")],
				program.programId
			);
			const lotteryVault = await program.account.lotteryVault.fetch(
				lotteryVaultPDA
			);
			console.log(lotteryVaultPDA);
			console.log(lotteryVault);
			const participants = lotteryVault.participants;
			for (const participant of participants) {
				if (
					participant.pubkey.toBase58() ===
					provider.wallet.publicKey.toBase58()
				) {
					setTickets(Array.from(participant.ticketNumbers));
				}
			}
		}
	}, [provider?.wallet, program]);

	// Fetch tickets when the user connects their wallet
	useEffect(() => {
		setUserTickets();
	}, [provider?.publicKey, setUserTickets]);

	// Fetch tickets when the user's account changes
	provider?.connection.onAccountChange(
		provider.wallet.publicKey,
		async () => {
			setUserTickets();
		}
	);

	return (
		<div className="flex flex-col">
			<div className="container flex flex-col md:flex-row flex-shrink items-start justify-evenly py-4 mt-20 mx-auto">
				<UserTickets tickets={tickets} />
				<BuyTickets tickets={tickets} />
			</div>
			<div className="container py-4 mx-auto align-top ">
				<CurrentParticipants/>
			</div>
		</div>
	);
};

export default Tickets;
