import Select from "react-select";
import { optionsTokens, UNIT } from "@/constants";
import { useState } from "react";
import { useInstructions } from "@/hooks/instructions";

const styles = {
  wrapper: `w-[30rem] h-[30rem] flex flex-col justify-start items-center gap-[1rem] p-[1rem] font-mediumSerif overflow-scroll`,
  header: `flex font-bold text-[2rem] justify-center`,
  subHeader: `flex font-bold text-[1rem] justify-center`,
  selectTokenContainer: `flex`,
  tokenSelect: `text-[#4F98CA] font-bold input-[#4F98CA] mx-[0.5rem] flex`,
  amountInputContainer: `flex`,
  amountInput: `flex text-[2rem] px-[1rem] py-[0.5rem]`,
  getTokenButton: `w-fit mx-[2rem] mt-[2rem] p-[1rem] flex justify-center items-center bg-[#50D890] text-[#272727] font-bold text-1.5xl`,
};

const TestTokenModal = () => {
  const [mint, setMint] = useState("");
  const [amount, setAmount] = useState(0);

  const { getTestTokens } = useInstructions();

  const handleTokenChange = async (selected, selectaction) => {
    const { action } = selectaction;
    if (action === "clear") {
      setMint("");
    } else if (action === "select-option") {
      setMint(selected.value.mint);
    } else if (action === "remove-value") {
      setMint("");
    }
  };

  const handleAmountChange = async (e) => {
    setAmount(e.target.value);
  };

  const handleRequest = async () => {
    if (amount > 0 && mint !== "") {
      await getTestTokens(mint, amount);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>Get test tokens</div>
      <div className={styles.subHeader}>
        Available only for testing purposes
      </div>
      <div className={styles.selectTokenContainer}>
        <Select
          id="selectTokens"
          instanceId="selectTokens"
          name="tokens"
          className={styles.tokenSelect}
          classNamePrefix="select"
          isClearable="true"
          options={optionsTokens}
          onChange={handleTokenChange}
          placeholder="Select Token"
        />
      </div>
      <div className={styles.amountInputContainer}>
        <input
          className={styles.amountInput}
          placeholder="Amount"
          type="number"
          onChange={handleAmountChange}
        />
      </div>
      <div className={styles.getTokenButton} onClick={handleRequest}>
        Get Tokens
      </div>
    </div>
  );
};

export default TestTokenModal;
