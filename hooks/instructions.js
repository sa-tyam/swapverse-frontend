import * as anchor from "@project-serum/anchor";
import { useEffect, useMemo, useState } from "react";
import { SWAPVERSE_PROGRAM_PUBKEY, UNIT } from "../constants";
import swapverseIDL from "../constants/swapverse.json";
import toast from "react-hot-toast";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import {
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { BN } from "bn.js";

export function useInstructions() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const anchorWallet = useAnchorWallet();

  let global_state;
  let signing_authority;
  let usdc_dev_mint;
  let usdt_dev_mint;
  let uxd_dev_mint;
  let pai_dev_mint;
  let usdh_dev_mint;

  const [transactionPending, setTransactionPending] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const [swapPools, setSwapPools] = useState([]);

  const program = useMemo(() => {
    if (anchorWallet) {
      const provider = new anchor.AnchorProvider(
        connection,
        anchorWallet,
        anchor.AnchorProvider.defaultOptions()
      );
      return new anchor.Program(
        swapverseIDL,
        SWAPVERSE_PROGRAM_PUBKEY,
        provider
      );
    }
  }, [connection, anchorWallet]);

  useEffect(() => {
    const findSwapPools = async () => {
      if (program && publicKey && !transactionPending) {
        try {
          let [global_state_add, global_state_b] =
            await anchor.web3.PublicKey.findProgramAddress(
              [Buffer.from("global-state")],
              program.programId
            );
          let global_state_info = await program.account.globalState.fetch(
            global_state_add
          );
          if (global_state_info === null) {
            toast.error("Global State is not initialized");
          } else {
            const swapAccounts = await program.account.swapPool.all();
            setSwapPools(swapAccounts);
          }
        } catch (error) {
          console.log(error);
          setSwapPools([]);
        } finally {
        }
      }
    };

    findSwapPools();
  }, [publicKey, program, transactionPending]);

  const initializeGlobalState = async () => {
    if (program && publicKey && !initialized) {
      try {
        setTransactionPending(true);
        let [global_state_add, global_state_b] =
          await anchor.web3.PublicKey.findProgramAddress(
            [Buffer.from("global-state")],
            program.programId
          );
        global_state = global_state_add;

        let [signing_authority_add, signing_authority_b] =
          await anchor.web3.PublicKey.findProgramAddress(
            [Buffer.from("signing-authority")],
            program.programId
          );
        signing_authority = signing_authority_add;

        let [usdc_dev_mint_add, usdc_dev_mint_b] =
          await anchor.web3.PublicKey.findProgramAddress(
            [Buffer.from("usdc-dev")],
            program.programId
          );
        usdc_dev_mint = usdc_dev_mint_add;

        let [usdt_dev_mint_add, usdt_dev_mint_b] =
          await anchor.web3.PublicKey.findProgramAddress(
            [Buffer.from("usdt-dev")],
            program.programId
          );
        usdt_dev_mint = usdt_dev_mint_add;

        let [uxd_dev_mint_add, uxd_dev_mint_b] =
          await anchor.web3.PublicKey.findProgramAddress(
            [Buffer.from("uxd-dev")],
            program.programId
          );
        uxd_dev_mint = uxd_dev_mint_add;

        let [pai_dev_mint_add, pai_dev_mint_b] =
          await anchor.web3.PublicKey.findProgramAddress(
            [Buffer.from("pai-dev")],
            program.programId
          );
        pai_dev_mint = pai_dev_mint_add;

        let [usdh_dev_mint_add, usdh_dev_mint_b] =
          await anchor.web3.PublicKey.findProgramAddress(
            [Buffer.from("usdh-dev")],
            program.programId
          );
        usdh_dev_mint = usdh_dev_mint_add;

        let global_state_info = await program.account.globalState.fetch(
          global_state_add
        );

        if (global_state_info === null) {
          const tx = await program.methods
            .initializeGlobalState()
            .accounts({
              owner: publicKey,
              globalState: global_state,
              signingAuthority: signing_authority,
              usdcTokenMint: usdc_dev_mint,
              usdtTokenMint: usdt_dev_mint,
              uxdTokenMint: uxd_dev_mint,
              paiTokenMint: pai_dev_mint,
              usdhTokenMint: usdh_dev_mint,
              tokenProgram: TOKEN_PROGRAM_ID,
              systemProgram: anchor.web3.SystemProgram.programId,
            })
            .rpc();
        } else {
          console.log("Global state already initialized");
        }

        setInitialized(true);

        toast.success("SUCCESSFULLY INITIALIZED GLOBAL STATE");
      } catch (error) {
        console.log(error);
        toast.error(error.toString());
      } finally {
        setTransactionPending(false);
      }
    }
  };

  const getTestTokens = async (mint, amount) => {
    if (program && publicKey) {
      try {
        let [global_state_add, global_state_b] =
          await anchor.web3.PublicKey.findProgramAddress(
            [Buffer.from("global-state")],
            program.programId
          );
        global_state = global_state_add;
        let global_state_info = await program.account.globalState.fetch(
          global_state_add
        );
        if (global_state_info === null) {
          toast.error("Global State is not initialized");
        } else {
          setTransactionPending(true);

          let [signing_authority_add, signing_authority_b] =
            await anchor.web3.PublicKey.findProgramAddress(
              [Buffer.from("signing-authority")],
              program.programId
            );
          signing_authority = signing_authority_add;

          let tokenMint = new anchor.web3.PublicKey(mint);

          let user_token_ata = await getAssociatedTokenAddress(
            tokenMint,
            publicKey
          );

          let amount_bn = new BN(amount);
          const tx = await program.methods
            .getTestTokens(amount_bn)
            .accounts({
              investor: publicKey,
              globalState: global_state,
              signingAuthority: signing_authority,
              tokenMint: tokenMint,
              investorTokenAccount: user_token_ata,
              tokenProgram: TOKEN_PROGRAM_ID,
              associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
              systemProgram: anchor.web3.SystemProgram.programId,
            })
            .rpc();
          console.log("Your transaction signature", tx);
          toast.success("Test tokens received");
        }
      } catch (error) {
        console.log(error);
        toast.error(error.toString());
      } finally {
        setTransactionPending(false);
      }
    }
  };

  const createSwapPool = async (
    mintA,
    mintB,
    amountA,
    amountB,
    swapFeePercent,
    swapverseFeePercent,
    minInvestmentAmount,
    maxDaysToFill,
    swapLifeInDays
  ) => {
    if (program && publicKey) {
      try {
        let [global_state_add, global_state_b] =
          await anchor.web3.PublicKey.findProgramAddress(
            [Buffer.from("global-state")],
            program.programId
          );
        global_state = global_state_add;
        let global_state_info = await program.account.globalState.fetch(
          global_state_add
        );
        if (global_state_info === null) {
          toast.error("Global State is not initialized");
        } else {
          setTransactionPending(true);

          let [signing_authority_add, signing_authority_b] =
            await anchor.web3.PublicKey.findProgramAddress(
              [Buffer.from("signing-authority")],
              program.programId
            );
          signing_authority = signing_authority_add;

          const swap_pool_n = global_state_info.noOfSwapPools;
          const swap_pool_num = new BN(swap_pool_n).toArrayLike(
            Buffer,
            "le",
            8
          );
          let tokenAMint = new anchor.web3.PublicKey(mintA);
          let tokenBMint = new anchor.web3.PublicKey(mintB);
          let amountABN = new BN(amountA);
          let amountBBN = new BN(amountB);
          let minInvestmentAmountBN = new BN(minInvestmentAmount);
          let swapLifeInDaysBN = new BN(swapLifeInDays);

          let [swap_pool_add, swap_pool_b] =
            await anchor.web3.PublicKey.findProgramAddress(
              [swap_pool_num, Buffer.from("swap-pool")],
              program.programId
            );

          let [pool_share_token_a_mint_add, pool_share_token_a_mint_b] =
            await anchor.web3.PublicKey.findProgramAddress(
              [
                swap_pool_add.toBuffer(),
                tokenAMint.toBuffer(),
                Buffer.from("pool-share-token"),
              ],
              program.programId
            );

          let [pool_share_token_b_mint_add, pool_share_token_b_mint_b] =
            await anchor.web3.PublicKey.findProgramAddress(
              [
                swap_pool_add.toBuffer(),
                tokenBMint.toBuffer(),
                Buffer.from("pool-share-token"),
              ],
              program.programId
            );

          const tx = await program.methods
            .createSwapPool(
              amountABN,
              amountBBN,
              swapFeePercent,
              swapverseFeePercent,
              minInvestmentAmountBN,
              maxDaysToFill,
              swapLifeInDaysBN
            )
            .accounts({
              owner: publicKey,
              globalState: global_state,
              signingAuthority: signing_authority,
              swapPool: swap_pool_add,
              tokenAMint: tokenAMint,
              tokenBMint: tokenBMint,
              poolShareTokenAMint: pool_share_token_a_mint_add,
              poolShareTokenBMint: pool_share_token_b_mint_add,
              tokenProgram: TOKEN_PROGRAM_ID,
              systemProgram: anchor.web3.SystemProgram.programId,
            })
            .rpc();
          console.log("Your transaction signature", tx);
          toast.success("Swap pool created");
        }
      } catch (error) {
        console.log(error);
        toast.error(error.toString());
      } finally {
        setTransactionPending(false);
      }
    }
  };

  const investPool = async (amount, swapPoolAddress, tokenMint) => {
    if (program && publicKey) {
      try {
        let [global_state_add, global_state_b] =
          await anchor.web3.PublicKey.findProgramAddress(
            [Buffer.from("global-state")],
            program.programId
          );
        global_state = global_state_add;
        let global_state_info = await program.account.globalState.fetch(
          global_state_add
        );
        if (global_state_info === null) {
          toast.error("Global State is not initialized");
        } else {
          setTransactionPending(true);

          let [signing_authority_add, signing_authority_b] =
            await anchor.web3.PublicKey.findProgramAddress(
              [Buffer.from("signing-authority")],
              program.programId
            );
          signing_authority = signing_authority_add;

          let [swapPoolTokenAccount, swapPoolTokenAccount_b] =
            await anchor.web3.PublicKey.findProgramAddress(
              [swapPoolAddress.toBuffer(), tokenMint.toBuffer()],
              program.programId
            );

          console.log(
            "invest swap pool token address",
            swapPoolTokenAccount.toBase58()
          );

          let investorTokenAccount = await getAssociatedTokenAddress(
            tokenMint,
            publicKey
          );

          let [pool_share_token_mint, pool_share_token_mint_b] =
            await anchor.web3.PublicKey.findProgramAddress(
              [
                swapPoolAddress.toBuffer(),
                tokenMint.toBuffer(),
                Buffer.from("pool-share-token"),
              ],
              program.programId
            );

          let investor_pool_share_token_ata = await getAssociatedTokenAddress(
            pool_share_token_mint,
            publicKey
          );

          let [investor_pool_info, investor_pool_info_b] =
            await anchor.web3.PublicKey.findProgramAddress(
              [swapPoolAddress.toBuffer(), publicKey.toBuffer()],
              program.programId
            );

          let amount_bn = new BN(amount);
          let tx = await program.methods
            .investSwapPool(amount_bn)
            .accounts({
              investor: publicKey,
              globalState: global_state_add,
              signingAuthority: signing_authority_add,
              swapPool: swapPoolAddress,
              tokenMint: tokenMint,
              swapPoolTokenAccount: swapPoolTokenAccount,
              investorTokenAccount: investorTokenAccount,
              poolShareTokenMint: pool_share_token_mint,
              investorPoolShareTokenAccount: investor_pool_share_token_ata,
              investorPoolInfo: investor_pool_info,
              tokenProgram: TOKEN_PROGRAM_ID,
              associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
              systemProgram: anchor.web3.SystemProgram.programId,
            })
            .rpc();
          console.log("Your transaction signature is ", tx);
          toast.success("Transaction successful");
        }
      } catch (e) {
        toast.error("Transaction was not successful");
        alert("Transaction was not successful");
        console.log(e);
      } finally {
        setTransactionPending(true);
      }
    }
  };

  const swapToken = async (
    amount,
    swapPoolAddress,
    tokenAMint,
    tokenBMint,
    isTokenA
  ) => {
    if (program && publicKey) {
      try {
        let [global_state_add, global_state_b] =
          await anchor.web3.PublicKey.findProgramAddress(
            [Buffer.from("global-state")],
            program.programId
          );
        global_state = global_state_add;
        let global_state_info = await program.account.globalState.fetch(
          global_state_add
        );
        if (global_state_info === null) {
          toast.error("Global State is not initialized");
        } else {
          setTransactionPending(true);

          let [signing_authority_add, signing_authority_b] =
            await anchor.web3.PublicKey.findProgramAddress(
              [Buffer.from("signing-authority")],
              program.programId
            );
          signing_authority = signing_authority_add;

          let [swapPoolTokenAAccount, swapPoolTokenAAccount_b] =
            await anchor.web3.PublicKey.findProgramAddress(
              [swapPoolAddress.toBuffer(), tokenAMint.toBuffer()],
              program.programId
            );
          let [swapPoolTokenBAccount, swapPoolTokenBAccount_b] =
            await anchor.web3.PublicKey.findProgramAddress(
              [swapPoolAddress.toBuffer(), tokenBMint.toBuffer()],
              program.programId
            );

          let userTokenAAccount = await getAssociatedTokenAddress(
            tokenAMint,
            publicKey
          );
          let userTokenBAccount = await getAssociatedTokenAddress(
            tokenBMint,
            publicKey
          );

          let [
            swap_pool_treasury_token_a_ata_add,
            swap_pool_treasury_token_a_b,
          ] = await anchor.web3.PublicKey.findProgramAddress(
            [
              swapPoolAddress.toBuffer(),
              tokenAMint.toBuffer(),
              Buffer.from("treasury-account"),
            ],
            program.programId
          );
          let [
            swap_pool_treasury_token_b_ata_add,
            swap_pool_treasury_token_b_b,
          ] = await anchor.web3.PublicKey.findProgramAddress(
            [
              swapPoolAddress.toBuffer(),
              tokenBMint.toBuffer(),
              Buffer.from("treasury-account"),
            ],
            program.programId
          );

          let amount_bn = new BN(amount);
          let min_amount_out = new BN(0);
          let tx = await program.methods
            .swapToken(amount_bn, min_amount_out, isTokenA)
            .accounts({
              user: publicKey,
              globalState: global_state_add,
              signingAuthority: signing_authority_add,
              swapPool: swapPoolAddress,
              tokenAMint: tokenAMint,
              tokenBMint: tokenBMint,
              userTokenAAccount: userTokenAAccount,
              userTokenBAccount: userTokenBAccount,
              swapPoolTokenAAccount: swapPoolTokenAAccount,
              swapPoolTokenBAccount: swapPoolTokenBAccount,
              swapPoolTreasuryTokenAAccount: swap_pool_treasury_token_a_ata_add,
              swapPoolTreasuryTokenBAccount: swap_pool_treasury_token_b_ata_add,
              tokenProgram: TOKEN_PROGRAM_ID,
              systemProgram: anchor.web3.SystemProgram.programId,
            })
            .rpc();
          console.log("Your transaction signature is ", tx);
          toast.success("Transaction successful");
        }
      } catch (e) {
        toast.error("Transaction was not successful");
        alert("Transaction was not successful");
        console.log(e);
      } finally {
        setTransactionPending(true);
      }
    }
  };

  const withdrawInvestmentPool = async (
    swapPoolAddress,
    tokenMintA,
    tokenMintB,
    isTokenA
  ) => {
    if (program && publicKey) {
      try {
        let [global_state_add, global_state_b] =
          await anchor.web3.PublicKey.findProgramAddress(
            [Buffer.from("global-state")],
            program.programId
          );
        global_state = global_state_add;
        let global_state_info = await program.account.globalState.fetch(
          global_state_add
        );
        if (global_state_info === null) {
          toast.error("Global State is not initialized");
        } else {
          setTransactionPending(true);

          let [signing_authority_add, signing_authority_b] =
            await anchor.web3.PublicKey.findProgramAddress(
              [Buffer.from("signing-authority")],
              program.programId
            );
          signing_authority = signing_authority_add;

          let [swapPoolTokenAAccount, swapPoolTokenAAccount_b] =
            await anchor.web3.PublicKey.findProgramAddress(
              [swapPoolAddress.toBuffer(), tokenMintA.toBuffer()],
              program.programId
            );

          let [swapPoolTokenBAccount, swapPoolTokenBAccount_b] =
            await anchor.web3.PublicKey.findProgramAddress(
              [swapPoolAddress.toBuffer(), tokenMintB.toBuffer()],
              program.programId
            );

          let investorTokenAAccount = await getAssociatedTokenAddress(
            tokenMintA,
            publicKey
          );

          let investorTokenBAccount = await getAssociatedTokenAddress(
            tokenMintB,
            publicKey
          );

          let [pool_share_token_a_mint, pool_share_token_a_mint_b] =
            await anchor.web3.PublicKey.findProgramAddress(
              [
                swapPoolAddress.toBuffer(),
                tokenMintA.toBuffer(),
                Buffer.from("pool-share-token"),
              ],
              program.programId
            );

          let [pool_share_token_b_mint, pool_share_token_b_mint_b] =
            await anchor.web3.PublicKey.findProgramAddress(
              [
                swapPoolAddress.toBuffer(),
                tokenMintB.toBuffer(),
                Buffer.from("pool-share-token"),
              ],
              program.programId
            );

          let investor_pool_share_token_a_ata = await getAssociatedTokenAddress(
            pool_share_token_a_mint,
            publicKey
          );

          let investor_pool_share_token_b_ata = await getAssociatedTokenAddress(
            pool_share_token_b_mint,
            publicKey
          );

          let [investor_pool_info, investor_pool_info_b] =
            await anchor.web3.PublicKey.findProgramAddress(
              [swapPoolAddress.toBuffer(), publicKey.toBuffer()],
              program.programId
            );

          let tx = await program.methods
            .withdrawSwapPool(isTokenA)
            .accounts({
              investor: publicKey,
              globalState: global_state_add,
              signingAuthority: signing_authority_add,
              swapPool: swapPoolAddress,
              tokenAMint: tokenMintA,
              tokenBMint: tokenMintB,
              swapPoolTokenAAccount: swapPoolTokenAAccount,
              swapPoolTokenBAccount: swapPoolTokenBAccount,
              investorTokenAAccount: investorTokenAAccount,
              investorTokenBAccount: investorTokenBAccount,
              poolShareTokenAMint: pool_share_token_a_mint,
              poolShareTokenBMint: pool_share_token_b_mint,
              investorPoolShareTokenAAccount: investor_pool_share_token_a_ata,
              investorPoolShareTokenBAccount: investor_pool_share_token_b_ata,
              investorPoolInfo: investor_pool_info,
              tokenProgram: TOKEN_PROGRAM_ID,
              associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
              systemProgram: anchor.web3.SystemProgram.programId,
            })
            .rpc();
          console.log("Your transaction signature is ", tx);
          toast.success("Transaction successful");
        }
      } catch (e) {
        toast.error("Transaction was not successful");
        console.log(e);
      } finally {
        setTransactionPending(true);
      }
    }
  };

  const withdrawProfitPool = async (
    swapPoolAddress,
    tokenMintA,
    tokenMintB,
    isTokenA
  ) => {
    if (program && publicKey) {
      try {
        let [global_state_add, global_state_b] =
          await anchor.web3.PublicKey.findProgramAddress(
            [Buffer.from("global-state")],
            program.programId
          );
        global_state = global_state_add;
        let global_state_info = await program.account.globalState.fetch(
          global_state_add
        );
        if (global_state_info === null) {
          toast.error("Global State is not initialized");
        } else {
          setTransactionPending(true);

          let [signing_authority_add, signing_authority_b] =
            await anchor.web3.PublicKey.findProgramAddress(
              [Buffer.from("signing-authority")],
              program.programId
            );
          signing_authority = signing_authority_add;

          let [swapPoolTokenAAccount, swapPoolTokenAAccount_b] =
            await anchor.web3.PublicKey.findProgramAddress(
              [swapPoolAddress.toBuffer(), tokenMintA.toBuffer()],
              program.programId
            );

          let [swapPoolTokenBAccount, swapPoolTokenBAccount_b] =
            await anchor.web3.PublicKey.findProgramAddress(
              [swapPoolAddress.toBuffer(), tokenMintB.toBuffer()],
              program.programId
            );

          let investorTokenAAccount = await getAssociatedTokenAddress(
            tokenMintA,
            publicKey
          );

          let investorTokenBAccount = await getAssociatedTokenAddress(
            tokenMintB,
            publicKey
          );

          let [pool_share_token_a_mint, pool_share_token_a_mint_b] =
            await anchor.web3.PublicKey.findProgramAddress(
              [
                swapPoolAddress.toBuffer(),
                tokenMintA.toBuffer(),
                Buffer.from("pool-share-token"),
              ],
              program.programId
            );

          let [pool_share_token_b_mint, pool_share_token_b_mint_b] =
            await anchor.web3.PublicKey.findProgramAddress(
              [
                swapPoolAddress.toBuffer(),
                tokenMintB.toBuffer(),
                Buffer.from("pool-share-token"),
              ],
              program.programId
            );

          let investor_pool_share_token_a_ata = await getAssociatedTokenAddress(
            pool_share_token_a_mint,
            publicKey
          );

          let investor_pool_share_token_b_ata = await getAssociatedTokenAddress(
            pool_share_token_b_mint,
            publicKey
          );

          let [investor_pool_info, investor_pool_info_b] =
            await anchor.web3.PublicKey.findProgramAddress(
              [swapPoolAddress.toBuffer(), publicKey.toBuffer()],
              program.programId
            );

          let [
            swap_pool_treasury_token_a_ata_add,
            swap_pool_treasury_token_a_b,
          ] = await anchor.web3.PublicKey.findProgramAddress(
            [
              swapPoolAddress.toBuffer(),
              tokenMintA.toBuffer(),
              Buffer.from("treasury-account"),
            ],
            program.programId
          );
          let [
            swap_pool_treasury_token_b_ata_add,
            swap_pool_treasury_token_b_b,
          ] = await anchor.web3.PublicKey.findProgramAddress(
            [
              swapPoolAddress.toBuffer(),
              tokenMintB.toBuffer(),
              Buffer.from("treasury-account"),
            ],
            program.programId
          );

          let tx = await program.methods
            .claimProfit()
            .accounts({
              investor: publicKey,
              globalState: global_state_add,
              signingAuthority: signing_authority_add,
              swapPool: swapPoolAddress,
              withdrawTokenMint: isTokenA ? tokenMintA : tokenMintB,
              tokenAMint: tokenMintA,
              tokenBMint: tokenMintB,
              swapPoolTreasuryTokenAAccount: swap_pool_treasury_token_a_ata_add,
              swapPoolTreasuryTokenBAccount: swap_pool_treasury_token_b_ata_add,
              investorTokenAccount: isTokenA
                ? investorTokenAAccount
                : investorTokenBAccount,
              poolShareTokenMint: isTokenA
                ? pool_share_token_a_mint
                : pool_share_token_b_mint,
              investorPoolShareTokenAccount: isTokenA
                ? investor_pool_share_token_a_ata
                : investor_pool_share_token_b_ata,
              investorPoolInfo: investor_pool_info,
              tokenProgram: TOKEN_PROGRAM_ID,
              associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
              systemProgram: anchor.web3.SystemProgram.programId,
            })
            .rpc();
          console.log("Your transaction signature is ", tx);
          toast.success("Transaction successful");
        }
      } catch (e) {
        toast.error("Transaction was not successful");
        console.log(e);
      } finally {
        setTransactionPending(true);
      }
    }
  };

  return {
    initialized,
    swapPools,
    transactionPending,
    initializeGlobalState,
    getTestTokens,
    createSwapPool,
    investPool,
    swapToken,
    withdrawInvestmentPool,
    withdrawProfitPool,
  };
}
