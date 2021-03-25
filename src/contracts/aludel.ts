import aludelAbi from "./aludelAbi";
import { ethers } from "ethers";
import { formatUnits, parseEther } from "ethers/lib/utils";
import IERC20 from "./IERC20.json";
import { FixedNumber } from "ethers";

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

export async function getChartData(signer: any, amount: any, stakingStart:any) {
  console.log("Amount", amount.toString(), stakingStart)
  console.log("Amouunt", FixedNumber.from(amount), FixedNumber.from(amount).toString())

  const aludel = new ethers.Contract(args.aludel, aludelAbi, signer);
  const bonusMistToken = new ethers.Contract(args.mist, IERC20.abi, signer);
  const wethRewardToken = new ethers.Contract(args.weth, IERC20.abi, signer);
  const inflationStart = 1612643118;
  const rewardScalingPeriod = 60 * 24 * 60 * 60;
  const floor = 1;
  const ceiling = 10;
  const now = Math.floor(Date.now() / 1000); // Replace with staking period start
  // Total rewards pool
  let [mistRewardsBalance, wethRewardsBalance, aludelData, totalMistSupply] = await Promise.all([
    bonusMistToken.balanceOf(args.rewardPool), //returns BN
    wethRewardToken.balanceOf(args.rewardPool), //returns BN
    aludel.getAludelData(), // 5th or 7th arg
    bonusMistToken.totalSupply(),
  ])
  console.log("Aludel data", aludelData)

  let chartData = [];
  for (let day = 0; day < 3; day += 3) {
    const daysAdditionalInSecs =  day * 60 * 60 * 24;
    const stakeDuration = now + daysAdditionalInSecs - stakingStart; 
    // Get rewards and stake units at future time (days elapsed)
    let sharesOutstanding = aludelData[4]
    let currentTotalStakeUnits = aludelData[6]
    let currentTotalStake = aludelData[5]
    let scheduleShares = aludelData[8][0][2] // assumes 1 schedule

    const totalUnlockedWeiRewards = getFutureUnlockedRewards(daysAdditionalInSecs, wethRewardsBalance, sharesOutstanding, scheduleShares); //returns BN

    // total stake units = total stake amount * total duration
    // const totalStakeUnits = FixedNumber.from(currentTotalStake).mulUnsafe(FixedNumber.from(now  + daysAdditionalInSecs - inflationStart));

    // Stake units = LP token amount * user stake duration
    let userStake = FixedNumber.from(amount).mulUnsafe(FixedNumber.from(now  + daysAdditionalInSecs - stakingStart)) 

    console.log("User Stake", userStake.toString())
    console.log("Total Stake", aludelData[5].toString())
    console.log("Total Stake Units", currentTotalStakeUnits.toString())
    console.log("Total Unlocked Rewards", totalUnlockedWeiRewards.toString(), currentTotalStakeUnits.toString())
    console.log("Seconds Elapsed", daysAdditionalInSecs.toString())
    console.log("Stake Duration", stakeDuration)
    
    // total unlocked wei * user stake / total stake 
    let weiRewards = totalUnlockedWeiRewards.mulUnsafe(userStake).divUnsafe(FixedNumber.from(currentTotalStakeUnits)); // creates ratio of pool owned
    console.log("Wei rewards before multiplier", weiRewards.toString())

    if (stakeDuration <= 5184000) {
      console.log("less than 60 days")
      weiRewards = weiRewards
        .mulUnsafe(FixedNumber.from(stakeDuration))
        .divUnsafe(FixedNumber.from(rewardScalingPeriod))
        .mulUnsafe(FixedNumber.from(ceiling - floor)) // 9
        .divUnsafe(FixedNumber.from(ceiling)); // 10
    }

    console.log("Wei Rewards with multiplier", weiRewards.toString());

    // Calculate inflation bonuses to mist rewards pools
    const inflationPeriodLength = 1209600;
    const inflationRate = 1.01;
    const inflationToBonusRate = 2;
    const inflationPeriodsElapsedFromNow = Math.floor(
      daysAdditionalInSecs / inflationPeriodLength
    );
    let totalMist = totalMistSupply.toString().slice(0, totalMistSupply.toString().length - 18)
    
    let bonusTokensFromInflation = parseEther((( totalMist * Math.pow(inflationRate, inflationPeriodsElapsedFromNow )- totalMist)/inflationToBonusRate).toString())
    const futureMistBalance = mistRewardsBalance.add(bonusTokensFromInflation);
    // Calculate future mist reward pool size
    const mistRewards = weiRewards
      .mulUnsafe(FixedNumber.from(futureMistBalance))
      .divUnsafe(FixedNumber.from(totalUnlockedWeiRewards))


    console.log("Mist Rewards", mistRewards.toString());
    // Convert to string
    chartData.push({
      name: `Day ${day}`,
      weiRewards: weiRewards.toString(),
      mistRewards: mistRewards.toString(),
    });
  }
  return chartData;
}

function getFutureUnlockedRewards(additionlDaysInSeconds: number, rewardBalance: any, sharesOutstanding: any, scheduleShares: any) {
  const now = Math.floor(Date.now() / 1000); // good
  console.log("sharesOutstanding", sharesOutstanding);
  console.log("days in seconds", additionlDaysInSeconds);
  const scheduleStart = 1613656364; // good
  const scheduleDuration = 7776000; // good
  const duration = now + additionlDaysInSeconds - scheduleStart;
  console.log("Here", duration, scheduleDuration)
  if (duration > scheduleDuration) {
    return FixedNumber.from(scheduleShares).mulUnsafe(FixedNumber.from(rewardBalance)).divUnsafe(FixedNumber.from(sharesOutstanding))
  }
  // Correct!
  const sharesLocked = FixedNumber.from(scheduleShares)
  .subUnsafe(
    FixedNumber.from(scheduleShares)
    .mulUnsafe(FixedNumber.from(now - scheduleStart))
    .divUnsafe(FixedNumber.from(scheduleDuration)))
  console.log("Shares locked", sharesLocked.toString())

    
  // const rewardLocked  = sharesLocked
  //   .mulUnsafe(FixedNumber.from(rewardBalance))
  //   .divUnsafe(FixedNumber.from(sharesOutstanding))

    const rewardLocked  = sharesLocked
    .mulUnsafe(FixedNumber.from(rewardBalance))
    .divUnsafe(FixedNumber.from(scheduleShares)) // ?
  
  console.log("Reward locked", rewardLocked.toString())


  const unlockedRewards = FixedNumber.from(rewardBalance).subUnsafe(rewardLocked)
  console.log("Unlcoked rewards", unlockedRewards.toString())
  console.log("What it should be 12398635547290105021 ")
  console.log("args", duration.toString(),
  scheduleDuration.toString(),
  rewardBalance.toString(),
  sharesOutstanding.toString(),
  scheduleShares.toString())
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
