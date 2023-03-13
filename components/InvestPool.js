import Image from "next/image";
import Router from "next/router";
import UsdcImage from "../static/usdc.png";
import UsdtImage from "../static/usdt.png";
import UxdImage from "../static/uxd.png";
import PaiImage from "../static/pai.png";
import UsdhImage from "../static/usdh.png";

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
  wrapper: `flex flex-col items-center justify-center`,
  poolDetailContainer: `h-fit flex flex-col border border-[#4F98CA] px-[2rem] py-[0.5rem] mb-[1rem]`,
  poolDetailContainerItem: `flex justify-between items-center`,
  poolDetailContainerItemTitle: `flex text-[0.8rem] mx-[1rem] text-[#4F98CA]`,
  poolDetailContainerItemValue: `flex text-[0.8rem] mx-[1rem] text-[#4F98CA]`,
  investContainer: `flex flex-col h-fit items-center border border-[#4F98CA] p-[2rem]`,
  topRow: `flex items-center`,
  tokenContainer: `flex flex-col items-center`,
  tokenImageContainer: ``,
  tokenImage: ``,
  tokenNameContainer: ``,
  tokenNameSpan: ``,
  amountInputContainer: `mx-[2rem] flex h-fit`,
  amountInput: `flex text-[2rem] w-[12rem] px-[1rem] text-[#EFFFFB]`,
  arrowsContainer: `my-[2rem] rounded-full border border-[#50D890] p-[0.5rem]`,
  arrowsSpan: `font-bold text-[2rem]`,
  bottomRow: `flex items-center`,
  amountOutputSpan: `flex text-[2rem] w-[10rem] px-[1rem]`,
  investButton: `w-full mx-[2rem] mt-[2rem] p-[1rem] flex justify-center items-center bg-[#50D890] text-[#272727] font-bold text-1.5xl cursor-pointer`,
  amountTokenDeposited: `font-bold text-[0.7rem] text-[#4F98CA]`,
  amountTokenRequired: `text-[0.6rem] text-[#4F98CA]`,
};

const InvestPool = ({ swapPoolAddress }) => {
  const [createdAt, setCreatedAt] = useState("");
  const [deadlineToFill, setDeadlineToFill] = useState("");
  const [disablesAt, setDisablesAt] = useState("");
  const [swapFee, setSwapFee] = useState(0);
  const [swapverseFee, setSwapverseFee] = useState(0);

  const [poolItem, setPoolItem] = useState();
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
  const [minInvestmentAmount, setMinInvestmentAmount] = useState(0);

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

  function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time =
      date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;
    return time;
  }

  useEffect(() => {
    const setValues = async () => {
      if (program && publicKey && swapPoolAddress) {
        try {
          const swapPoolAccount = await program.account.swapPool.fetch(
            swapPoolAddress
          );

          let poolCreatedAt = swapPoolAccount.createdAt;
          setCreatedAt(timeConverter(poolCreatedAt * 1));
          let poolMaxDaysToFill = swapPoolAccount.maxDaysToFill;
          setDeadlineToFill(
            timeConverter(poolCreatedAt * 1 + poolMaxDaysToFill * 86400)
          );
          let poolAge = swapPoolAccount.swapLifeInDays;
          setDisablesAt(timeConverter(poolCreatedAt * 1 + poolAge * 86400));
          let poolSwapFee = swapPoolAccount.swapFeePercentage;
          setSwapFee(poolSwapFee * 1);
          let poolSwapverseFee = swapPoolAccount.swapverseFeePercentage;
          setSwapverseFee(poolSwapverseFee * 1);
          setInitialAmountA(swapPoolAccount.initialAmountA);
          setInitialAmountB(swapPoolAccount.initialAmountB);
          setMinInvestmentAmount(swapPoolAccount.minInvestmentAmount * 1);

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
          } catch (e) {
            setCurrentAmountA(0);
          }
          try {
            const tokenBAccountBalance =
              await connection.getTokenAccountBalance(
                swap_pool_token_b_account
              );
            setCurrentAmountB(tokenBAccountBalance.value.amount);
          } catch (e) {
            console.log(e);
            setCurrentAmountB(0);
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

  const { investPool } = useInstructions();

  const handleInvestment = async () => {
    if (isTokenA) {
      await investPool(amount, swapPoolAddress, mintA);
    } else {
      await investPool(amount, swapPoolAddress, mintB);
    }
    Router.reload();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.poolDetailContainer}>
        <div className={styles.poolDetailContainerItem}>
          <div className={styles.poolDetailContainerItemTitle}>Created At</div>
          <div className={styles.poolDetailContainerItemValue}>{createdAt}</div>
        </div>
        <div className={styles.poolDetailContainerItem}>
          <div className={styles.poolDetailContainerItemTitle}>
            Deadline to fill
          </div>
          <div className={styles.poolDetailContainerItemValue}>
            {deadlineToFill}
          </div>
        </div>
        <div className={styles.poolDetailContainerItem}>
          <div className={styles.poolDetailContainerItemTitle}>Disables At</div>
          <div className={styles.poolDetailContainerItemValue}>
            {disablesAt}
          </div>
        </div>
        <div className={styles.poolDetailContainerItem}>
          <div className={styles.poolDetailContainerItemTitle}>Swap fee</div>
          <div className={styles.poolDetailContainerItemValue}>
            {swapFee ? swapFee.toString() : "0"} percent
          </div>
        </div>
        <div className={styles.poolDetailContainerItem}>
          <div className={styles.poolDetailContainerItemTitle}>
            Swapverse fee
          </div>
          <div className={styles.poolDetailContainerItemValue}>
            {swapverseFee ? swapverseFee.toString() : "0"} percent
          </div>
        </div>
        <div className={styles.poolDetailContainerItem}>
          <div className={styles.poolDetailContainerItemTitle}>
            Min investment
          </div>
          <div className={styles.poolDetailContainerItemValue}>
            {minInvestmentAmount ? minInvestmentAmount.toString() : "0"}
          </div>
        </div>
      </div>
      <div className={styles.investContainer}>
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
            <div className={styles.tokenAmountContainer}>
              <span className={styles.amountTokenDeposited}>
                {isTokenA ? currentAmountA : currentAmountB}
              </span>{" "}
              /{" "}
              <span className={styles.amountTokenRequired}>
                {isTokenA ? initialAmountA : initialAmountB}
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
            <div className={styles.tokenAmountContainer}>
              <span className={styles.amountTokenDeposited}>
                {!isTokenA ? currentAmountA : currentAmountB}
              </span>{" "}
              /{" "}
              <span className={styles.amountTokenRequired}>
                {!isTokenA ? initialAmountA : initialAmountB}
              </span>
            </div>
          </div>
        </div>
        <div className={styles.investButton} onClick={handleInvestment}>
          Invest
        </div>
      </div>
    </div>
  );
};

export default InvestPool;
