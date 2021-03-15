import IUniswapV2ERC20 from "@uniswap/v2-core/build/IUniswapV2ERC20.json";
import { ethers } from "ethers";
import { formatEther, parseUnits, randomBytes } from "ethers/lib/utils";
import { signPermission, signPermitEIP2612 } from "./utils";
import aludelAbi from "./aludelAbi";
import crucibleFactoryAbi from "./crucibleFactoryAbi";
import transmuterAbi from "./transmuterAbi";
import Crucible from "./Crucible.json";

export async function mintAndLock(
  signer: any,
  provider: any,
  rawAmount: string
): Promise<string> {
  const args = {
    aludel: "0xf0D415189949d913264A454F57f4279ad66cB24d",
    crucibleFactory: "0x54e0395CFB4f39beF66DBCd5bD93Cca4E9273D56",
    transmuter: "0xB772ce9f14FC7C7db0D4525aDb9349FBD7ce456a",
    amount: rawAmount,
  };
  const walletAddress = await signer.getAddress();
  // fetch contracts

  const aludel = new ethers.Contract(args.aludel, aludelAbi, signer);
  //const aludel = await ethers.getContractAt('Aludel', args.aludel, signer)
  const stakingToken = new ethers.Contract(
    (await aludel.getAludelData()).stakingToken,
    IUniswapV2ERC20.abi,
    signer
  );
  const crucibleFactory = new ethers.Contract(
    args.crucibleFactory,
    crucibleFactoryAbi,
    signer
  );
  const transmuter = new ethers.Contract(
    args.transmuter,
    transmuterAbi,
    signer
  );

  // declare config

  const amount = parseUnits(args.amount, await stakingToken.decimals());
  const salt = randomBytes(32);
  const deadline = (await provider.getBlock("latest")).timestamp + 60 * 60 * 24;

  // validate balances
  if ((await stakingToken.balanceOf(walletAddress)) < amount) {
    throw new Error("Not enough balance");
  }

  // craft permission

  const crucible = new ethers.Contract(
    await transmuter.predictDeterministicAddress(
      await crucibleFactory.getTemplate(),
      salt,
      crucibleFactory.address
    ),
    Crucible.abi,
    signer
  );

  console.log("Sign Permit");

  const permit = await signPermitEIP2612(
    signer,
    walletAddress,
    stakingToken,
    transmuter.address,
    amount,
    deadline
  );

  console.log("Sign Lock");

  const permission = await signPermission(
    "Lock",
    crucible,
    signer,
    aludel.address,
    stakingToken.address,
    amount,
    0
  );

  console.log("Mint, Deposit, Stake");
  try {
    const tx = await transmuter.mintCruciblePermitAndStake(
      aludel.address,
      crucibleFactory.address,
      walletAddress,
      salt,
      permit,
      permission
    );
    console.log("  in", tx.hash);
    return tx.hash;
  } catch (e) {
    alert(e.message);
    throw e;
  }
}
