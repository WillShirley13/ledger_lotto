import React, { useContext } from "react";
import { ProgramProviderContext } from "./anchor/Providers";
import { BN } from "@coral-xyz/anchor";

const BuyTickets = (props: {tickets: number[]|null}) => {
    const context = useContext(ProgramProviderContext);
    const provider = context?.provider;
    const program = context?.program;
    
    const handleBuyTickets = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const ticketCount = parseInt(e.currentTarget.ticketCount.value);
        if (program && provider?.wallet) {
            try {
                const tx = await program.methods.purchaseTicket(new BN(ticketCount)).accounts({
                    player: provider.wallet.publicKey,
                }).rpc();
                console.log(tx);
            } catch (error) {
                console.error(`Error purchasing tickets: ${error}`);
            }
        }
    }
    
	return (
		<div className="flex flex-col items-center justify-center p-6 m-6 md:p-8 md:m-4 rounded-2xl bg-opacity-10 bg-white backdrop-blur-sm border border-white/10 shadow-lg hover:bg-opacity-15 transition-all duration-300">
			<h2 className="primary-color text-4xl lg:text-6xl">Buy Tickets</h2>
			<div className="text-white/90 text-lg m-6 px-6 py-4 rounded-lg bg-black/20 backdrop-blur-sm border border-white/5">
				<form
					className="flex flex-col gap-4"
					onSubmit={handleBuyTickets}
				>
					<div className="flex flex-col gap-2">
						<label htmlFor="ticketCount" className="text-white/70">
							Number of Tickets (Remaining:{" "}
							{10 - (props.tickets?.length || 0)})
						</label>
						<input
							type="number"
							id="ticketCount"
							min={1}
							max={10 - (props.tickets?.length || 0)}
							className="px-4 py-2 rounded-lg bg-black/30 border border-white/10 focus:border-white/30 focus:outline-none"
							disabled={
								!provider?.wallet ||
								(props.tickets?.length || 0) >= 10
							}
						/>
					</div>
					<button
						type="submit"
						className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
						disabled={
							!provider?.wallet || (props.tickets?.length || 0) >= 10
						}
					>
						Purchase Tickets
					</button>
				</form>
			</div>
		</div>
	);
};

export default BuyTickets;
