import { ethers } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import IERC20 from "./IERC20.json";

export async function getTokenBalances() {
  const provider = new ethers.providers.Web3Provider((window as any).ethereum);
  const signer = provider.getSigner();

  const walletAddress = await signer.getAddress();

  const lp = new ethers.Contract(
    "0xCD6bcca48069f8588780dFA274960F15685aEe0e",
    IERC20.abi,
    signer
  ).balanceOf(walletAddress);

  const token = new ethers.Contract(
    "0x88ACDd2a6425c3FaAE4Bc9650Fd7E27e0Bebb7aB",
    IERC20.abi,
    signer
  ).balanceOf(walletAddress);

  return {
    alchemist: formatUnits(await token),
    lp: formatUnits(await lp),
  };
}
