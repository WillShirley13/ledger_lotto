"use client"

import React, { useState, useEffect, useContext } from 'react'
import { PublicKey } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';
import RecentWinnerPlaceCard from './RecentWinnerPlaceCard';
import HowLedgerLottoWorks from './HowLedgerLottoWorks';
import { ProgramProviderContext } from "./anchor/Providers";


const RecentWinners = () => {
    const context = useContext(ProgramProviderContext);
    const program = context?.program;
    const [winners, setWinners] = useState<{
        firstPlace: PublicKey | null;
        firstPlaceAmount: BN | null;
        secondPlace: PublicKey | null;
        secondPlaceAmount: BN | null;
        thirdPlace: PublicKey | null;
        thirdPlaceAmount: BN | null;
    }>({
        firstPlace: null,
        firstPlaceAmount: null,
        secondPlace: null,
        secondPlaceAmount: null,
        thirdPlace: null,
        thirdPlaceAmount: null
    })

    useEffect(() => {
        const fetchWinners = async () => {
            if (!program) { return; }
            const [lotteryVaultPDA] = PublicKey.findProgramAddressSync([Buffer.from("LotteryVault")], program.programId);
            const lotteryVault = await program.account.lotteryVault.fetch(lotteryVaultPDA);
            const winners = lotteryVault.latestLotoWinners;
            setWinners({
                firstPlace: winners.firstPlace,
                firstPlaceAmount: winners.firstPlaceAmount ? new BN(winners.firstPlaceAmount) : null,
                secondPlace: winners.secondPlace,
                secondPlaceAmount: winners.secondPlaceAmount ? new BN(winners.secondPlaceAmount) : null,
                thirdPlace: winners.thirdPlace,
                thirdPlaceAmount: winners.thirdPlaceAmount ? new BN(winners.thirdPlaceAmount) : null
            })
        }

        fetchWinners()
    }, [program])
    return (
        <div className='md:flex md:flex-row flex-col items-top justify-center mt-6 px-20'>
            <div className='landing-page-boarder flex-1 md:w-1/2 p-5 mt-5 md:mr-10'>
                <h2 className='primary-color text-center text-3xl mb-8'>Recent Winners 🏆</h2>
                <div className='space-y-6'>
                    {/* First Place Card */}
                    <RecentWinnerPlaceCard place="First Place" winner={winners.firstPlace} amount={winners.firstPlaceAmount} badge="🥇" />
                    {/* Second Place Card */}
                    <RecentWinnerPlaceCard place="Second Place" winner={winners.secondPlace} amount={winners.secondPlaceAmount} badge="🥈" />
                    {/* Third Place Card */}
                    <RecentWinnerPlaceCard place="Third Place" winner={winners.thirdPlace} amount={winners.thirdPlaceAmount} badge="🥉" />
                </div>
            </div>
            <HowLedgerLottoWorks />
        </div>
    )
}

export default RecentWinners;