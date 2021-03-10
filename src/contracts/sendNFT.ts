import { ethers } from "ethers";
import crucibleFactoryAbi from './crucibleFactoryAbi'

export async function sendNFT(signer: any, id:string, to:string) {
    const crucibleFactoryAddress = "0x54e0395CFB4f39beF66DBCd5bD93Cca4E9273D56";
  const walletAddress = await signer.getAddress();

  const crucibleFactory = new ethers.Contract(
    crucibleFactoryAddress,
    crucibleFactoryAbi,
    signer
  );

  await crucibleFactory['safeTransferFrom(address,address,uint256)'](walletAddress, to, ethers.BigNumber.from(id))

}