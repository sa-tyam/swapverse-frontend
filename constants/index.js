import { PublicKey } from "@solana/web3.js";
import UsdcImage from "../static/usdc.png";
import UsdtImage from "../static/usdt.png";
import UxdImage from "../static/uxd.png";
import PaiImage from "../static/pai.png";
import UsdhImage from "../static/usdh.png";

export const UNIT = 1_000_000;

export const SWAPVERSE_PROGRAM_PUBKEY = new PublicKey(
  "AeFLgMmKmVjLUv4jBGjXsrNf4MKPaVate5fNmqrDDoin"
);

export const USDCToken = {
  name: "USDC",
  mint: new PublicKey("Y85LaoyKCUFcpJHmsELsqT2TTuJDm86AD6G2GNqzXxs"),
  imageSource: UsdcImage,
};

export const USDTToken = {
  name: "USDT",
  mint: new PublicKey("8qFZnBBJrGYFuvytjZLtEZVDxwKhRLUMc1jepWF6QDKq"),
  imageSource: UsdtImage,
};

export const UXDToken = {
  name: "UXD",
  mint: new PublicKey("E23WEDP3m7wEv8rRWeaawzR9s8mkjiAA9dMQFJ25Wfro"),
  imageSource: UxdImage,
};

export const PAIToken = {
  name: "PAI",
  mint: new PublicKey("9UYM7aCDvBKoCNXa152qyUZSzCDQM8uBy834YayoEejL"),
  imageSource: PaiImage,
};

export const USDHToken = {
  name: "USDH",
  mint: new PublicKey("Dnjiw4cn3nYUry5FNBC1yN6EzZb5zoqEz6UKTVqQV4pP"),
  imageSource: UsdhImage,
};

export const optionsTokens = [
  { value: USDCToken, label: "USDC" },
  { value: USDTToken, label: "USDT" },
  { value: UXDToken, label: "UXD" },
  { value: PAIToken, label: "PAI" },
  { value: USDHToken, label: "USDH" },
];

export const getTokenInfo = (tokenMint) => {
  if (tokenMint === "Y85LaoyKCUFcpJHmsELsqT2TTuJDm86AD6G2GNqzXxs") {
    return USDCToken;
  } else if (tokenMint === "8qFZnBBJrGYFuvytjZLtEZVDxwKhRLUMc1jepWF6QDKq") {
    return USDTToken;
  } else if (tokenMint === "E23WEDP3m7wEv8rRWeaawzR9s8mkjiAA9dMQFJ25Wfro") {
    return UXDToken;
  } else if (tokenMint === "9UYM7aCDvBKoCNXa152qyUZSzCDQM8uBy834YayoEejL") {
    return PAIToken;
  } else if (tokenMint === "Dnjiw4cn3nYUry5FNBC1yN6EzZb5zoqEz6UKTVqQV4pP") {
    return USDHToken;
  }
};

export const tokenAFilter = (tokenBase58PublicKey) => ({
  memcmp: {
    offset: 19, // Discriminator.
    bytes: tokenBase58PublicKey,
  },
});

export const tokenBFilter = (tokenBase58PublicKey) => ({
  memcmp: {
    offset: 51, // Discriminator.
    bytes: tokenBase58PublicKey,
  },
});

export const investorPoolInfoFilter = (investorBase58PublicKey) => ({
  memcmp: {
    offset: 8, // Discriminator.
    bytes: investorBase58PublicKey,
  },
});
