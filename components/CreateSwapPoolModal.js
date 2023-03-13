import Select from "react-select";
import { optionsTokens } from "@/constants";
import { useState } from "react";
import { useInstructions } from "@/hooks/instructions";

const styles = {
  wrapper: `w-[70rem] h-[50rem] flex flex-col justify-center items-center gap-[1rem] p-[1rem] font-mediumSerif overflow-scroll`,
  header: `flex font-bold text-[2rem] justify-center`,
  subHeader: `flex font-bold text-[1rem] justify-center`,
  fieldContainer: `flex justify-between`,
  fieldNameContainer: `flex mx-[2rem]`,
  fieldNameSpan: `flex`,
  fieldValueContainer: `flex`,
  tokenSelect: `flex`,
  amountInput: `flex bg-transparent text-black`,
  createPoolButton: `w-fit mx-[2rem] mt-[2rem] p-[1rem] flex justify-center bg-[#50D890] text-[#272727] font-bold text-1.5xl`,
};

const CreateSwapPoolModal = () => {
  const [mintA, setMintA] = useState("");
  const [amountA, setAmountA] = useState(0);
  const [mintB, setMintB] = useState("");
  const [amountB, setAmountB] = useState(0);
  const [swapFeePercent, setSwapFeePercent] = useState(0);
  const [swapverseFeePercent, setSwapverseFeePercent] = useState(0);
  const [minInvestmentAmount, setMinInvestmentAmount] = useState(0);
  const [maxDaysToFill, setMaxDaysToFill] = useState(0);
  const [swapLifeInDays, setSwapLifeInDays] = useState(0);

  const { createSwapPool } = useInstructions();

  const handleTokenAChange = async (selected, selectaction) => {
    const { action } = selectaction;
    if (action === "clear") {
      setMintA("");
    } else if (action === "select-option") {
      setMintA(selected.value.mint);
    } else if (action === "remove-value") {
      setMintA("");
    }
  };

  const handleTokenBChange = async (selected, selectaction) => {
    const { action } = selectaction;
    if (action === "clear") {
      setMintB("");
    } else if (action === "select-option") {
      setMintB(selected.value.mint);
    } else if (action === "remove-value") {
      setMintB("");
    }
  };

  const handleAmountAChange = async (e) => {
    setAmountA(e.target.value);
  };

  const handleAmountBChange = async (e) => {
    setAmountB(e.target.value);
  };

  const handleSwapFeePercentChange = async (e) => {
    setSwapFeePercent(e.target.value);
  };

  const handleSwapverseFeePercentChange = async (e) => {
    setSwapverseFeePercent(e.target.value);
  };

  const handleMinInvestmentAmountChange = async (e) => {
    setMinInvestmentAmount(e.target.value);
  };

  const handleMaxDaysToFillChange = async (e) => {
    setMaxDaysToFill(e.target.value);
  };

  const handleSwapLifeInDaysChange = async (e) => {
    setSwapLifeInDays(e.target.value);
  };

  const handleRequest = async () => {
    if (
      mintA !== "" &&
      mintB !== "" &&
      amountA > 0 &&
      amountB > 0 &&
      swapFeePercent > 0 &&
      swapverseFeePercent > 0 &&
      minInvestmentAmount > 0 &&
      maxDaysToFill > 0 &&
      swapLifeInDays > 0
    ) {
      await createSwapPool(
        mintA,
        mintB,
        amountA,
        amountB,
        swapFeePercent,
        swapverseFeePercent,
        minInvestmentAmount,
        maxDaysToFill,
        swapLifeInDays
      );
    } else {
      console.log("handle request: Some values are not set");
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>Create new token swap pool</div>
      <div className={styles.subHeader}>
        Available only for testing purposes
      </div>
      <div className={styles.fieldContainer}>
        <div className={styles.fieldNameContainer}>
          <span className={styles.fieldNameSpan}>Token A</span>
        </div>
        <div className={styles.fieldValueContainer}>
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
        </div>
      </div>
      <div className={styles.fieldContainer}>
        <div className={styles.fieldNameContainer}>
          <span className={styles.fieldNameSpan}>Token B</span>
        </div>
        <div className={styles.fieldValueContainer}>
          <Select
            id="selectTokens"
            instanceId="selectTokens"
            name="tokens"
            className={styles.tokenSelect}
            classNamePrefix="select"
            isClearable="true"
            options={optionsTokens}
            onChange={handleTokenBChange}
            placeholder="Token 1"
          />
        </div>
      </div>
      <div className={styles.fieldContainer}>
        <div className={styles.fieldNameContainer}>
          <span className={styles.fieldNameSpan}>Token A amount</span>
        </div>
        <div className={styles.fieldValueContainer}>
          <input
            className={styles.amountInput}
            placeholder="Amount"
            type="number"
            onChange={handleAmountAChange}
          />
        </div>
      </div>
      <div className={styles.fieldContainer}>
        <div className={styles.fieldNameContainer}>
          <span className={styles.fieldNameSpan}>Token B amount</span>
        </div>
        <div className={styles.fieldValueContainer}>
          <input
            className={styles.amountInput}
            placeholder="Amount"
            type="number"
            onChange={handleAmountBChange}
          />
        </div>
      </div>
      <div className={styles.fieldContainer}>
        <div className={styles.fieldNameContainer}>
          <span className={styles.fieldNameSpan}>Swap fee percentage</span>
        </div>
        <div className={styles.fieldValueContainer}>
          <input
            className={styles.amountInput}
            placeholder="Amount"
            type="number"
            onChange={handleSwapFeePercentChange}
          />
        </div>
      </div>
      <div className={styles.fieldContainer}>
        <div className={styles.fieldNameContainer}>
          <span className={styles.fieldNameSpan}>Platform fee percentage</span>
        </div>
        <div className={styles.fieldValueContainer}>
          <input
            className={styles.amountInput}
            placeholder="Amount"
            type="number"
            onChange={handleSwapverseFeePercentChange}
          />
        </div>
      </div>
      <div className={styles.fieldContainer}>
        <div className={styles.fieldNameContainer}>
          <span className={styles.fieldNameSpan}>
            Minimum investment amount
          </span>
        </div>
        <div className={styles.fieldValueContainer}>
          <input
            className={styles.amountInput}
            placeholder="Amount"
            type="number"
            onChange={handleMinInvestmentAmountChange}
          />
        </div>
      </div>
      <div className={styles.fieldContainer}>
        <div className={styles.fieldNameContainer}>
          <span className={styles.fieldNameSpan}>Max days to fill pool</span>
        </div>
        <div className={styles.fieldValueContainer}>
          <input
            className={styles.amountInput}
            placeholder="Amount"
            type="number"
            onChange={handleMaxDaysToFillChange}
          />
        </div>
      </div>
      <div className={styles.fieldContainer}>
        <div className={styles.fieldNameContainer}>
          <span className={styles.fieldNameSpan}>Swap life in days</span>
        </div>
        <div className={styles.fieldValueContainer}>
          <input
            className={styles.amountInput}
            placeholder="Amount"
            type="number"
            onChange={handleSwapLifeInDaysChange}
          />
        </div>
      </div>
      <div className={styles.createPoolButton} onClick={handleRequest}>
        Create Pool
      </div>
    </div>
  );
};

export default CreateSwapPoolModal;
