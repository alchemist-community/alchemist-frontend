import { ethers } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import crucibleFactoryAbi from "./crucibleFactoryAbi";
import Crucible from "./Crucible.json";

export async function getOwnedCrucibles(signer: any, provider: any) {
  const crucibleFactoryAddress = "0x54e0395CFB4f39beF66DBCd5bD93Cca4E9273D56";
  const walletAddress = await signer.getAddress();

  const crucibleFactory = new ethers.Contract(
    crucibleFactoryAddress,
    crucibleFactoryAbi,
    signer
  );
  const filter = crucibleFactory.filters.Transfer(null, walletAddress);
  const crucibleEvents = await crucibleFactory.queryFilter(filter, 0, "latest");
  const crucibles = crucibleEvents.map(async (data) => {
    const id = (data.args!.tokenId as ethers.BigNumber).toHexString();
    const crucible = new ethers.Contract(id, Crucible.abi, signer);
    const balance = formatUnits(
      await crucible.getBalanceLocked(
        "0xcd6bcca48069f8588780dfa274960f15685aee0e"
      ),
      18
    ); // LP token
    return {
      id,
      balance,
    };
  });
  return await Promise.all(crucibles);
}
