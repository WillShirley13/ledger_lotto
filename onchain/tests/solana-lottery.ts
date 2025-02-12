import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolanaLottery } from "../target/types/solana_lottery";
import web3, { Keypair, TransactionError} from "@solana/web3.js";
import { expect, assert } from "chai";
import { publicKey } from "@coral-xyz/anchor/dist/cjs/utils";


describe("solana-lottery", () => {
	// Configure the client to use the local cluster.
	const provider = anchor.AnchorProvider.env();
	anchor.setProvider(provider);

	const program = anchor.workspace.SolanaLottery as Program<SolanaLottery>;

    const LOTTERY_VAULT_SEED = Buffer.from("LotteryVault");
    const PROTOCOL_TREASURY_SEED = Buffer.from("ProtocolTreasury");

    const [lotteryVaultPda] = web3.PublicKey.findProgramAddressSync(
        [LOTTERY_VAULT_SEED],
        program.programId
    );
    const [protocolTreasuryPda] = web3.PublicKey.findProgramAddressSync(
        [PROTOCOL_TREASURY_SEED],
        program.programId
    );

    const LAMPORTS_PER_SOL = web3.LAMPORTS_PER_SOL;
    console.log(`provider.wallet.publicKey: ${provider.wallet.publicKey}`);

    before(async () => {
        const lotteryVaultTx = await program.methods
			.initLotteryVault()
			.accounts({
				authority: provider.wallet.publicKey,
			})
			.signers([]) // Add this if there are no additional signers
			.rpc();

        let lotteryVault = await program.account.lotteryVault.fetch(
            lotteryVaultPda
        );
        console.log(`lotteryVault initial size: ${(await program.account.lotteryVault.getAccountInfo(lotteryVaultPda)).data.byteLength}\n`);
        for (let i = 0; i < 5; i++) {
            const reallocTx = await program.methods
                .reallocLotteryVault()
                .accounts({
                    authority: provider.wallet.publicKey,
                })
                .rpc();
        }
        console.log(`lotteryVault size after realloc: ${(await program.account.lotteryVault.getAccountInfo(lotteryVaultPda)).data.byteLength}\n`);

        const protocolTreasuryTx = await program.methods
			.initProtocolTreasury()
			.accounts({
				authority: provider.wallet.publicKey,
			})
			.signers([]) // Add this if there are no additional signers
			.rpc();
        
        const airdropSignature = await provider.connection.requestAirdrop(lotteryVaultPda, LAMPORTS_PER_SOL * 1);
        await provider.connection.confirmTransaction(airdropSignature);
    });

	it("Initializes the lottery vault", async () => {
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

    it("Initializes the protocol treasury", async () => {
        const protocolTreasury = await program.account.protocolTreasury.fetch(protocolTreasuryPda);
        console.log(`protocolTreasury: ${JSON.stringify(protocolTreasury, null, 2)}\n`);

        expect(protocolTreasury.authority.toString()).to.equal(provider.wallet.publicKey.toString());
        expect(protocolTreasury.revenue.toNumber(), "Revenue should be 0").to.equal(0);
        expect(protocolTreasury.exists, "Protocol treasury should exist").to.be.true;
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

        const tx = await program.methods.purchaseTicket(numTickets).accounts({
            player: user.publicKey,
        }).signers([user]).rpc();

        const lotteryVault = await program.account.lotteryVault.fetch(
            lotteryVaultPda
        );

        console.log(`lotteryVault: ${JSON.stringify(lotteryVault, null, 2)}\n`);
        expect(lotteryVault.prizePool.toNumber(), "Prize pool should be 10000000").to.equal((LAMPORTS_PER_SOL * 0.01) * numTickets.toNumber());
        expect(lotteryVault.totalTicketsSold.toNumber(), "Total tickets sold should be 10").to.equal(numTickets.toNumber());
        expect(lotteryVault.nextTicketId, "Next ticket id should be 2").to.equal(11);
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
            console.log(`error: ${error}`);
            expect(error).to.be.an('error');
            // You can also check for specific error message if needed
            // expect(error.message).to.include('Your specific error message');
        }
    });

    it("Account size reallocation at 190 players", async () => {
        for (let i = 0; i < 30; i++) {
            const user = Keypair.generate();
            const airdropSignature = await provider.connection.requestAirdrop(user.publicKey, LAMPORTS_PER_SOL * 1);
            // Wait for airdrop confirmation
            await provider.connection.confirmTransaction(airdropSignature);
            const tx = await program.methods.purchaseTicket(new anchor.BN(1)).accounts({
                player: user.publicKey,
            }).signers([user]).rpc();
            await provider.connection.confirmTransaction(tx);
            if ([1, 10, 29].includes(i)) {
                const lotteryVaultAccInfo = await provider.connection.getAccountInfo(lotteryVaultPda);
                console.log(`lottery Vault Acc Size(@${i} players): ${lotteryVaultAccInfo?.data.length}`);
            }
        }
        const lotteryVault = await program.account.lotteryVault.fetch(
            lotteryVaultPda
        );
        // expect(lotteryVault.participants.length, "Participants should be 200").to.equal(202);
        // expect(lotteryVault.totalTicketsSold.toNumber(), "Total tickets sold should be 200").to.equal(220);
        // expect(lotteryVault.nextTicketId, "Next ticket id should be 201").to.equal(221);
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
        console.log(`selectWinnersTx: ${selectWinnersTx}`);

        await provider.connection.confirmTransaction(selectWinnersTx);
        lotteryVault = await program.account.lotteryVault.fetch(
            lotteryVaultPda
        );
        let winningPlayers = lotteryVault.latestLotoWinners;

        const players = [winningPlayers.firstPlace, winningPlayers.secondPlace, winningPlayers.thirdPlace];
        for (const player of players) {
            const balance = await provider.connection.getBalance(player);
            console.log(`Player ${player.toString()} balance (before payout): ${balance / LAMPORTS_PER_SOL} SOL`);
        }
        
        let protocolTreasuryBalance = await provider.connection.getBalance(protocolTreasuryPda);
        console.log(`protocolTreasury before payout: ${protocolTreasuryBalance / LAMPORTS_PER_SOL} SOL\n`);

        console.log(`lotteryVault before payout: ${await provider.connection.getBalance(lotteryVaultPda) / LAMPORTS_PER_SOL} SOL\n`);

        const payoutTx = await program.methods.lotteryPayout().accounts({
            authority: provider.wallet.publicKey,
            firstWinner: winningPlayers.firstPlace,
            secondWinner: winningPlayers.secondPlace,
            thirdWinner: winningPlayers.thirdPlace,
            systemProgram: web3.SystemProgram.programId,
        }).rpc();
        await provider.connection.confirmTransaction(payoutTx);

        console.log()
        for (const player of players) {
            const balance = await provider.connection.getBalance(player);
            console.log(`Player ${player.toString()} balance (after payout): ${balance / LAMPORTS_PER_SOL} SOL`);
        }

        protocolTreasuryBalance = await provider.connection.getBalance(protocolTreasuryPda);
        console.log(`protocolTreasury: ${protocolTreasuryBalance / LAMPORTS_PER_SOL} SOL\n`);

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
