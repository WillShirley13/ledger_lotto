import React from "react";

const HowLedgerLottoWorks = () => {
	return (
        <div className='landing-page-boarder flex-1 md:w-1/2 p-5 mt-5 md:ml-10'>
            <h2 className='primary-color text-center text-3xl mb-6'>How does LedgerLotto work?</h2>
            <div className='space-y-4'>
                <p className='text-lg mx-2 leading-relaxed'>
                    LedgerLotto is a decentralized lottery app built on Solana.
                </p>
                <ul className='text-lg leading-relaxed space-y-2'>
                    <li className='mx-2'>• Each lottery runs weekly from Sunday 12:00 AM UTC for 7 days</li>
                    <li className='mx-2'>• Maximum 10 tickets per address</li>
                    <li className='mx-2'>• Ticket cost: 0.01 SOL</li>
                    <li className='mx-2'>• Winners are randomly selected at the end of each week</li>
                    <li className='mx-2'>• Winnings are automatically distributed to winners</li>
                </ul>
                <p className='text-lg mx-2 leading-relaxed italic'>
                    Visit our FAQ page to learn more about the selection process and lottery mechanics.
                </p>
            </div>
        </div>
	);
};

export default HowLedgerLottoWorks;
