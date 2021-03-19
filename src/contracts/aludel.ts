import aludelAbi from "./aludelAbi";
import { ethers } from "ethers";
import { formatUnits, parseEther } from "ethers/lib/utils";
import IERC20 from "./IERC20.json";
import { BigNumber } from "ethers";

const args = {
  aludel: "0xf0D415189949d913264A454F57f4279ad66cB24d",
  mist: "0x88ACDd2a6425c3FaAE4Bc9650Fd7E27e0Bebb7aB",
  weth: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  rewardPool: "0x04108d6E9a51BeC5170F8Fd953a156cF754bA541",
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

export async function getChartData(signer: any, amount: number) {
  const aludel = new ethers.Contract(args.aludel, aludelAbi, signer);
  const bonusMistToken = new ethers.Contract(args.mist, IERC20.abi, signer);
  const inflationStart = 1612643118;
  const rewardScalingDays = 60 * 24 * 60 * 60;
  const floor = 1;
  const ceiling = 10;
  const now = Math.floor(Date.now() / 1000);
  console.log("here", aludel);
  // Total rewards pool
  let mistPoolBalance = await bonusMistToken.balanceOf(args.rewardPool); //returns BN
  console.log("mistPoolBalance", mistPoolBalance.toString());
  let chartData = [];
  for (let day = 0; day < 90; day += 3) {
    const secondsElapsed = day * 60 * 60 * 24;
    // Get rewards and stake units at future time (days elapsed)
    const totalUnlockedWeiRewards = getFutureUnlockedRewards(secondsElapsed); //returns BN
    console.log(
      "Total unlocked rewards",
      day,
      " ",
      totalUnlockedWeiRewards.toString()
    );
    const totalStakeUnits = totalUnlockedWeiRewards.mul(
      now + secondsElapsed - inflationStart
    );
    // console.log("Total Unlocked Rewards", totalUnlockedWeiRewards.toString(), totalStakeUnits.toString())

    // Get user's wei rewards
    let weiRewards = totalUnlockedWeiRewards
      .mul(amount)
      .mul(secondsElapsed) //duration
      .div(totalStakeUnits); // creates ratio of pool owned
    if (day <= 60) {
      weiRewards = weiRewards
        .mul(secondsElapsed)
        .div(rewardScalingDays)
        .mul(ceiling - floor)
        .div(ceiling); // .9
    }

    console.log("weiRewards", weiRewards);

    // Calculate inflation bonuses to mist rewards pools
    const inflationPeriod = 1209600;
    const inflationRate = 1.01;
    const inflationToBonusRate = 2;
    const initialSupply = parseEther("1000000"); //1000000000000000000000000 (10 mil tokens)
    const inflationPeriodsElapsedFromNow = Math.floor(
      secondsElapsed / inflationPeriod
    );
    const bonusTokensFromInflation = initialSupply
      .mul(inflationRate ^ inflationPeriodsElapsedFromNow)
      .div(inflationToBonusRate);
    const futureMistBalance = mistPoolBalance.add(bonusTokensFromInflation);
    console.log("Bonus Tokens", futureMistBalance.toString());

    // Calculate future mist reward pool size
    const mistRewards = weiRewards
      .mul(futureMistBalance)
      .div(totalUnlockedWeiRewards);

    console.log("Mist Rewards", mistRewards.toString());

    chartData.push({
      name: `Day ${day}`,
      weiRewards: formatUnits(weiRewards),
      mistRewards: formatUnits(mistRewards),
    });
  }
  return chartData;
}

function getFutureUnlockedRewards(secondsElapsed: number) {
  const totalWeiRewards = parseEther("35000000");
  const now = Math.floor(Date.now() / 1000);
  console.log("(now + secondsElapsed ", now + secondsElapsed);
  const unlockStart = 1613656364;
  const unlockDuration = 7776000;
  const secondsSinceUnlock = now + secondsElapsed - unlockStart;
  if (secondsSinceUnlock > unlockDuration) return totalWeiRewards;
  const unlockedRewards = totalWeiRewards
    .mul(secondsSinceUnlock)
    .div(unlockDuration);
  return unlockedRewards;
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
    "0x88ACDd2a6425c3FaAE4Bc9650Fd7E27e0Bebb7aB", // bonus token address
    IERC20.abi,
    signer
  );
  let weth = new ethers.Contract(
    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // bonus token address
    IERC20.abi,
    signer
  );
  let totalWeiRewards = await weth.balanceOf(
    "0x04108d6E9a51BeC5170F8Fd953a156cF754bA541"
  ); // Reward Pool
  let mistRewards =
    ((await bonusMistToken.balanceOf(
      "0x04108d6E9a51BeC5170F8Fd953a156cF754bA541"
    )) *
      weiRewards) /
    totalWeiRewards;
  return { tokenRewards: mistRewards, etherRewards: weiRewards };
}
