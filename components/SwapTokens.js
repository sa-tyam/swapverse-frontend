import Image from "next/image";
import UsdcImage from "../static/usdc.png";
import UsdtImage from "../static/usdt.png";
import UxdImage from "../static/uxd.png";
import PaiImage from "../static/pai.png";
import UsdhImage from "../static/usdh.png";
import Router from "next/router";

import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import * as anchor from "@project-serum/anchor";
import { SWAPVERSE_PROGRAM_PUBKEY } from "../constants";
import swapverseIDL from "../constants/swapverse.json";
import { useState, useEffect, useMemo } from "react";
import { PublicKey } from "@solana/web3.js";

import { useInstructions } from "@/hooks/instructions";

const styles = {
  wrapper: `flex items-center`,
  container: `flex flex-col h-fit items-center border border-[#4F98CA] p-[2rem]`,
  topRow: `flex items-center`,
  tokenContainer: `flex flex-col items-center`,
  tokenImageContainer: ``,
  tokenImage: ``,
  tokenNameContainer: ``,
  tokenNameSpan: ``,
  amountInputContainer: `mx-[2rem] flex h-fit`,
  amountInput: `flex text-[1.2rem] w-[12rem] px-[1rem] text-[#EFFFFB]`,
  arrowsContainer: `my-[2rem] rounded-full border border-[#50D890] p-[0.5rem] cursor-pointer`,
  arrowsSpan: `font-bold text-[2rem]`,
  bottomRow: `flex items-center`,
  amountOutputContainer: `mx-[2rem] flex h-fit`,
  amountOutputSpan: `flex text-[1rem] w-fit px-[1rem]`,
  swapButton: `w-full mx-[2rem] mt-[2rem] p-[1rem] flex justify-center items-center bg-[#50D890] text-[#272727] font-bold text-1.5xl cursor-pointer`,
};

