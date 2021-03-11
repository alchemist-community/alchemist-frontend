import aludelAbi from "./aludelAbi";
import { ethers } from "ethers";
import { formatUnits } from "ethers/lib/utils";

const args = {
  aludel: "0xf0D415189949d913264A454F57f4279ad66cB24d",
};
// fetch contracts
interface Rewards {
  currStakeRewards: string;
  currVaultRewards: string;
  futStakeRewards: string;
  futVaultRewards: string;
}

interface Crucible {
  id: string;
  balance: string;
  lockedBalance: string;
}

export async function getUserRewards(
  signer: any,
  crucibles: Crucible[]
): Promise<Rewards[]> {
  let plusOneYear = Date.now() + 60 * 60 * 24 * 365;
  const aludel = new ethers.Contract(args.aludel, aludelAbi, signer);
  const crucibleRewards = [];
  for (let i = 0; i < crucibles.length; i++) {
    let [
      currStakeRewards,
      currVaultRewards,
      futStakeRewards,
      futVaultRewards,
    ] = await Promise.all([
      aludel
        .getCurrentStakeReward(crucibles[i].id, crucibles[i].lockedBalance)
        .then(formatUnits),
      aludel.getCurrentVaultReward(crucibles[i].id).then(formatUnits),
      aludel
        .getFutureStakeReward(
          crucibles[i].id,
          crucibles[i].lockedBalance,
          plusOneYear
        )
        .then(formatUnits),
      aludel
        .getFutureVaultReward(crucibles[i].id, plusOneYear)
        .then(formatUnits),
    ]);
    crucibleRewards.push({
      currStakeRewards,
      currVaultRewards,
      futStakeRewards,
      futVaultRewards,
    });
  }
  return crucibleRewards;
}

// export async function getCurrentStakeReward(
//   signer: any,
//   crucibleAddress: string,
//   stakeAmount: string
// ): Promise<string> {
//   const aludel = new ethers.Contract(args.aludel, aludelAbi, signer)

//   return await aludel.getCurrentStakeReward(crucibleAddress, stakeAmount).then(formatUnits)

// }

// export async function getCurrentUnlockedRewards(
//   signer: any,
//   crucibleAddress: string,
// ): Promise<string> {
//   const aludel = new ethers.Contract(args.aludel, aludelAbi, signer)
//   let plusOneYear = Date.now() + 60 * 60 * 24 * 365
//   return await aludel.getCurrentUnlockedRewards(plusOneYear).then(formatUnits)

// }

// export async function getFutureUnlockedRewards(
//   signer: any,
//   crucibleAddress: string,
// ): Promise<string> {
//   const aludel = new ethers.Contract(args.aludel, aludelAbi, signer)
//   let plusOneYear = Date.now() + 60 * 60 * 24 * 365
//   return await aludel.getFutureUnlockedRewards(plusOneYear).then(formatUnits)

// }

// export async function getFutureVaultReward(
//   signer: any,
//   crucibleAddress: string,
// ): Promise<string> {
//   const aludel = new ethers.Contract(args.aludel, aludelAbi, signer)
//   let plusOneYear = Date.now() + 60 * 60 * 24 * 365
//   return await aludel.getFutureUnlockedRewards(plusOneYear).then(formatUnits)

// }
