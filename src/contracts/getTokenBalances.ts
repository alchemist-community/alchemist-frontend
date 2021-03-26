import { ethers } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { config } from "../config/app";
import IUniswapV2ERC20 from "@uniswap/v2-core/build/IUniswapV2ERC20.json";

const { lpTokenAddress, mistTokenAddress } = config;

export async function getTokenBalances(signer: any) {
  const walletAddress = await signer.getAddress();
  const lp = new ethers.Contract(
    lpTokenAddress,
    IUniswapV2ERC20.abi,
    signer
  ).balanceOf(walletAddress);

  const token = new ethers.Contract(
    mistTokenAddress,
    IUniswapV2ERC20.abi,
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
