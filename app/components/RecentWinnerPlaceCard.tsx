import React from "react";
import { BN } from "@coral-xyz/anchor";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";
const RecentWinnerPlaceCard = ({
    place,
    winner,
    amount,
    badge,
}: {
    place: string;
    winner: PublicKey | null;
    amount: BN | null;
    badge: string;
}) => {
    return (
		<div className="place-card rounded-lg p-4">
			<div className="flex items-center justify-center mb-3">
				<span className="text-orange-500 text-4xl mr-2">{badge}</span>
				<h3 className="text-xl primary-color">{place}</h3>
			</div>
			<div className="space-y-2">
				<p className="text-center font-mono bg-white/50 rounded p-2 break-all">
					{winner ? winner.toBase58() : "No winner yet"}
				</p>
				<p className="text-center text-lg text-white">
					{amount
						? `${amount.toNumber() / LAMPORTS_PER_SOL} SOL`
						: "Prize TBA"}
				</p>
			</div>
		</div>
	);
};

export default RecentWinnerPlaceCard;
