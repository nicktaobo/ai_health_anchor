import { Keypair, PublicKey } from "@solana/web3.js";
import { init} from "./common";
import * as anchor from "@coral-xyz/anchor";
import { getAssociatedTokenAddressSync, TOKEN_PROGRAM_ID } from "@solana/spl-token";


const { connection, program } = init();


export async function fetchGameConfig() {
    const [gameConfig] = PublicKey.findProgramAddressSync(
        [Buffer.from("game_config")],
        program.programId
      );
    const info = await connection.getAccountInfo(gameConfig, "confirmed");
    console.log("info", JSON.stringify(info, null, 2));
    console.log("game_config", gameConfig.toBase58(), "len=", info?.data.length);
}


export async function fetchConfig() {
    let game_config: PublicKey;
    [game_config] = PublicKey.findProgramAddressSync(
        [
            Buffer.from("game_config")
        ],
        program.programId
    );
    console.log("game_config", game_config.toBase58());
    const config = await program.account.gameConfig.fetch(game_config, "confirmed");
    console.log("roundNumber", config.roundNumber.toNumber());
    console.log("state", config.state);
    console.log("authority", config.authority.toBase58());
    console.log("treasuryUsdtBump", config.treasuryUsdtBump);
    console.log("treasuryHanBump", config.treasuryHanBump);
    console.log("currentKeyPrice", config.currentKeyPrice.toNumber());
    console.log("totalKeyCount", config.totalKeyCount.toNumber());
    console.log("totalShadowCount", config.totalShadowCount.toNumber());
    console.log("endTime", new Date(config.endTime.toNumber() * 1000).toISOString());
    console.log("lastBuyerKey", config.lastBuyerKey.toBase58());
    console.log("jackpotPool", config.jackpotPool.toNumber());
    console.log("dividendPool", config.dividendPool.toNumber());
    console.log("nextRoundPool", config.nextRoundPool.toNumber());
    console.log("leaderboardPool", config.leaderboardPool.toNumber());
    console.log("randomRewardPool", config.randomRewardPool.toNumber());
    console.log("authority", config.authority.toBase58());
}

export async function fetchUserAccount(user: Keypair) {
    let user_account: PublicKey;
    [user_account] = PublicKey.findProgramAddressSync(
        [
            Buffer.from("user_account"),
            user.publicKey.toBuffer(),
        ],
        program.programId
    );
    const userAccount = await program.account.userAccount.fetch(user_account, "confirmed");
    console.log("user_account", user_account.toBase58());
    console.log("userAccount", userAccount);
    console.log("keyCount", userAccount.keyCount.toNumber());
    console.log("totalUsdtSpent", userAccount.totalUsdtSpent.toNumber());
    console.log("totalUsdtEarned", userAccount.totalUsdtEarned.toNumber());
    console.log("totalWithdrawnUsdt", userAccount.totalWithdrawnUsdt.toNumber());
    console.log("lastKeyPurchaseTime", userAccount.lastKeyPurchaseTime.toNumber());
    console.log("bump", userAccount.bump);
}

export async function fetchAllUser() {
    const accounts = await program.account.userAccount.all();
    for (const account of accounts) {
        console.log("account", account.publicKey.toBase58());
        console.log("keyCount", account.account.keyCount.toNumber());
        console.log("totalUsdtSpent", account.account.totalUsdtSpent.toNumber());
        console.log("totalUsdtEarned", account.account.totalUsdtEarned.toNumber());
        console.log("totalHanEarned", account.account.totalHanEarned.toNumber());
        console.log("totalWithdrawnUsdt", account.account.totalWithdrawnUsdt.toNumber());
        console.log("totalWithdrawnHan", account.account.totalWithdrawnHan.toNumber());
        console.log("lastKeyPurchaseTime", account.account.lastKeyPurchaseTime.toNumber());
        console.log("bump", account.account.bump);
    }
    // console.log("accounts", accounts);
}

export async function fetchTreasuryUsdtBalance() {
    let treasury_usdt_account: PublicKey;
    [treasury_usdt_account] = PublicKey.findProgramAddressSync(
        [Buffer.from("treasury_usdt_account")],
        program.programId
    );
    const treasuryUsdtBalance = await getTokenBalance(connection, treasury_usdt_account);
    console.log("treasuryUsdtBalance", treasuryUsdtBalance);
}

export async function fetchTreasuryHanBalance() {
    let treasury_han_account: PublicKey;
    [treasury_han_account] = PublicKey.findProgramAddressSync(
        [Buffer.from("treasury_han_account")],
        program.programId
    );
    const treasuryHanBalance = await getTokenBalance(connection, treasury_han_account);
    console.log("treasuryHanBalance", treasuryHanBalance);
}



export async function getTokenBalance(
    connection: anchor.web3.Connection,
    tokenAccount: PublicKey
): Promise<number> {
    try {
        const info = await connection.getTokenAccountBalance(tokenAccount);
        if (info.value.uiAmount == null) throw new Error('token balance not found');
        // console.log('token balance: ', info.value.uiAmount);
        console.log('tokenAccount: ', tokenAccount.toBase58(), ' token balance: ', JSON.stringify(info, null, 2));
        return info.value.uiAmount;
    } catch (error) {
        console.error("get token balance failed:", error);
        return 0;
    }
}


function getBuyerTokenAccount(user: Keypair, mint: PublicKey): PublicKey {
    let user_token_account = getAssociatedTokenAddressSync(
        mint,
        user.publicKey,
        false,
        TOKEN_PROGRAM_ID
    );
    return user_token_account;
}

// fetchGameConfig();
fetchConfig();
// fetchAllUser();
// fetchUserAccount(buyer);

// fetchTreasuryUsdtBalance();
// fetchTreasuryUsdtBalance();
// fetchTreasuryHanBalance();

// getTokenBalance(connection, getBuyerTokenAccount(buyer, han_mint));