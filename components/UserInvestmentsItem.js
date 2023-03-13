import Image from "next/image";
import UsdcImage from "../static/usdc.png";
import UsdtImage from "../static/usdt.png";
import UxdImage from "../static/uxd.png";
import PaiImage from "../static/pai.png";
import UsdhImage from "../static/usdh.png";
import { PublicKey } from "@solana/web3.js";
import { useEffect, useMemo, useState } from "react";
import Router from "next/router";

import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import * as anchor from "@project-serum/anchor";
import { SWAPVERSE_PROGRAM_PUBKEY } from "../constants";
import swapverseIDL from "../constants/swapverse.json";
import {
  getAssociatedTokenAddress,
} from "@solana/spl-token";

import { useInstructions } from "@/hooks/instructions";

const styles = {
  wrapper: `flex p-[1rem] m-[1rem] border-b border-[#4F98CA] justify-between`,
  poolDetailContainer: `h-fit flex flex-col border border-[#4F98CA] px-[2rem] py-[0.5rem] mb-[1rem]`,
  poolDetailContainerItem: `flex justify-between items-center`,
  poolDetailContainerItemTitle: `flex text-[0.8rem] mx-[1rem] text-[#4F98CA]`,
  poolDetailContainerItemValue: `flex text-[0.8rem] mx-[1rem] text-[#4F98CA]`,
  tokenAContainer: `flex items-center`,
  tokenBContainer: `flex items-center`,
  tokenDetailContainer: `flex flex-col items-center`,
  tokenImageContainer: ``,
  tokenImage: ``,
  tokenNameContainer: ``,
  tokenNameSpan: ``,
  tokenRatioContainer: `flex mx-[2rem] h-full`,
  tokenRatioSpan: `text-[0.8rem]`,
  withdrawalContainer: `flex w-fit`,
  amountDiv: `flex justify-between items-center`,
  amountTitle: `flex text-[0.8rem] mx-[1rem] text-[#4F98CA]`,
  amountValue: `flex text-[0.8rem] mx-[1rem] text-[#4F98CA]`,
  withdrawButtonActive: `flex border border-[#50D890] px-[0.5rem] py-[0.5rem] h-fit justify-center mx-[1rem] cursor-pointer`,
  withdrawButtonInActive: `flex border border-[#808080] text-[#808080] px-[0.5rem] py-[0.5rem] h-fit justify-center mx-[1rem]`,
};

