import Image from "next/image";
import UsdcImage from "../static/usdc.png";
import UsdtImage from "../static/usdt.png";
import UxdImage from "../static/uxd.png";
import PaiImage from "../static/pai.png";
import UsdhImage from "../static/usdh.png";

import { PublicKey } from "@solana/web3.js";
import { useEffect, useMemo, useState } from "react";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import * as anchor from "@project-serum/anchor";
import { SWAPVERSE_PROGRAM_PUBKEY, UNIT } from "../constants";
import swapverseIDL from "../constants/swapverse.json";

const styles = {
  wrapper: `flex p-[1rem] m-[1rem] justify-between items-center border-b border-[#4F98CA]`,
  tokenContainer: `flex items-center`,
  tokenDetailsContainer: `flex flex-col`,
  tokenImageContainer: ``,
  tokenImage: ``,
  tokenNameContainer: `w-full flex justify-center`,
  tokenNameSpan: `font-bold`,
  tokenRatioContainer: `flex mx-[1.5rem] h-full`,
  tokenRatioSpan: `text-[0.8rem]`,
  investButton: `flex border border-[#50D890] px-[4rem] py-[1rem] h-fit justify-center cursor-pointer`,
  amountTokenDeposited: `font-bold text-[0.8rem]`,
  amountTokenRequired: `text-[0.6rem]`,
  dateDiv: `flex justify-between items-center`,
  dateTitle: `flex text-[0.8rem] mx-[1rem] text-[#4F98CA]`,
  dateValue: `flex text-[0.8rem] mx-[1rem] text-[#4F98CA]`,
};

