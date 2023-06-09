import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import SwapPools from "@/components/SwapPools";
import SwapTokens from "@/components/SwapTokens";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

const styles = {
  container: `max-w-7xl flex-1`,
  postsList: `flex flex-col gap-3 p-2 sm:grid-cols-2 md:gap-6 md:p-6 lg:grid-cols-3`,
  main: `flex justify-center`,
  wrapper: `w-screen flex mx-auto my-[1rem]`,
  swapPoolsContainer: `flex justify-center h-screen flex-[2] flex justify-items-center justify-center p-[1rem] border-r border-[#383838]`,
  swapTokensContainer: `flex justify-center h-screen flex-[1] flex flex-grow justify-items-center justify-center p-[1rem]`,
};

export default function Home() {
  const [swapPoolAddress, setSwapPoolAddress] = useState("");
  const [hideDiv, setHideDiv] = useState(true);

  const swapItemOnClick = (swapPoolAddress) => {
    setSwapPoolAddress(swapPoolAddress);
    setHideDiv(false);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.swapPoolsContainer}>
        <SwapPools itemOnClick={swapItemOnClick} />
      </div>
      <div className={styles.swapTokensContainer}>
        {hideDiv ? (
          <></>
        ) : (
          <SwapTokens key={swapPoolAddress} swapPoolAddress={swapPoolAddress} />
        )}
      </div>
    </div>
  );
}
