import { ethers } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import crucibleFactoryAbi from "./crucibleFactoryAbi";
import aludelAbi from "./aludelAbi";
import Crucible from "./Crucible.json";
import IERC20 from "./IERC20.json";

export async function getOwnedCrucibles(signer: any, provider: any) {
  const crucibleFactoryAddress = "0x54e0395CFB4f39beF66DBCd5bD93Cca4E9273D56";
  const lpTokenAddress = "0xCD6bcca48069f8588780dFA274960F15685aEe0e";
  const aludelAddress = "0xf0D415189949d913264A454F57f4279ad66cB24d";
  const walletAddress = await signer.getAddress();

  const token = new ethers.Contract(
    "0xCD6bcca48069f8588780dFA274960F15685aEe0e",
    IERC20.abi,
    signer
  );
  const crucibleFactory = new ethers.Contract(
    crucibleFactoryAddress,
    crucibleFactoryAbi,
    signer
  );
  const aludel = new ethers.Contract(aludelAddress, aludelAbi, signer);

  const filter = crucibleFactory.filters.Transfer(null, walletAddress);
  const crucibleEvents = await crucibleFactory.queryFilter(filter, 0, "latest");
  const crucibles = crucibleEvents.map(async (data) => {
    const id = (data.args!.tokenId as ethers.BigNumber).toHexString();
    const crucible = new ethers.Contract(id, Crucible.abi, signer);
    const owner = crucibleFactory.ownerOf(id);
    const balance = token.balanceOf(crucible.address);
    const lockedBalance = crucible.getBalanceLocked(lpTokenAddress);
    const stakes = aludel.getVaultData(id);
    return {
      id,
      balance: await balance,
      lockedBalance: await lockedBalance,
      owner: await owner,
      stakes: await stakes,
    };
  });
  return (await Promise.all(crucibles)).filter(
    (crucible, index, resolvedCrucibles) =>
      crucible.owner === walletAddress &&
      resolvedCrucibles.slice(0, index).find((c) => c.id === crucible.id) ===
        undefined
  );
}
