import React, { useContext, useEffect, useState } from "react";
import { ProgramProviderContext } from "./anchor/Providers";
import { PublicKey } from "@solana/web3.js";

const CurrentParticipants = () => {
	const [participants, setParticipants] = useState<Array<{
		pubkey: PublicKey;
		ticketNumbers: Buffer;
	}> | null>(null);
	const context = useContext(ProgramProviderContext);
	const program = context?.program;

	useEffect(() => {
		const getParticipants = async () => {
			if (program) {
				const [lotteryVaultPDA] = PublicKey.findProgramAddressSync(
					[Buffer.from("LotteryVault")],
					program.programId
				);
				const lotteryVault = await program.account.lotteryVault.fetch(
					lotteryVaultPDA
				);

				const participants = lotteryVault.participants;
				setParticipants(participants);
			}
		};
        getParticipants();
	}, [program]);
	return (
		<div className="landing-page-boarder flex-col p-5 mt-5 mx-auto w-full max-w-2xl page-text">
			<h2 className="primary-color text-center text-4xl mb-6">
				This week&apos;s participants...
			</h2>
			<div className="flex flex-col w-full max-w-2xl">
				<div className="grid grid-cols-2 gap-4 mb-4 text-2xl">
					<div>Player</div>
					<div>Tickets</div>
				</div>
				{participants?.map((user, index) => (
					<div key={index} className="grid grid-cols-2 gap-4 mb-2 hover:text-[var(--primary)]">
						<div>• {user.pubkey.toString().slice(0, 8)}...</div>
						<div>{user.ticketNumbers.join(' | ')}</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default CurrentParticipants;
