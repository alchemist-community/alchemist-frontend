import { ethers } from "ethers";
import { config } from "../config/app";
import crucibleFactoryAbi from "./crucibleFactoryAbi";

const { crucibleFactoryAddress } = config;

export async function sendNFT(signer: any, id: string, to: string) {
  const walletAddress = await signer.getAddress();

  const crucibleFactory = new ethers.Contract(
    crucibleFactoryAddress,
    crucibleFactoryAbi,
    signer
  );

  await crucibleFactory["safeTransferFrom(address,address,uint256)"](
    walletAddress,
    to,
    ethers.BigNumber.from(id)
  );
}