const SwapTokens = ({ swapPoolAddress }) => {
  const [swapFee, setSwapFee] = useState(0);

  const [nameA, setNameA] = useState("");
  const [mintA, setMintA] = useState(
    new PublicKey("Y85LaoyKCUFcpJHmsELsqT2TTuJDm86AD6G2GNqzXxs")
  );
  const [imageSourceA, setImageSourceA] = useState(UxdImage);

  const [nameB, setNameB] = useState("");
  const [mintB, setMintB] = useState(
    new PublicKey("Y85LaoyKCUFcpJHmsELsqT2TTuJDm86AD6G2GNqzXxs")
  );
  const [imageSourceB, setImageSourceB] = useState(UxdImage);
  const [initialAmountA, setInitialAmountA] = useState(0);
  const [initialAmountB, setInitialAmountB] = useState(0);
  const [currentAmountA, setCurrentAmountA] = useState(0);
  const [currentAmountB, setCurrentAmountB] = useState(0);

  const [ratioAB, setRatioAB] = useState(1.0);
  const [ratioBA, setRatioBA] = useState(1.0);

  const [amount, setAmount] = useState(0);
  const [isTokenA, setIsTokenA] = useState(true);

  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const anchorWallet = useAnchorWallet();

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
    const setValues = async () => {
      if (program && publicKey && swapPoolAddress) {
        try {
          const swapPoolAccount = await program.account.swapPool.fetch(
            swapPoolAddress
          );

          setInitialAmountA(swapPoolAccount.initialAmountA);
          setInitialAmountB(swapPoolAccount.initialAmountB);

          let poolItem = swapPoolAccount;
          let tokenAMint = poolItem.tokenAMint;
          if (
            tokenAMint.toBase58() ===
            "Y85LaoyKCUFcpJHmsELsqT2TTuJDm86AD6G2GNqzXxs"
          ) {
            setImageSourceA(UsdcImage);
            setNameA("USDC");
            setMintA(
              new PublicKey("Y85LaoyKCUFcpJHmsELsqT2TTuJDm86AD6G2GNqzXxs")
            );
          } else if (
            tokenAMint.toBase58() ===
            "8qFZnBBJrGYFuvytjZLtEZVDxwKhRLUMc1jepWF6QDKq"
          ) {
            setImageSourceA(UsdtImage);
            setNameA("USDT");
            setMintA(
              new PublicKey("8qFZnBBJrGYFuvytjZLtEZVDxwKhRLUMc1jepWF6QDKq")
            );
          } else if (
            tokenAMint.toBase58() ===
            "E23WEDP3m7wEv8rRWeaawzR9s8mkjiAA9dMQFJ25Wfro"
          ) {
            setImageSourceA(UxdImage);
            setNameA("UXD");
            setMintA(
              new PublicKey("E23WEDP3m7wEv8rRWeaawzR9s8mkjiAA9dMQFJ25Wfro")
            );
          } else if (
            tokenAMint.toBase58() ===
            "9UYM7aCDvBKoCNXa152qyUZSzCDQM8uBy834YayoEejL"
          ) {
            setImageSourceA(PaiImage);
            setNameA("PAI");
            setMintA(
              new PublicKey("9UYM7aCDvBKoCNXa152qyUZSzCDQM8uBy834YayoEejL")
            );
          } else if (
            tokenAMint.toBase58() ===
            "Dnjiw4cn3nYUry5FNBC1yN6EzZb5zoqEz6UKTVqQV4pP"
          ) {
            setImageSourceA(UsdhImage);
            setNameA("USDH");
            setMintA(
              new PublicKey("Dnjiw4cn3nYUry5FNBC1yN6EzZb5zoqEz6UKTVqQV4pP")
            );
          }

          let tokenBMint = poolItem.tokenBMint;
          if (
            tokenBMint.toBase58() ===
            "Y85LaoyKCUFcpJHmsELsqT2TTuJDm86AD6G2GNqzXxs"
          ) {
            setImageSourceB(UsdcImage);
            setNameB("USDC");
            setMintB(
              new PublicKey("Y85LaoyKCUFcpJHmsELsqT2TTuJDm86AD6G2GNqzXxs")
            );
          } else if (
            tokenBMint.toBase58() ===
            "8qFZnBBJrGYFuvytjZLtEZVDxwKhRLUMc1jepWF6QDKq"
          ) {
            setImageSourceB(UsdtImage);
            setNameB("USDT");
            setMintB(
              new PublicKey("8qFZnBBJrGYFuvytjZLtEZVDxwKhRLUMc1jepWF6QDKq")
            );
          } else if (
            tokenBMint.toBase58() ===
            "E23WEDP3m7wEv8rRWeaawzR9s8mkjiAA9dMQFJ25Wfro"
          ) {
            setImageSourceB(UxdImage);
            setNameB("UXD");
            setMintB(
              new PublicKey("E23WEDP3m7wEv8rRWeaawzR9s8mkjiAA9dMQFJ25Wfro")
            );
          } else if (
            tokenBMint.toBase58() ===
            "9UYM7aCDvBKoCNXa152qyUZSzCDQM8uBy834YayoEejL"
          ) {
            setImageSourceB(PaiImage);
            setNameB("PAI");
            setMintB(
              new PublicKey("9UYM7aCDvBKoCNXa152qyUZSzCDQM8uBy834YayoEejL")
            );
          } else if (
            tokenBMint.toBase58() ===
            "Dnjiw4cn3nYUry5FNBC1yN6EzZb5zoqEz6UKTVqQV4pP"
          ) {
            setImageSourceB(UsdhImage);
            setNameB("USDH");
            setMintB(
              new PublicKey("Dnjiw4cn3nYUry5FNBC1yN6EzZb5zoqEz6UKTVqQV4pP")
            );
          }

          setInitialAmountA(poolItem.initialAmountA * 1);
          setInitialAmountB(poolItem.initialAmountB * 1);
          let product = parseFloat(initialAmountA) * parseFloat(initialAmountB);

          let [swap_pool_token_a_account, swap_pool_token_a_account_b] =
            await anchor.web3.PublicKey.findProgramAddress(
              [swapPoolAddress.toBuffer(), tokenAMint.toBuffer()],
              program.programId
            );

          let [swap_pool_token_b_account, swap_pool_token_b_account_b] =
            await anchor.web3.PublicKey.findProgramAddress(
              [swapPoolAddress.toBuffer(), tokenBMint.toBuffer()],
              program.programId
            );

          try {
            const tokenAAccountBalance =
              await connection.getTokenAccountBalance(
                swap_pool_token_a_account
              );
            setCurrentAmountA(tokenAAccountBalance.value.amount);
            if (initialAmountB > 0 && currentAmountA > 0) {
              setRatioBA(product / parseFloat(currentAmountA) / initialAmountB);
            } else {
              setRatioBA(1);
            }
          } catch (e) {
            setRatioBA(1);
            setCurrentAmountA(0);
          }
          try {
            const tokenBAccountBalance =
              await connection.getTokenAccountBalance(
                swap_pool_token_b_account
              );
            setCurrentAmountB(tokenBAccountBalance.value.amount);
            if (initialAmountA > 0 && currentAmountB > 0) {
              setRatioAB(product / parseFloat(currentAmountB) / initialAmountA);
            } else {
              setRatioAB(1);
            }
          } catch (e) {
            setCurrentAmountB(0);
            setRatioAB(1);
          }
        } catch (e) {
          console.log(e);
        }
      }
    };

    setValues();
  }, [program, publicKey, swapPoolAddress]);

  function toggleClick() {
    setIsTokenA(!isTokenA);
  }

  const handleAmountChange = async (e) => {
    setAmount(e.target.value);
  };

  const { swapToken } = useInstructions();

  const handleSwap = async () => {
    await swapToken(amount, swapPoolAddress, mintA, mintB, isTokenA);
    Router.reload();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.topRow}>
          <div className={styles.tokenContainer}>
            <div className={styles.tokenImageContainer}>
              <Image
                className={styles.tokenImage}
                src={isTokenA ? imageSourceA : imageSourceB}
                width={100}
                height={100}
                alt="Token Image"
              />
            </div>
            <div className={styles.tokenNameContainer}>
              <span className={styles.tokenNameSpan}>
                {isTokenA ? nameA : nameB}
              </span>
            </div>
          </div>
          <div className={styles.amountInputContainer}>
            <input
              className={styles.amountInput}
              placeholder="Amount"
              type="number"
              onChange={handleAmountChange}
            />
          </div>
        </div>
        <div className={styles.arrowsContainer} onClick={toggleClick}>
          <span className={styles.arrowsSpan}>&#x2191;&#x2193;</span>
        </div>
        <div className={styles.bottomRow}>
          <div className={styles.tokenContainer}>
            <div className={styles.tokenImageContainer}>
              <Image
                className={styles.tokenImage}
                src={!isTokenA ? imageSourceA : imageSourceB}
                width={100}
                height={100}
                alt="Token"
              />
            </div>
            <div className={styles.tokenNameContainer}>
              <span className={styles.tokenNameSpan}>
                {!isTokenA ? nameA : nameB}
              </span>
            </div>
          </div>
          <div className={styles.amountOutputContainer}>
            <span className={styles.amountOutputSpan}>
              {!isTokenA
                ? (ratioBA * amount).toFixed(4)
                : (ratioAB * amount).toFixed(4)}
            </span>
          </div>
        </div>
        <div className={styles.swapButton} onClick={handleSwap}>
          Swap
        </div>
      </div>
    </div>
  );
};

export default SwapTokens;
