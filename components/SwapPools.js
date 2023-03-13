import SwapPoolsItem from "./SwapPoolsItem";
import Select from "react-select";
import { optionsTokens } from "@/constants";

import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import * as anchor from "@project-serum/anchor";
import { SWAPVERSE_PROGRAM_PUBKEY } from "../constants";
import swapverseIDL from "../constants/swapverse.json";
import { useState, useEffect, useMemo } from "react";
import { tokenAFilter, tokenBFilter } from "@/constants";

const styles = {
  wrapper: `w-full flex flex-col overflow-scroll items-center`,
  swapPools: `flex flex-col overflow-scroll w-fit`,
  headerContainer: `flex mb-[1rem] px-[2rem] py-[0.5rem] justify-center items-center w-fit`,
  tokenSelect: `text-[#4F98CA] font-bold input-[#4F98CA] mx-[0.5rem]`,
};

const SwapPools = ({ itemOnClick }) => {
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

  const [swapPools, setSwapPools] = useState([]);
  const [filterTokenA, setFilterTokenA] = useState("");
  const [filterTokenB, setFilterTokenB] = useState("");

  useEffect(() => {
    const findSwapPools = async () => {
      if (program && publicKey) {
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
            if (filterTokenA !== "" && filterTokenB !== "") {
              const swapAccounts = await program.account.swapPool.all([
                tokenAFilter(filterTokenA.toBase58()),
                tokenBFilter(filterTokenB.toBase58()),
              ]);
              setSwapPools(swapAccounts);
            } else if (filterTokenA !== "" && filterTokenB === "") {
              const swapAccounts = await program.account.swapPool.all([
                tokenAFilter(filterTokenA.toBase58()),
              ]);
              setSwapPools(swapAccounts);
            } else if (filterTokenA === "" && filterTokenB !== "") {
              const swapAccounts = await program.account.swapPool.all([
                tokenBFilter(filterTokenB.toBase58()),
              ]);
              setSwapPools(swapAccounts);
            } else {
              const swapAccounts = await program.account.swapPool.all();
              setSwapPools(swapAccounts);
            }
          }
        } catch (error) {
          console.log(error);
          setSwapPools([]);
        } finally {
        }
      }
    };

    findSwapPools();
  }, [publicKey, program, filterTokenA, filterTokenB]);

  const handleTokenAChange = async (selected, selectaction) => {
    const { action } = selectaction;
    if (action === "clear") {
      setFilterTokenA("");
    } else if (action === "select-option") {
      setFilterTokenA(selected.value.mint);
    } else if (action === "remove-value") {
      setFilterTokenA("");
    }
  };

  const handleTokenBChange = async (selected, selectaction) => {
    const { action } = selectaction;
    if (action === "clear") {
      setFilterTokenB("");
    } else if (action === "select-option") {
      setFilterTokenB(selected.value.mint);
    } else if (action === "remove-value") {
      setFilterTokenB("");
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerContainer}>
        <Select
          id="selectTokens"
          instanceId="selectTokens"
          name="tokens"
          className={styles.tokenSelect}
          classNamePrefix="select"
          isClearable="true"
          options={optionsTokens}
          onChange={handleTokenAChange}
          placeholder="Token 1"
        />
        <Select
          id="selectTokens"
          instanceId="selectTokens"
          name="tokens"
          className={styles.tokenSelect}
          classNamePrefix="select"
          isClearable="true"
          options={optionsTokens}
          onChange={handleTokenBChange}
          placeholder="Token 2"
        />
      </div>
      <ul className={styles.swapPools}>
        {swapPools.map((pool) =>
          pool.account.activeForSwap ? (
            <SwapPoolsItem
              key={pool.poolNumber}
              poolItem={pool}
              swapItemOnClick={itemOnClick}
            />
          ) : (
            <></>
          )
        )}
      </ul>
    </div>
  );
};

export default SwapPools;
