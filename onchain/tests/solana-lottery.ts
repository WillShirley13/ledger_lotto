import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolanaLottery } from "../target/types/solana_lottery";
import web3, { Keypair, LAMPORTS_PER_SOL, TransactionError} from "@solana/web3.js";
import { expect, assert } from "chai";
import { publicKey } from "@coral-xyz/anchor/dist/cjs/utils";


describe("solana-lottery", () => {
	// Configure the client to use the local cluster.
	const provider = anchor.AnchorProvider.env();
	anchor.setProvider(provider);
	const program = anchor.workspace.SolanaLottery as Program<SolanaLottery>;


    const LOTTERY_VAULT_SEED = Buffer.from("LotteryVault");
    const [lotteryVaultPda] = web3.PublicKey.findProgramAddressSync(
        [LOTTERY_VAULT_SEED],
        program.programId
    );
    const protocolTreasury = new web3.PublicKey("ADPYX1FrWLgKwVQ1k2TndirR9nFJGRJWMifT8eoCxU9D");
    console.log(`provider publicKey: ${provider.wallet.publicKey}`);

    async function initPayout(winningTickets: number[]) {
        // call selectWinners instruction
        let selectWinnersTx = await program.methods.selectWinners(winningTickets).accounts({
            authority: provider.wallet.publicKey,
        }).rpc();
        await provider.connection.confirmTransaction(selectWinnersTx);

        const lotteryVault = await program.account.lotteryVault.fetch(
            lotteryVaultPda
        );

        const winningPlayers = lotteryVault.latestLotoWinners;
        console.log(`winningPlayers: ${JSON.stringify(winningPlayers, null, 2)}\n`);

        let payoutTx = await program.methods.lotteryPayout().accounts({
            authority: provider.wallet.publicKey,
            protocolTreasury: protocolTreasury,
            firstWinner: winningPlayers.firstPlace,
            secondWinner: winningPlayers.secondPlace,
            thirdWinner: winningPlayers.thirdPlace,
        }).rpc();
        await provider.connection.confirmTransaction(payoutTx);

        console.log(`LOTTERY PAYOUT SUCCESSFUL (${payoutTx})`);
    }

    before(async () => {
        const lotteryVaultTx = await program.methods
			.initLotteryVault(17391456)
			.accounts({
				authority: provider.wallet.publicKey,
                protocolTreasury: protocolTreasury,
			})
			.signers([]) // Add this if there are no additional signers
			.rpc();
        console.log("Lottery vault init tx: ", lotteryVaultTx);
        
        console.log(`lotteryVault initial size: ${(await program.account.lotteryVault.getAccountInfo(lotteryVaultPda)).data.byteLength}\n`);
        for (let i = 0; i < 5; i++) {
            await program.methods
                .reallocLotteryVault()
                .accounts({
                    authority: provider.wallet.publicKey,
                })
                .rpc();
        }
        console.log(`lotteryVault size after realloc: ${(await program.account.lotteryVault.getAccountInfo(lotteryVaultPda)).data.byteLength}\n`);

        
        const airdropSignature = await provider.connection.requestAirdrop(lotteryVaultPda, LAMPORTS_PER_SOL * 1);
        await provider.connection.confirmTransaction(airdropSignature);
    });

	it("Check the lottery vault after init", async () => {
        const lotteryVault = await program.account.lotteryVault.fetch(
            lotteryVaultPda
        );
        console.log(`lotteryVault: ${JSON.stringify(lotteryVault, null, 2)}\n`);

		expect(lotteryVault.authority.toString()).to.equal(
			provider.wallet.publicKey.toString()
		);
		expect(lotteryVault.prizePool.toNumber(), "Prize pool should be 0").to.equal(0);
		expect(lotteryVault.participants, "Participants should be empty").to.be.empty;
		expect(lotteryVault.totalTicketsSold.toNumber(), "Total tickets sold should be 0").to.equal(0);
		expect(lotteryVault.latestLotoWinners, "Latest loto winners should be empty").to.deep.equal({
			firstPlace: null,
            firstPlaceAmount: null,
			secondPlace: null,
            secondPlaceAmount: null,
			thirdPlace: null,
            thirdPlaceAmount: null,
		});
        expect(lotteryVault.exists, "Lottery vault should exist").to.be.true;
	});


    it("Purchase 10 tickets", async () => {
        const user = Keypair.generate();
        console.log(`user: ${user.publicKey}`);
        const airdropSignature = await provider.connection.requestAirdrop(user.publicKey, LAMPORTS_PER_SOL * 1);
        // Wait for airdrop confirmation
        await provider.connection.confirmTransaction(airdropSignature);
        
        const userBalance = await provider.connection.getBalance(user.publicKey);
        console.log(`userBalance: ${userBalance}`);
        const numTickets = new anchor.BN(10);

        const purchaseTx = await program.methods.purchaseTicket(numTickets).accounts({
            player: user.publicKey,
        }).signers([user]).rpc();

        const lotteryVault = await program.account.lotteryVault.fetch(
            lotteryVaultPda
        );

        console.log(`lotteryVault: ${JSON.stringify(lotteryVault, null, 2)}\n`);
        expect(lotteryVault.prizePool.toNumber(), "Prize pool should be 10000000").to.equal((LAMPORTS_PER_SOL * 0.01) * numTickets.toNumber());
        expect(lotteryVault.totalTicketsSold.toNumber(), "Total tickets sold should be 10").to.equal(numTickets.toNumber());
        expect(lotteryVault.nextTicketId, "Next ticket id should be 2").to.equal(11);

        await provider.connection.confirmTransaction(purchaseTx);
        await initPayout([1, 2, 3]);
    });

    it("Purchase too many tickets", async () => {
        const user = Keypair.generate();
        console.log(`user: ${user.publicKey}`);
        const airdropSignature = await provider.connection.requestAirdrop(user.publicKey, LAMPORTS_PER_SOL * 1);
        // Wait for airdrop confirmation
        await provider.connection.confirmTransaction(airdropSignature);
        
        const userBalance = await provider.connection.getBalance(user.publicKey);
        console.log(`userBalance: ${userBalance}`);
        const numTickets = new anchor.BN(10);

        // First purchase should succeed
        await program.methods.purchaseTicket(numTickets).accounts({
            player: user.publicKey,
        }).signers([user]).rpc();

        // Second purchase should fail
        try {
            await program.methods.purchaseTicket(numTickets).accounts({
                player: user.publicKey,
            }).signers([user]).rpc();
            assert.fail("Expected an error but transaction succeeded");
        } catch (error) {
            await initPayout([1,2,3]);
            console.log(`error: ${error}`);
            expect(error).to.be.an('error');
        }
    });

    it("10 players, purchase 6 ticket each", async () => {
        for (let i = 0; i < 10; i++) {
            const user = Keypair.generate();
            const airdropSignature = await provider.connection.requestAirdrop(user.publicKey, LAMPORTS_PER_SOL * 1);
            // Wait for airdrop confirmation
            await provider.connection.confirmTransaction(airdropSignature);
            const tx = await program.methods.purchaseTicket(new anchor.BN(6)).accounts({
                player: user.publicKey,
            }).signers([user]).rpc();
            await provider.connection.confirmTransaction(tx);
        }
        const lotteryVault = await program.account.lotteryVault.fetch(
            lotteryVaultPda
        );
        expect(lotteryVault.participants.length, "Participants should be 10").to.equal(10);
        expect(lotteryVault.totalTicketsSold.toNumber(), "Total tickets sold should be 60").to.equal(60);
        expect(lotteryVault.nextTicketId, "Next ticket id should be 61").to.equal(61);

        await initPayout([10, 44, 49]);
    });

    it("Lottery payout", async () => {
        let lotteryVault = await program.account.lotteryVault.fetch(
            lotteryVaultPda
        );
        let prizePool = lotteryVault.prizePool.toNumber();
        console.log(`lotteryVault prizePool: ${prizePool / LAMPORTS_PER_SOL} SOL\n`);

        // 'random' winning tickets
        const winningTickets = [1, 20, 38];
        
        // call selectWinners instruction
        const selectWinnersTx = await program.methods.selectWinners(winningTickets).accounts({
            authority: provider.wallet.publicKey,
        }).rpc();
        await provider.connection.confirmTransaction(selectWinnersTx);
        console.log(`selectWinnersTx: ${selectWinnersTx}`);

        await provider.connection.confirmTransaction(selectWinnersTx);
        lotteryVault = await program.account.lotteryVault.fetch(
            lotteryVaultPda
        );
        const winningPlayers = lotteryVault.latestLotoWinners;

        const players = [winningPlayers.firstPlace, winningPlayers.secondPlace, winningPlayers.thirdPlace];
        for (const player of players) {
            if (player) {
                const balance = await provider.connection.getBalance(player);
                console.log(`Player ${player.toString()} balance (before payout): ${balance / LAMPORTS_PER_SOL} SOL`);
            }
        }
        
        // Check protocol treasury balance before payout
        console.log(`protocolTreasury before payout: ${await provider.connection.getBalance(protocolTreasury) / LAMPORTS_PER_SOL} SOL\n`);
        // Check lottery vault balance before payout
        console.log(`lotteryVault before payout: ${await provider.connection.getBalance(lotteryVaultPda) / LAMPORTS_PER_SOL} SOL\n`);

        const payoutTx = await program.methods.lotteryPayout().accounts({
            authority: provider.wallet.publicKey,
            protocolTreasury: protocolTreasury,
            firstWinner: winningPlayers.firstPlace,
            secondWinner: winningPlayers.secondPlace,
            thirdWinner: winningPlayers.thirdPlace,
        }).rpc();
        await provider.connection.confirmTransaction(payoutTx);

        console.log()
        for (const player of players) {
            if (player) {
                const balance = await provider.connection.getBalance(player);
                console.log(`Player ${player.toString()} balance (after payout): ${balance / LAMPORTS_PER_SOL} SOL`);
            }
        }

        // Check protocol treasury balance after payout
        console.log(`protocolTreasury: ${await provider.connection.getBalance(protocolTreasury) / LAMPORTS_PER_SOL} SOL\n`);

        lotteryVault = await program.account.lotteryVault.fetch(
            lotteryVaultPda
        );

        prizePool = lotteryVault.prizePool.toNumber();
        console.log(`lotteryVault prizePool: ${prizePool / LAMPORTS_PER_SOL} SOL\n`);
        console.log(`lotteryVault after payout: ${await provider.connection.getBalance(lotteryVaultPda) / LAMPORTS_PER_SOL} SOL\n`);
        console.log(`lotteryVault participants after payout: ${lotteryVault.participants.length}\n`);
        console.log(`lotteryVault next ticket id after payout: ${lotteryVault.nextTicketId}\n`);
        
    });
});
