import UserInvestmentsItem from "./UserInvestmentsItem";

import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import * as anchor from "@project-serum/anchor";
import { SWAPVERSE_PROGRAM_PUBKEY } from "../constants";
import swapverseIDL from "../constants/swapverse.json";
import { useState, useEffect, useMemo } from "react";
import { investorPoolInfoFilter } from "@/constants";

const styles = {
  wrapper: `w-full flex flex-col overflow-scroll`,
};

const UserInvestments = () => {
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

  useEffect(() => {
    const findSwapPools = async () => {
      if (program && publicKey) {
        const pools = [];
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
            setSwapPools([]);

            const investorPoolInfos =
              await program.account.investorPoolInfo.all([
                investorPoolInfoFilter(publicKey.toBase58()),
              ]);
            for (const poolInfo of investorPoolInfos) {
              try {
                const pool = await program.account.swapPool.fetch(
                  poolInfo.account.swapPool
                );
                pools.push({ pool: pool, address: poolInfo.account.swapPool });
              } catch (e) {
                console.log(e);
              }
            }
          }
        } catch (error) {
          console.log(error);
          setSwapPools([]);
        } finally {
          setSwapPools(pools);
        }
      }
    };

    findSwapPools();
  }, [publicKey, program]);

  return (
    <div className={styles.wrapper}>
      <ul className={styles.swapPools}>
        {swapPools.map((pool) => (
          <UserInvestmentsItem key={pool.poolNumber} poolItem={pool} />
        ))}
      </ul>
    </div>
  );
};

export default UserInvestments;
