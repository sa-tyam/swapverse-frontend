import Image from "next/image";
import Link from "next/link";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

import { useState } from "react";
import Router from "next/router";

const styles = {
  wrapper: `h-[5rem] w-[40-rem] flex justify-between justify-center p-[1rem] border-b border-[#383838]`,
  divider: `border-b`,
  appTitleSpan: `flex flex-1 text-[#50D890] font-bold text-2xl border-b`,
  multiButton: `border-2 border-[#50D890]`,
  header: `h-[3rem] w-[20rem] flex flex-2 mx-auto border border-[#50D890]`,
  headerItem: `flex justify-center items-center w-screen`,
  headerItemActive: `flex justify-center items-center w-screen bg-[#50D890] text-[#272727] font-bold text-1.5xl cursor-pointer`,
  headerItemInActive: `flex justify-center items-center w-screen bg-[#272727] text-[#50D890] font-bold text-1.5xl cursor-pointer`,
};

const UserNav = () => {
  const [swapClicked, setSwapClicked] = useState(true);
  const [investClicked, setInvestClicked] = useState(false);

  function click_swap() {
    setSwapClicked(true);
    setInvestClicked(false);
    Router.push("/");
  }

  function click_invest() {
    setSwapClicked(false);
    setInvestClicked(true);
    Router.push("/invest");
  }

  return (
    <div className={styles.wrapper}>
      <Link href={"/"}>
        <span className={styles.appTitleSpan}>Swapverse</span>
      </Link>
      <div className={styles.header}>
        <div
          className={
            swapClicked ? styles.headerItemActive : styles.headerItemInActive
          }
          onClick={click_swap}
        >
          Swap
        </div>
        <div
          className={
            investClicked ? styles.headerItemActive : styles.headerItemInActive
          }
          onClick={click_invest}
        >
          Invest
        </div>
      </div>
      <div className={styles.multiButton}>
        {<WalletMultiButton className={styles.multiButton} />}
      </div>
    </div>
  );
};

export default UserNav;
