import Link from "next/link";
import Modal from "react-modal";
import TestTokenModal from "./TestTokenModal";
import CreateSwapPoolModal from "./CreateSwapPoolModal";
import { useRouter } from "next/router";
import { useInstructions } from "@/hooks/instructions";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#fff",
    padding: 0,
    border: "none",
  },
  overlay: {
    backgroundColor: "rgba{10, 11, 13, 0.75}",
  },
};

const styles = {
  wrapper: `h-[5rem] w-[40-rem] flex flex-col justify-between justify-center p-[1rem] border-t border-[#383838]`,
  item: `cursor-pointer text-[#808080]`,
};

const Footer = () => {
  const router = useRouter();
  const { initialized, transactionPending, initializeGlobalState } =
    useInstructions();
  return (
    <div className={styles.wrapper}>
      <div className={styles.item}>
        <Link href={"/?getTestToken=1"}>
          <div className={styles.link}>Get Test Tokens</div>
        </Link>
      </div>
      <div className={styles.item}>
        <Link href={"/?createNewPool=1"}>
          <div className={styles.link}>Create a new Pool</div>
        </Link>
      </div>
      <Modal
        isOpen={Boolean(router.query.getTestToken)}
        onRequestClose={() => router.push("/")}
        style={customStyles}
      >
        <TestTokenModal />
      </Modal>
      <Modal
        isOpen={Boolean(router.query.createNewPool)}
        onRequestClose={() => router.push("/")}
        style={customStyles}
      >
        <CreateSwapPoolModal />
      </Modal>
    </div>
  );
};

export default Footer;
