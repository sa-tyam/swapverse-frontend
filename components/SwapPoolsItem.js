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
import { SWAPVERSE_PROGRAM_PUBKEY } from "../constants";
import swapverseIDL from "../constants/swapverse.json";

const styles = {
  wrapper: `flex p-[1rem] m-[1rem] justify-between items-center border-b border-[#4F98CA]`,
  tokenContainer: `flex items-center`,
  tokenDetailsContainer: `flex flex-col`,
  tokenImageContainer: ``,
  tokenImage: ``,
  tokenNameContainer: `w-full flex justify-center`,
  tokenNameSpan: `font-bold`,
  tokenRatioContainer: `flex mx-[2rem] h-full`,
  tokenRatioSpan: `text-[1rem]`,
  swapButton: `flex border border-[#50D890] px-[1rem] py-[0.4rem] h-fit cursor-pointer`,
};

const SwapPoolsItem = ({ poolItem, swapItemOnClick }) => {
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
  const [ratioAB, setRatioAB] = useState(1.0);
  const [ratioBA, setRatioBA] = useState(1.0);

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

      let initialAmountA = poolItem.account.initialAmountA;
      let initialAmountB = poolItem.account.initialAmountB;

      let product = parseFloat(initialAmountA) * parseFloat(initialAmountB);

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
        const tokenAAccountBalance =
          await program.provider.connection.getTokenAccountBalance(
            swap_pool_token_a_account
          );
        const tokenBAccountBalance =
          await program.provider.connection.getTokenAccountBalance(
            swap_pool_token_b_account
          );

        if (initialAmountB > 0 && tokenBAccountBalance.value.amount > 0) {
          setRatioAB(
            (
              product /
              tokenBAccountBalance.value.amount /
              parseFloat(initialAmountB)
            ).toFixed(4)
          );
        } else {
          setRatioAB(1);
        }
        if (initialAmountA > 0 && tokenAAccountBalance.value.amount > 0) {
          setRatioBA(
            (
              product /
              tokenAAccountBalance.value.amount /
              parseFloat(initialAmountA)
            ).toFixed(4)
          );
        } else {
          setRatioBA(1);
        }
      } catch (e) {
        console.log(e);
        setRatioAB(1);
        setRatioBA(1);
      }
    };
    handleTokenChange();
  }, [program, poolItem]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.tokenContainer}>
        <div className={styles.tokenDetailsContainer}>
          <div className={styles.tokenImageContainer}>
            <Image
              className={styles.tokenImage}
              src={imageSourceA}
              width={50}
              height={50}
              alt="token image"
            />
          </div>
          <div className={styles.tokenNameContainer}>
            <span className={styles.tokenNameSpan}>{nameA}</span>
          </div>
        </div>
        <div className={styles.tokenRatioContainer}>
          <span className={styles.tokenRatioSpan}>1 &#x2192; {ratioBA}</span>
        </div>
      </div>
      <div
        className={styles.swapButton}
        onClick={() => swapItemOnClick(pooAddress)}
      >
        Swap
      </div>
      <div className={styles.tokenContainer}>
        <div className={styles.tokenRatioContainer}>
          <span className={styles.tokenRatioSpan}>{ratioAB} &#x2190; 1</span>
        </div>
        <div className={styles.tokenDetailsContainer}>
          <div className={styles.tokenImageContainer}>
            <Image
              className={styles.tokenImage}
              src={imageSourceB}
              Image={UsdtImage}
              width={50}
              height={50}
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

export default SwapPoolsItem;
