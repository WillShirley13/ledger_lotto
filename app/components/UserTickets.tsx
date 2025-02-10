import React, { useContext } from "react";
import { ProgramProviderContext } from "./anchor/Providers";

const UserTickets = (props: { tickets: number[] | null }) => {
	const context = useContext(ProgramProviderContext);
	const provider = context?.provider;

	return (
		<div className="flex flex-col items-center justify-center p-6 m-6 md:p-8 md:m-4 rounded-2xl bg-opacity-10 bg-white backdrop-blur-sm border border-white/10 shadow-lg hover:bg-opacity-15 transition-all duration-300">
			<h2 className="primary-color text-4xl lg:text-6xl font-bold tracking-wide mb-8">
				Tickets
			</h2>
			<div className="w-full space-y-8=6">
				<h3 className="text-white/90 text-lg px-6 py-3 rounded-lg bg-black/20 backdrop-blur-sm border border-white/5">
					{provider?.wallet ? (
						<span className="flex items-center justify-center gap-2">
							<span className="text-white/50">Wallet:</span>
							{`${provider.wallet.publicKey
								.toBase58()
								.slice(0, 4)}...${provider.wallet.publicKey
								.toBase58()
								.slice(-4)}`}
						</span>
					) : (
						"No wallet connected"
					)}
				</h3>
				<h3 className="text-white/90 text-lg px-6 py-4 rounded-lg bg-black/20 backdrop-blur-sm border border-white/5">
					{props.tickets && provider?.wallet ? (
						<div className="space-y-2">
							<div className="flex flex-wrap gap-2 justify-center">
								<div className="text-white/50 text-sm text-center pt-2">
									Your tickets:
								</div>
								{props.tickets.map((ticket, index) => (
									<span
										key={index}
										className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/15 transition-colors"
									>
										{ticket}
									</span>
								))}
							</div>
							<div className="text-white/50 text-sm text-center pt-2">
								Total Tickets: {props.tickets.length}
							</div>
						</div>
					) : (
						"No tickets purchased for this lottery"
					)}
				</h3>
			</div>
		</div>
	);
};

export default UserTickets;
