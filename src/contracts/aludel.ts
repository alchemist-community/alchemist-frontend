import aludelAbi from "./aludelAbi";
import { ethers } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import IUniswapV2ERC20 from "@uniswap/v2-core/build/IUniswapV2ERC20.json";
import { config } from "../config/app";

const { aludelAddress, mistTokenAddress, wethAddress, rewardPool } = config;

const args = {
  aludel: aludelAddress,
};
// fetch contracts
interface EtherRewards {
  currStakeRewards: string;
  currVaultRewards: string;
  futStakeRewards: string;
  futVaultRewards: string;
}

interface Rewards {
  etherRewards: number;
  tokenRewards: number;
}

interface Crucible {
  id: string;
  balance: string;
  lockedBalance: string;
}
export async function getNetworkStats(signer: any) {
  const aludel = new ethers.Contract(args.aludel, aludelAbi, signer);
  let [
    stakingToken,
    rewardToken,
    rewardPool,
    rewardScaling, // arrray of big numbers, floor ceiling time
    rewardSharesOutstanding,
    totalStake,
    totalStakeUnits,
    lastUpdate,
    rewardSchedules,
  ] = await aludel.getAludelData();
  let [duration, start, shares] = rewardScaling;
  let [floor, ceiling, time] = rewardSchedules[0];
  return {
    duration: duration.toNumber(),
    start: start.toNumber(),
    shares: formatUnits(shares),
    floor: formatUnits(floor),
    ceiling: formatUnits(ceiling),
    time: formatUnits(time),
    rewardSharesOutstanding: formatUnits(rewardSharesOutstanding),
    totalStake: formatUnits(totalStake),
    totalStakeUnits: formatUnits(totalStakeUnits),
    lastUpdate: lastUpdate.toNumber(),
  };
}

// 1. (current rewards / available rewards) * (available eth / total eth) * total mist
// 2. Your portion of reward pool * fraction of eth pool currently unlocked * total mist
// 3. (Your staking units / Total units) * (getCurrentUnlockedRewards: Eth / total reward pool in Eth) * total mist

// Returns array with vault rewards (current and projected)
export async function getUserRewards(
  signer: any,
  crucibles: Crucible[]
): Promise<EtherRewards[]> {
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

// Calculate mist rewards based on eth
// eth rewards / total eth pool * total mist rewards (remaining rewards)
export async function calculateMistRewards(
  signer: any,
  weiRewards: number,
  timestamp?: number
): Promise<Rewards> {
  if (!timestamp) timestamp = Date.now();
  // const aludel = new ethers.Contract(args.aludel, aludelAbi, signer);
  // Bonus token (mist) & Reward Pool Addreess
  let bonusMistToken = new ethers.Contract(
    mistTokenAddress, // bonus token address
    IUniswapV2ERC20.abi,
    signer
  );
  let weth = new ethers.Contract(
    wethAddress, // bonus token address
    IUniswapV2ERC20.abi,
    signer
  );
  let totalWeiRewards = await weth.balanceOf(
    rewardPool
  ); // Reward Pool
  let mistRewards =
    ((await bonusMistToken.balanceOf(
      rewardPool
    )) *
      weiRewards) /
    totalWeiRewards;
  return { tokenRewards: mistRewards, etherRewards: weiRewards };
}
