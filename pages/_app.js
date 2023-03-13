import Head from "next/head";
import "@/styles/globals.css";
// Import WalletConnectionProvider from components
import { WalletConnectProvider } from "../components/WalletConnectProvider";
// Import the solana wallet css
import "@solana/wallet-adapter-react-ui/styles.css";
import UserNavbar from "../components/UserNavbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Swapverse</title>
      </Head>
      <main>
        {/* Wrap provider around App */}
        <WalletConnectProvider>
        <div><Toaster/></div>
          <UserNavbar />
          <Component {...pageProps} />
          <Footer />
        </WalletConnectProvider>
      </main>
    </>
  );
}
