import { ethers } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { config } from "../config/app";
import IERC20 from "./IERC20.json";
const { lpTokenAddress, mistTokenAddress } = config;

export async function getTokenBalances(signer: any) {
  const walletAddress = await signer.getAddress();
  const lp = new ethers.Contract(
    lpTokenAddress,
    IERC20.abi,
    signer
  ).balanceOf(walletAddress);

  const token = new ethers.Contract(
    mistTokenAddress,
    IERC20.abi,
    signer
  ).balanceOf(walletAddress);

  let mistBalance = await token;
  let lpBalance = await lp;
  return {
    mistBalance,
    lpBalance,
    cleanMist: formatUnits(mistBalance),
    cleanLp: formatUnits(lpBalance),
  };
}
