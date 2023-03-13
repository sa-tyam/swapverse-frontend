import InvestPool from "@/components/InvestPool";
import InvestPools from "@/components/InvestPools";
import { useState } from "react";

const styles = {
  container: `max-w-7xl flex-1`,
  postsList: `flex flex-col gap-3 p-2 sm:grid-cols-2 md:gap-6 md:p-6 lg:grid-cols-3`,
  main: `flex justify-center`,
  wrapper: `w-screen flex mx-auto my-[1rem]`,
  swapPoolsContainer: `flex justify-center h-screen flex-[2] flex justify-items-center justify-center p-[1rem] border-r border-[#383838]`,
  swapTokensContainer: `flex justify-center h-screen flex-[1] flex flex-grow justify-items-center justify-center p-[1rem]`,
};

export default function Invest() {
  const [swapPoolAddress, setSwapPoolAddress] = useState("");

  const [hideDiv, setHideDiv] = useState(true);

  const investItemOnClick = (swapPoolAddress) => {
    setSwapPoolAddress(swapPoolAddress);
    setHideDiv(false);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.swapPoolsContainer}>
        <InvestPools itemOnClick={investItemOnClick} />
      </div>
      <div className={styles.swapTokensContainer}>
        {hideDiv ? (
          <></>
        ) : (
          <InvestPool key={swapPoolAddress} swapPoolAddress={swapPoolAddress} />
        )}
      </div>
    </div>
  );
}