const InvestPoolsItem = ({ poolItem, investItemOnClick }) => {
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

  const [pooAddress, setPoolAddress] = useState("");
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

  const [createdAt, setCreatedAt] = useState(0);
  const [swapLifeInDays, setSwapLifeInDays] = useState(0);
  const [maxDaysToFill, setMaxDaysToFill] = useState(0);
  const [deadlineToFill, setDeadlineToFill] = useState(0);
  const [disablesAt, setDisablesAt] = useState(0);
  const [deadlineToFillString, setDeadlineToFillString] = useState("");
  const [disablesAtString, setDisablesAtString] = useState("");

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
    const handleTokenChange = async () => {
      setPoolAddress(poolItem.publicKey);
      let tokenAMint = poolItem.account.tokenAMint;
      if (
        tokenAMint.toBase58() === "Y85LaoyKCUFcpJHmsELsqT2TTuJDm86AD6G2GNqzXxs"
      ) {
        setImageSourceA(UsdcImage);
        setNameA("USDC");
        setMintA(new PublicKey("Y85LaoyKCUFcpJHmsELsqT2TTuJDm86AD6G2GNqzXxs"));
      } else if (
        tokenAMint.toBase58() === "8qFZnBBJrGYFuvytjZLtEZVDxwKhRLUMc1jepWF6QDKq"
      ) {
        setImageSourceA(UsdtImage);
        setNameA("USDT");
        setMintA(new PublicKey("8qFZnBBJrGYFuvytjZLtEZVDxwKhRLUMc1jepWF6QDKq"));
      } else if (
        tokenAMint.toBase58() === "E23WEDP3m7wEv8rRWeaawzR9s8mkjiAA9dMQFJ25Wfro"
      ) {
        setImageSourceA(UxdImage);
        setNameA("UXD");
        setMintA(new PublicKey("E23WEDP3m7wEv8rRWeaawzR9s8mkjiAA9dMQFJ25Wfro"));
      } else if (
        tokenAMint.toBase58() === "9UYM7aCDvBKoCNXa152qyUZSzCDQM8uBy834YayoEejL"
      ) {
        setImageSourceA(PaiImage);
        setNameA("PAI");
        setMintA(new PublicKey("9UYM7aCDvBKoCNXa152qyUZSzCDQM8uBy834YayoEejL"));
      } else if (
        tokenAMint.toBase58() === "Dnjiw4cn3nYUry5FNBC1yN6EzZb5zoqEz6UKTVqQV4pP"
      ) {
        setImageSourceA(UsdhImage);
        setNameA("USDH");
        setMintA(new PublicKey("Dnjiw4cn3nYUry5FNBC1yN6EzZb5zoqEz6UKTVqQV4pP"));
      }

      let tokenBMint = poolItem.account.tokenBMint;
      if (
        tokenBMint.toBase58() === "Y85LaoyKCUFcpJHmsELsqT2TTuJDm86AD6G2GNqzXxs"
      ) {
        setImageSourceB(UsdcImage);
        setNameB("USDC");
        setMintB(new PublicKey("Y85LaoyKCUFcpJHmsELsqT2TTuJDm86AD6G2GNqzXxs"));
      } else if (
        tokenBMint.toBase58() === "8qFZnBBJrGYFuvytjZLtEZVDxwKhRLUMc1jepWF6QDKq"
      ) {
        setImageSourceB(UsdtImage);
        setNameB("USDT");
        setMintB(new PublicKey("8qFZnBBJrGYFuvytjZLtEZVDxwKhRLUMc1jepWF6QDKq"));
      } else if (
        tokenBMint.toBase58() === "E23WEDP3m7wEv8rRWeaawzR9s8mkjiAA9dMQFJ25Wfro"
      ) {
        setImageSourceB(UxdImage);
        setNameB("UXD");
        setMintB(new PublicKey("E23WEDP3m7wEv8rRWeaawzR9s8mkjiAA9dMQFJ25Wfro"));
      } else if (
        tokenBMint.toBase58() === "9UYM7aCDvBKoCNXa152qyUZSzCDQM8uBy834YayoEejL"
      ) {
        setImageSourceB(PaiImage);
        setNameB("PAI");
        setMintB(new PublicKey("9UYM7aCDvBKoCNXa152qyUZSzCDQM8uBy834YayoEejL"));
      } else if (
        tokenBMint.toBase58() === "Dnjiw4cn3nYUry5FNBC1yN6EzZb5zoqEz6UKTVqQV4pP"
      ) {
        setImageSourceB(UsdhImage);
        setNameB("USDH");
        setMintB(new PublicKey("Dnjiw4cn3nYUry5FNBC1yN6EzZb5zoqEz6UKTVqQV4pP"));
      }

      setInitialAmountA(poolItem.account.initialAmountA * 1);
      setInitialAmountB(poolItem.account.initialAmountB * 1);

      setCreatedAt(poolItem.account.createdAt);
      setSwapLifeInDays(poolItem.account.swapLifeInDays);
      setMaxDaysToFill(poolItem.account.maxDaysToFill);
      setDisablesAt(createdAt * 1 + swapLifeInDays * 86400);
      setDeadlineToFill(createdAt * 1 + maxDaysToFill * 86400);

      setDisablesAtString(timeConverter(disablesAt));
      setDeadlineToFillString(timeConverter(deadlineToFill));

      let [swap_pool_token_a_account, swap_pool_token_a_account_b] =
        await anchor.web3.PublicKey.findProgramAddress(
          [poolItem.publicKey.toBuffer(), tokenAMint.toBuffer()],
          program.programId
        );

      let [swap_pool_token_b_account, swap_pool_token_b_account_b] =
        await anchor.web3.PublicKey.findProgramAddress(
          [poolItem.publicKey.toBuffer(), tokenBMint.toBuffer()],
          program.programId
        );

      try {
        const tokenAAccountBalance = await connection.getTokenAccountBalance(
          swap_pool_token_a_account
        );
        setCurrentAmountA(tokenAAccountBalance.value.amount);
      } catch (e) {
        setCurrentAmountA(0);
      }
      try {
        const tokenBAccountBalance = await connection.getTokenAccountBalance(
          swap_pool_token_b_account
        );
        setCurrentAmountB(tokenBAccountBalance.value.amount);
      } catch (e) {
        setCurrentAmountB(0);
      }
    };
    handleTokenChange();
  }, [
    program,
    poolItem,
    createdAt,
    maxDaysToFill,
    swapLifeInDays,
    disablesAt,
    deadlineToFill,
    disablesAtString,
    deadlineToFillString,
  ]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.tokenContainer}>
        <div className={styles.tokenDetailsContainer}>
          <div className={styles.tokenImageContainer}>
            <Image
              className={styles.tokenImage}
              src={imageSourceA}
              width={100}
              height={100}
              alt="token image"
            />
          </div>
          <div className={styles.tokenNameContainer}>
            <span className={styles.tokenNameSpan}>{nameA}</span>
          </div>
        </div>
        <div className={styles.tokenRatioContainer}>
          <span className={styles.tokenRatioSpan}>
            <span className={styles.amountTokenDeposited}>
              {currentAmountA}
            </span>{" "}
            /{" "}
            <span className={styles.amountTokenRequired}>{initialAmountA}</span>
          </span>
        </div>
      </div>
      <div className={styles.investButtonContainer}>
        <div className={styles.dateDiv}>
          <div className={styles.dateTitle}>Deadline to fill</div>
          <div className={styles.dateValue}>{deadlineToFillString}</div>
        </div>
        <div
          className={styles.investButton}
          onClick={() => investItemOnClick(pooAddress)}
        >
          Invest
        </div>
        <div className={styles.dateDiv}>
          <div className={styles.dateTitle}>Disables at</div>
          <div className={styles.dateValue}>{disablesAtString}</div>
        </div>
      </div>
      <div className={styles.tokenContainer}>
        <div className={styles.tokenRatioContainer}>
          <span className={styles.tokenRatioSpan}>
            <span className={styles.amountTokenDeposited}>
              {currentAmountB}
            </span>{" "}
            /{" "}
            <span className={styles.amountTokenRequired}>{initialAmountB}</span>
          </span>
        </div>
        <div className={styles.tokenDetailsContainer}>
          <div className={styles.tokenImageContainer}>
            <Image
              className={styles.tokenImage}
              src={imageSourceB}
              width={100}
              height={100}
              alt="author image"
            />
          </div>
          <div className={styles.tokenNameContainer}>
            <span className={styles.tokenNameSpan}>{nameB}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestPoolsItem;
