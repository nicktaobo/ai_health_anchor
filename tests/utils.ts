import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction,  Transaction } from "@solana/web3.js"
import { createMint, createTransferInstruction, getAssociatedTokenAddressSync, getOrCreateAssociatedTokenAccount, mintTo, TOKEN_PROGRAM_ID } from "@solana/spl-token"
import * as anchor from "@coral-xyz/anchor";

export async function getTokenBalance(
  connection: anchor.web3.Connection,
  tokenAccount: PublicKey
): Promise<number> {
  try {
    const info = await connection.getTokenAccountBalance(tokenAccount);
    if (info.value.uiAmount == null) throw new Error('未找到余额');
    // console.log('余额 (使用 Solana-Web3.js): ', info.value.uiAmount);
    console.log('余额 (使用 Solana-Web3.js): ', JSON.stringify(info, null, 2));
    return info.value.uiAmount;
  } catch (error) {
    console.error("获取代币余额失败:", error);
    return 0;
  }
}



export async function getSolBalance(
  connection: anchor.web3.Connection,
  publicKey: PublicKey
): Promise<number> {
  try {
    const balance = await connection.getBalance(publicKey);
    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    console.error("获取 SOL 余额失败:", error);
    return 0;
  }
}

export async function transferSol(
  connection: anchor.web3.Connection,
  from: Keypair,
  to: PublicKey,
  amount: number
): Promise<void> {
  const commitBlockhashWithContext = await connection.getLatestBlockhash();
  let commitTx  = new anchor.web3.Transaction(
    {
      feePayer: from.publicKey,
      blockhash: commitBlockhashWithContext.blockhash,
      lastValidBlockHeight: commitBlockhashWithContext.lastValidBlockHeight,
    }
  ).add(
    anchor.web3.SystemProgram.transfer({
      fromPubkey: from.publicKey,
      toPubkey: to,
      lamports: amount * LAMPORTS_PER_SOL,
    })
  );
  const commitTxSignature = await anchor.web3.sendAndConfirmTransaction(connection, commitTx, [from], {skipPreflight: true, commitment: "finalized"});
  console.log("commitTxSignature", commitTxSignature);
}


export async function airdropSol(
  connection: anchor.web3.Connection,
  to: PublicKey,
  amount: number
): Promise<void> {
  const airdropTransactionSignature = await connection.requestAirdrop(to, amount * LAMPORTS_PER_SOL);
  let signature = await connection.confirmTransaction(airdropTransactionSignature);
  console.log("airdropTransactionSignature", signature);
}

export async function InitBuySol(connection: anchor.web3.Connection, buyer: Keypair, amount: number) {
  await airdropSol(connection, buyer.publicKey, amount);
  const buyerSolBalance = await getSolBalance(connection, buyer.publicKey);
  console.log(`Buyer ${buyer.publicKey} SOL balance: ${buyerSolBalance}`);
}


export async function transferToken(connection: Connection, from: Keypair, to: PublicKey, mint: PublicKey, amount: number): Promise<string> {
    const fromTokenAccount = await getAssociatedTokenAddressSync(
        mint,
        from.publicKey,
    );
    const transaction = new Transaction().add(
        createTransferInstruction(
            fromTokenAccount,
            to,
            from.publicKey,
            amount,
        ),
    );

    return await sendAndConfirmTransaction(connection, transaction, [from]);
}



export async function InitTokenAccount(connection: Connection, from:Keypair, toWallet: Keypair, mint: PublicKey) {
    // const fromAirdropSignature = await connection.requestAirdrop(
    //     from.publicKey,
    //     LAMPORTS_PER_SOL,
    //   );
    //   // Wait for airdrop confirmation
    //   await connection.confirmTransaction(fromAirdropSignature);
    
      // Generate a new wallet to receive newly minted token
    //   const toWallet = Keypair.generate();
    
    
      // Get the token account of the fromWallet Solana address, if it does not exist, create it
      const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        from,
        mint,
        from.publicKey,
      );
    
      //get the token account of the toWallet Solana address, if it does not exist, create it
      const toTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        from,
        mint,
        toWallet.publicKey,
      );
    
      // Minting 1 new token to the "fromTokenAccount" account we just returned/created
      await mintTo(
        connection,
        from,
        mint,
        fromTokenAccount.address,
        from.publicKey,
        1000000000, // it's 1 token, but in lamports
        [],
      );
    
      // Add token transfer instructions to transaction
      const transaction = new Transaction().add(
        createTransferInstruction(
          fromTokenAccount.address,
          toTokenAccount.address,
          from.publicKey,
          1,
        ),
      );
    
      // Sign transaction, broadcast, and confirm
      await sendAndConfirmTransaction(connection, transaction, [from]);

      return { fromTokenAccount, toTokenAccount};
}

function findAta(publicKey: PublicKey, mint: PublicKey): PublicKey {
  let ata = getAssociatedTokenAddressSync(
    mint,
    publicKey,
    false,
    TOKEN_PROGRAM_ID
  );
  console.log("ata", ata);
  return ata;
}

findAta(new PublicKey("EzSgWjaQ6A7dNKDtjYCuziMXqAs2vvc4f9rhfxM6JsuG"), new PublicKey("Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"));