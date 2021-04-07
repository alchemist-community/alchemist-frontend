import { ethers } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { config } from "../config/app";
import IERC20 from "./IERC20.json";
import {
  ChainId,
  Token,
  WETH,
  Fetcher,
} from "@uniswap/sdk";

const { lpTokenAddress, mistTokenAddress, wethAddress, daiAddress } = config;

export async function getTokenBalances(signer: any) {
  const walletAddress = await signer.getAddress();
  const chainId =
    process.env.REACT_APP_NETWORK_ID === "1"
      ? ChainId.MAINNET
      : ChainId.RINKEBY;
  const lp = new ethers.Contract(lpTokenAddress, IERC20.abi, signer).balanceOf(
    walletAddress
  );

  const MIST = new Token(chainId, mistTokenAddress, 18, "⚗", "Alchemist");
  const DAI = new Token(chainId, daiAddress, 18);

  const [
    mistBalance,
    lpBalance,
    lpMistBalance,
    lpWethBalance,
    totalLpSupply,
    wethPrice,
    mistPrice,
  ] = await Promise.all([
    new ethers.Contract(mistTokenAddress, IERC20.abi, signer).balanceOf(
      walletAddress
    ),
    new ethers.Contract(lpTokenAddress, IERC20.abi, signer).balanceOf(
      walletAddress
    ),
    new ethers.Contract(mistTokenAddress, IERC20.abi, signer).balanceOf(
      lpTokenAddress
    ),
    new ethers.Contract(wethAddress, IERC20.abi, signer).balanceOf(
      lpTokenAddress
    ),
    new ethers.Contract(lpTokenAddress, IERC20.abi, signer).totalSupply(),
    (
      await Fetcher.fetchPairData(DAI, WETH[DAI.chainId])
    ).token1Price.toSignificant(),
    (
      await Fetcher.fetchPairData(MIST, WETH[DAI.chainId])
    ).token1Price.toSignificant(),
  ]);
  return {
    mistBalance,
    lpBalance,
    cleanMist: formatUnits(mistBalance),
    cleanLp: formatUnits(lpBalance),
    lpMistBalance,
    lpWethBalance,
    totalLpSupply,
    wethPrice: Number(wethPrice),
    mistPrice: Number(wethPrice) / Number(mistPrice),
  };
}