const UserInvestmentsItems = ({ poolItem }) => {
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

  const [createdAt, setCreatedAt] = useState("");
  const [deadlineToFill, setDeadlineToFill] = useState("");
  const [disablesAt, setDisablesAt] = useState("");
  const [swapFee, setSwapFee] = useState(0);
  const [swapverseFee, setSwapverseFee] = useState(0);
  const [initialAmountA, setInitialAmountA] = useState(0);
  const [initialAmountB, setInitialAmountB] = useState(0);
  const [currentAmountA, setCurrentAmountA] = useState(0);
  const [currentAmountB, setCurrentAmountB] = useState(0);

  const [investorPoolShareTokenA, setInvestorPoolShareTokenA] = useState(0);
  const [investorPoolShareTokenB, setInvestorPoolShareTokenB] = useState(0);
  const [investorProfitWithdrawnTokenA, setInvestorProfitWithdrawnTokenA] =
    useState(0);
  const [investorProfitWithdrawnTokenB, setInvestorProfitWithdrawnTokenB] =
    useState(0);
  const [
    investorInvestmentWithdrawnTokenA,
    setInvestorInvestmentWithdrawnTokenA,
  ] = useState(0);
  const [
    investorInvestmentWithdrawnTokenB,
    setInvestorInvestmentWithdrawnTokenB,
  ] = useState(0);
  const [investorProfitAvailableTokenA, setInvestorProfitAvailableTokenA] =
    useState(0);
  const [investorProfitAvailableTokenB, setInvestorProfitAvailableTokenB] =
    useState(0);
    const [investorInvestmentAvailableTokenA, setInvestorInvestmentAvailableTokenA] =
    useState(0);
  const [investorInvestmentAvailableTokenB, setInvestorInvestmentAvailableTokenB] =
    useState(0);

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
      setPoolAddress(poolItem.address);
      let tokenAMint = poolItem.pool.tokenAMint;
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

      let tokenBMint = poolItem.pool.tokenBMint;
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

      let poolCreatedAt = poolItem.pool.createdAt;
      setCreatedAt(timeConverter(poolCreatedAt * 1));
      let poolMaxDaysToFill = poolItem.pool.maxDaysToFill;
      setDeadlineToFill(
        timeConverter(poolCreatedAt * 1 + poolMaxDaysToFill * 86400)
      );
      let poolAge = poolItem.pool.swapLifeInDays;
      setDisablesAt(timeConverter(poolCreatedAt * 1 + poolAge * 86400));
      let poolSwapFee = poolItem.pool.swapFeePercentage;
      setSwapFee(poolSwapFee * 1);
      let poolSwapverseFee = poolItem.pool.swapverseFeePercentage;
      setSwapverseFee(poolSwapverseFee * 1);
      setInitialAmountA(poolItem.pool.initialAmountA);
      setInitialAmountB(poolItem.pool.initialAmountB);

      let product = parseFloat(initialAmountA) * parseFloat(initialAmountB);

      let [swap_pool_token_a_account, swap_pool_token_a_account_b] =
        await anchor.web3.PublicKey.findProgramAddress(
          [poolItem.address.toBuffer(), tokenAMint.toBuffer()],
          program.programId
        );

      let [swap_pool_token_b_account, swap_pool_token_b_account_b] =
        await anchor.web3.PublicKey.findProgramAddress(
          [poolItem.address.toBuffer(), tokenBMint.toBuffer()],
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

        if (tokenBAccountBalance.value.amount > 0 && initialAmountA > 0) {
          setRatioAB((product / tokenBAccountBalance.value.amount)/initialAmountB);
        } else {
          setRatioAB(1);
        }
        if (tokenAAccountBalance.value.amount > 0 && initialAmountA > 0) {
          setRatioBA((product / tokenAAccountBalance.value.amount)/initialAmountA);
        } else {
          setRatioBA(1);
        }
        

        let [pool_share_token_a_mint, pool_share_token_a_mint_b] =
          await anchor.web3.PublicKey.findProgramAddress(
            [
              poolItem.address.toBuffer(),
              tokenAMint.toBuffer(),
              Buffer.from("pool-share-token"),
            ],
            program.programId
          );
        let investor_pool_share_token_a_ata = await getAssociatedTokenAddress(
          pool_share_token_a_mint,
          publicKey
        );
        try {
          const investor_pool_share_token_a_balance =
            await connection.getTokenAccountBalance(
              investor_pool_share_token_a_ata
            );
          setInvestorPoolShareTokenA(
            investor_pool_share_token_a_balance.value.amount
          );
        } catch (e) {
          setInvestorPoolShareTokenA(0);
        }
        let [pool_share_token_b_mint, pool_share_token_b_mint_b] =
          await anchor.web3.PublicKey.findProgramAddress(
            [
              poolItem.address.toBuffer(),
              tokenBMint.toBuffer(),
              Buffer.from("pool-share-token"),
            ],
            program.programId
          );
        let investor_pool_share_token_b_ata = await getAssociatedTokenAddress(
          pool_share_token_b_mint,
          publicKey
        );
        try {
          const investor_pool_share_token_b_balance =
            await connection.getTokenAccountBalance(
              investor_pool_share_token_b_ata
            );
          setInvestorPoolShareTokenB(
            investor_pool_share_token_b_balance.value.amount
          );
        } catch (e) {
          setInvestorPoolShareTokenA(0);
        }

        let [investor_pool_info_add, investor_pool_info_b] =
          await anchor.web3.PublicKey.findProgramAddress(
            [poolItem.address.toBuffer(), publicKey.toBuffer()],
            program.programId
          );

        const investorPoolInfo = await program.account.investorPoolInfo.fetch(
          investor_pool_info_add
        );

        setInvestorProfitWithdrawnTokenA(
          investorPoolInfo.profitForTokenAWithdrawn
        );
        setInvestorProfitWithdrawnTokenB(
          investorPoolInfo.profitForTokenBWithdrawn
        );
        setInvestorInvestmentWithdrawnTokenA(investorPoolInfo.tokenAWithdrawn);
        setInvestorInvestmentWithdrawnTokenB(investorPoolInfo.tokenBWithdrawn);

        setInvestorInvestmentAvailableTokenA(investorPoolShareTokenA - investorInvestmentWithdrawnTokenA);
        setInvestorInvestmentAvailableTokenB(investorPoolShareTokenB - investorInvestmentWithdrawnTokenB);

        let [swap_pool_treasury_token_a_ata_add, swap_pool_treasury_token_a_b] =
          await anchor.web3.PublicKey.findProgramAddress(
            [
              poolItem.address.toBuffer(),
              tokenAMint.toBuffer(),
              Buffer.from("treasury-account"),
            ],
            program.programId
          );
        try {
          const swap_pool_treasury_token_a_ata_balance =
            await connection.getTokenAccountBalance(
              swap_pool_treasury_token_a_ata_add
            );

          let investor_share_a =
            (swap_pool_treasury_token_a_ata_balance.value.amount * investorPoolShareTokenA) /
            initialAmountA;
          setInvestorProfitAvailableTokenA(investor_share_a - investorProfitWithdrawnTokenA);
        } catch (e) {
          setInvestorProfitAvailableTokenA(0);
        }

        let [swap_pool_treasury_token_b_ata_add, swap_pool_treasury_token_b_b] =
          await anchor.web3.PublicKey.findProgramAddress(
            [
              poolItem.address.toBuffer(),
              tokenBMint.toBuffer(),
              Buffer.from("treasury-account"),
            ],
            program.programId
          );

        try {
          const swap_pool_treasury_token_b_ata_balance =
            await connection.getTokenAccountBalance(
              swap_pool_treasury_token_b_ata_add
            );

          let investor_share_b =
            (swap_pool_treasury_token_b_ata_balance.value.amount * investorPoolShareTokenB) /
            initialAmountB;
          setInvestorProfitAvailableTokenB(investor_share_b - investorProfitWithdrawnTokenB);
        } catch (e) {
          setInvestorProfitAvailableTokenB(0);
        }
      } catch (e) {
        console.log(e);
        setRatioAB(1);
        setRatioBA(1);
      }
    };
    handleTokenChange();
  }, [program, poolItem]);

  const { withdrawInvestmentPool, withdrawProfitPool } = useInstructions();

  const handleWithdrawInvestment = async (isTokenA) => {
    await withdrawInvestmentPool(poolItem.address, mintA, mintB, isTokenA);
    Router.reload()
  };

  const handleWithdrawProfit = async (isTokenA) => {
    await withdrawProfitPool(poolItem.address, mintA, mintB, isTokenA);
    Router.reload()
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.tokenAContainer}>
        <div className={styles.tokenDetailContainer}>
          <div className={styles.tokenImageContainer}>
            <Image
              className={styles.tokenImage}
              src={imageSourceA}
              width={100}
              height={100}
              alt="Token Image"
            />
          </div>
          <div className={styles.tokenNameContainer}>
            <span className={styles.tokenNameSpan}>{nameA}</span>
          </div>
          <div className={styles.tokenRatioContainer}>
            <span className={styles.tokenRatioSpan}>1 &#x2192; {ratioBA.toFixed(4)}</span>
          </div>
        </div>
        <div className={styles.withdrawalContainer}>
          <div className={styles.profitWithdrawalContainer}>
            <div className={styles.amountDiv}>
              <div className={styles.amountTitle}>profit</div>
              <div className={styles.amountValue}>
                {investorProfitAvailableTokenA}
              </div>
            </div>
            <div
              className={ investorProfitAvailableTokenA > 0 ? styles.withdrawButtonActive : styles.withdrawButtonInActive}
              onClick={() => (investorProfitAvailableTokenA > 0 ? handleWithdrawProfit(true): {})}
            >
              Withdraw Profit
            </div>
          </div>
          <div className={styles.tokenWithdrawalContainer}>
            <div className={styles.amountDiv}>
              <div className={styles.amountTitle}>amount</div>
              <div className={styles.amountValue}>
                {investorInvestmentAvailableTokenA}
              </div>
            </div>
            <div
              className={investorInvestmentAvailableTokenA > 0 ? styles.withdrawButtonActive : styles.withdrawButtonInActive}
              onClick={() => (investorInvestmentAvailableTokenA > 0 ? handleWithdrawInvestment(true) : {})}
            >
              Withdraw Investment
            </div>
          </div>
        </div>
      </div>
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
      </div>
      <div className={styles.tokenBContainer}>
        <div className={styles.withdrawalContainer}>
          <div className={styles.profitWithdrawalContainer}>
            <div className={styles.amountDiv}>
              <div className={styles.amountTitle}>profit</div>
              <div className={styles.amountValue}>
                {investorProfitAvailableTokenB}
              </div>
            </div>
            <div
              className={investorProfitAvailableTokenB > 0 ? styles.withdrawButtonActive : styles.withdrawButtonInActive}
              onClick={() => (investorProfitAvailableTokenB > 0 ? handleWithdrawProfit(false) : {})}
            >
              Withdraw Profit
            </div>
          </div>
          <div className={styles.tokenWithdrawalContainer}>
            <div className={styles.amountDiv}>
              <div className={styles.amountTitle}>amount</div>
              <div className={styles.amountValue}>
                {investorInvestmentAvailableTokenB}
              </div>
            </div>
            <div
              className={investorInvestmentAvailableTokenB > 0 ? styles.withdrawButtonActive : styles.withdrawButtonInActive}
              onClick={() => (investorInvestmentAvailableTokenB > 0 ? handleWithdrawInvestment(false) : {})}
            >
              Withdraw Investment
            </div>
          </div>
        </div>
        <div className={styles.tokenDetailContainer}>
          <div className={styles.tokenImageContainer}>
            <Image
              className={styles.tokenImage}
              src={imageSourceB}
              width={100}
              height={100}
              alt="Token Image"
            />
          </div>
          <div className={styles.tokenNameContainer}>
            <span className={styles.tokenNameSpan}>{nameB}</span>
          </div>
          <div className={styles.tokenRatioContainer}>
            <span className={styles.tokenRatioSpan}>1 &#x2192; {ratioAB.toFixed(4)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInvestmentsItems;
