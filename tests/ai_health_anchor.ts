import * as anchor from "@coral-xyz/anchor";
import { BN, Program } from "@coral-xyz/anchor";
import { AiHealthAnchor } from "../target/types/ai_health_anchor";
import { Keypair, LAMPORTS_PER_SOL, PublicKey, Transaction } from "@solana/web3.js";
import { createAccountsMintsAndTokenAccounts, makeTokenMint } from "@solana-developers/helpers";
import { createAssociatedTokenAccount, createMint, getAccount, getAssociatedTokenAddressSync, TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID, mintTo, getOrCreateAssociatedTokenAccount, mintToChecked, ASSOCIATED_TOKEN_PROGRAM_ID, createAccount } from "@solana/spl-token"
import fs from "fs";
import { airdropSol, getSolBalance, getTokenBalance, InitBuySol, InitTokenAccount, transferSol, transferToken } from "./utils";

const TOKEN_PROGRAM: typeof TOKEN_2022_PROGRAM_ID | typeof TOKEN_PROGRAM_ID =
  TOKEN_2022_PROGRAM_ID;


describe("ai_health_anchor", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.aiHealthAnchor as Program<AiHealthAnchor>;

  const deployer = (provider.wallet as anchor.Wallet).payer;

  const connection = provider.connection;
  let usdt_mint: PublicKey;
  let deployer_usdt_account: PublicKey;
  let pool_usdt_account: PublicKey;
  
  let game_config: PublicKey;
  // let buyer = anchor.web3.Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs.readFileSync(buyer_path, "utf8"))));
  // const buyer2 = anchor.web3.Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs.readFileSync(buyer2_path, "utf8"))));
  let buyer: Keypair;
  let buyer_usdt_account: PublicKey;
  let buyer2: Keypair;
  let buyer2_usdt_account: PublicKey;
  before("before",
    async () => {
      
    
    // console.info("tx", tx);
      // // usdt_mint = await createMint(connection, deployer, deployer.publicKey, null, 6, deployer, {skipPreflight: true});
      // console.info("usdt_mint", usdt_mint);

   
      
      // const deployer_usdt_account = await getOrCreateAssociatedTokenAccount(
        
      //   connection,
      //   deployer,
      //   usdt_mint,
      //   deployer.publicKey,
      // );
     
      // let mintToTx = await mintTo(
      //   // ts-expect-error Type error in spl-token-bankrun dependency
      // connection, deployer, usdt_mint, deployer_usdt_account.address, deployer, 100000 * 10 ** 6, [], { skipPreflight: false });
      // console.info("mintToTx", mintToTx);
      // // pool_usdt_account = await createTokenAccount(connection, deployer, usdt_mint, deployer.publicKey);

      const mintsAndTokenAccounts = await createAccountsMintsAndTokenAccounts(
        [[1000000_000_000]],
        100 * LAMPORTS_PER_SOL,
        connection,
        deployer
      )
      usdt_mint = mintsAndTokenAccounts.mints[0].publicKey;

      buyer = mintsAndTokenAccounts.users[0];
      buyer_usdt_account = mintsAndTokenAccounts.tokenAccounts[0][0];

      // buyer2 = mintsAndTokenAccounts.users[1];
      // buyer2_usdt_account = mintsAndTokenAccounts.tokenAccounts[1][0];

      // console.log("tokenAccounts: ", mintsAndTokenAccounts.tokenAccounts);
      
      // pool_usdt_account = deployerMintsAndTokenAccounts.tokenAccounts[0][0];
      // console.log("pool_usdt_account", pool_usdt_account);
      // usdt_mint = deployerMintsAndTokenAccounts.mints[0].publicKey;
      // const deployerTokenAccounts = deployerMintsAndTokenAccounts.tokenAccounts;
      // pool_usdt_account = deployerTokenAccounts[0][0];
      // const buyerUsdtBalance = await getTokenBalance(connection, buyer_usdt_account);
      // console.log(`Deployer ${buyer.publicKey}:  ${buyer_usdt_account} USDT balance: ${buyerUsdtBalance}`);
      const deployerSolBalance = await getSolBalance(connection, deployer.publicKey);
      console.log(`Deployer ${deployer.publicKey}:  balance: ${deployerSolBalance}`);
      const buyerSolBalance = await getSolBalance(connection, buyer.publicKey);
      console.log(`Buyer ${buyer.publicKey}:  balance: ${buyerSolBalance}`);
      // console.log(`Deployer ${deployer.publicKey}:  balance: ${deployerSolBalance}`);
      // console.log("usdt_mint", usdt_mint);
    //   usdt_mint = await makeTokenMint(connection, deployer, "USDT", "USDT", 6, "https://img.everwin.app/logo.jpg");  

    //   const deployer_usdt_account = await getOrCreateAssociatedTokenAccount(
    //      connection,
    //      deployer,
    //      usdt_mint,
    //      deployer.publicKey,
    //      false,
    //      "confirmed",
    //      { skipPreflight: false },
    //      TOKEN_PROGRAM,
    //      ASSOCIATED_TOKEN_PROGRAM_ID
    //  );
    //  console.info("token_account", deployer_usdt_account);
    //  let tx = await mintTo(connection, deployer, usdt_mint, deployer_usdt_account.address, deployer, 10000_000000, [], { skipPreflight: false }, TOKEN_PROGRAM);
      // await transferToken(connection, deployer, deployer_usdt_account, usdt_mint, 100000 * 10 ** 6);

      // let account = await getOrCreateAssociatedTokenAccount(
      //   connection,
      //   deployer,
      //   usdt_mint,
      //   deployer.publicKey,
      //   false,
      //   "confirmed",
      //   { skipPreflight: false },
      //   TOKEN_PROGRAM,
      // );
      // deployer_usdt_account = account.address;
      [pool_usdt_account] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("pool_usdt_account"),
        ],
        program.programId
      );
      [game_config] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("game_config"),
        ],
        program.programId
      )
    }
  );

  it("Is initialized!", async () => {
    const tx = await program.methods
      .initializeConfig()
      .accounts({
        authority: deployer.publicKey,
        usdtMint: usdt_mint,
        tokenProgram: TOKEN_PROGRAM,
      }).signers([deployer])
      .rpc({commitment: "confirmed"});
      console.log("Your transaction signature", tx);
    // let signature = await connection.confirmTransaction(tx);
    // console.log("Your transaction signature", signature);

  });


  it("Is buy keys!", async () => {
    
    let beforeConfig = await program.account.gameConfig.fetch(game_config, "confirmed");
    console.log("config before buy key", beforeConfig);

    let buyer_user_account: PublicKey;
    [buyer_user_account] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("user_account"),
        deployer.publicKey.toBuffer(),
      ],
      program.programId
    )

    // let buyer_usdt_account = await getOrCreateAssociatedTokenAccount(
    //   connection,
    //   deployer,
    //   usdt_mint,
    //   deployer.publicKey,
    //   false,
    //   "confirmed",
    //   { skipPreflight: false },
    //   TOKEN_PROGRAM,
    //   ASSOCIATED_TOKEN_PROGRAM_ID
    // );
    // console.info("deployer_token_account", deployer_token_account);

    // await mintTo(connection, buyer, usdt_mint, buyer_token_account, buyer, 10000 * 10 ** 6, [], { skipPreflight: false });
    // const tx = new Transaction().add(
      
    // )
    const deployerBuyKeyTx = await program.methods
    .buyKey(new BN(5), null)
    .accounts({
      usdtMint: usdt_mint,
      // @ts-expect-error Type error in spl-token dependency
      // userUsdtAccount: buyer_usdt_account,
      userAccount: buyer_user_account,
      poolUsdtAccount: pool_usdt_account,
      tokenProgram: TOKEN_PROGRAM,
    })
    .signers([deployer])
    .rpc({commitment: "confirmed"});
  console.log("Your transaction signature", deployerBuyKeyTx);
  // let deployerBuyKeySignature = await connection.confirmTransaction(deployerBuyKeyTx);
  // console.log("Your transaction signature", deployerBuyKeySignature);

    // console.log("mintToTx", mintToTx);
    // await initBuySol(connection, buyer, 10);
    



    // let user_usdt_account = await createAssociatedTokenAccount(
    //   connection,
    //   buyer,
    //   usdt_mint,
    //   buyer.publicKey,
    //   { skipPreflight: false },
    //   TOKEN_2022_PROGRAM_ID
    // );
    // console.info("user_usdt_account", user_usdt_account);
    // await transferToken(connection, deployer, user_usdt_account, usdt_mint, 100 * 10**6);


    // [user_account] = PublicKey.findProgramAddressSync(
    //   [
    //     Buffer.from("user_account"),
    //     buyer.publicKey.toBuffer(),
    //   ],
    //   program.programId
    // )

    // const buyerUsdtBalance = await getTokenBalance(connection, user_usdt_account);
    // console.log(`Buyer ${buyer.publicKey}:  ${user_usdt_account} USDT balance: ${buyerUsdtBalance}`);

    // // Add your test here.
    // const tx = await program.methods
    //   .buyKey(new BN(1000000), new BN(1))
    //   .accounts({
    //     user: buyer.publicKey,
    //     usdtMint: usdt_mint,
    //     // @ts-expect-error Type error in spl-token dependency
    //     userAccount: user_account,
    //     tokenProgram: TOKEN_PROGRAM,
    //   })
    //   .signers([buyer])
    //   .rpc();
    // console.log("Your transaction signature", tx);
    // let signature = await connection.confirmTransaction(tx);

    // await initBuySol(connection, buyer2, 10);

    // let user_account2: PublicKey;
    // [user_account2] = PublicKey.findProgramAddressSync(
    //   [
    //     Buffer.from("user_account"),
    //     buyer2.publicKey.toBuffer(),
    //   ],
    //   program.programId
    // )
    // const tx2 = await program.methods
    //   .buyKey(new BN(1000000), new BN(1))
    //   .accounts({
    //     user: buyer2.publicKey,
    //     usdtMint: usdt_mint,
    //     // @ts-expect-error Type error in spl-token dependency
    //     userAccount: user_account2,
    //     tokenProgram: TOKEN_PROGRAM,
    //   })
    //   .signers([buyer2])
    //   .rpc();
    // console.log("buyer2 transaction signature", tx2);

    // let signature2 = await connection.confirmTransaction(tx2);


    // let endConfig = await program.account.gameConfig.fetch(game_config, "confirmed");
    // console.log("endConfig", endConfig);
    // const poolUsdtBalance = await getTokenBalance(connection, pool_usdt_account);
    // console.log("poolUsdtBalance:", poolUsdtBalance);
  });

  it("reward", async () => {

    // await transferSol(connection, deployer, buyer.publicKey, 10);
    let buyer_account: PublicKey;
    [buyer_account] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("user_account"),
        buyer.publicKey.toBuffer(),
      ],
      program.programId
    )
    const tx = await program.methods
      .reward(new BN(10000))
      .accounts({
        user: buyer.publicKey,
        // @ts-expect-error Type error in spl-token dependency
        userAccount: buyer_account,
        gameConfig: game_config,
      })
      .signers([buyer])
      .rpc({commitment: "confirmed"});
    console.log("Your transaction signature", tx);

    let endUserAccount = await program.account.userAccount.fetch(buyer_account, "confirmed");
    console.log("user account after update data", endUserAccount);
  });



  it("Is claim!", async () => {
    let buyer_account: PublicKey;
    [buyer_account] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("user_account"),
        buyer.publicKey.toBuffer(),
      ],
      program.programId
    )

    // let user_usdt_account: PublicKey;
    // [user_usdt_account] = PublicKey.findProgramAddressSync(
    //   [
    //     Buffer.from("user_usdt_account"),
    //     buyer.publicKey.toBuffer(),
    //   ],
    //   program.programId
    // )
    // console.log("buyer_account", buyer_account);
    // let beforeUserAccount = await program.account.userAccount.fetch(buyer_account, "confirmed");
    // console.log("user account before claim", beforeUserAccount);

    const tx = await program.methods
      .claim()
      .accounts({
        // user: buyer.publicKey,
        // @ts-expect-error Type error in anchor dependency
        userAccount: buyer_account,
        userUsdtAccount: buyer_usdt_account,
        poolUsdtAccount: pool_usdt_account,
        usdtMint: usdt_mint,
        tokenProgram: TOKEN_PROGRAM,
      })
      .signers([buyer])
      .rpc({commitment: "confirmed"});
      console.log("claim success signature:", tx);

    // let endUserAccount = await program.account.userAccount.fetch(buyer_account, "confirmed");
    // console.log("user account after claim", endUserAccount);
  });
});



