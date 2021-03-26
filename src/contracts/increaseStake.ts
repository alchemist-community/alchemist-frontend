import { ethers } from "ethers";
import { parseUnits, randomBytes } from "ethers/lib/utils";
import { signPermission, signPermitEIP2612 } from "./utils";
import IERC20 from "./IERC20.json";
import aludelAbi from "./aludelAbi";
import Crucible from "./Crucible.json";
import transmuterAbi from "./transmuterAbi";
import { config } from "../config/app";

const { aludelAddress, transmuterAddress, crucibleFactoryAddress } = config;

export async function increaseStake(
  signer: any,
  crucibleAddress: string,
  rawAmount: string
) {
  const walletAddress = await signer.getAddress();

  const args = {
    crucible: crucibleAddress,
    aludel: aludelAddress,
    transmuter: transmuterAddress,
    crucibleFactory: crucibleFactoryAddress,
    amount: rawAmount,
  };

  // fetch contracts
  const aludel = new ethers.Contract(args.aludel, aludelAbi, signer);
  const stakingToken = new ethers.Contract(
    (await aludel.getAludelData()).stakingToken,
    IERC20.abi,
    signer
  );
  const crucible = new ethers.Contract(args.crucible, Crucible.abi, signer);

  const transmuter = new ethers.Contract(
    args.transmuter,
    transmuterAbi,
    signer
  );
  // declare config

  const amount = parseUnits(args.amount, await stakingToken.decimals());
  const nonce = await crucible.getNonce();
  const deadline = Date.now() + 60 * 60 * 24; // 1 day deadline
  const salt = randomBytes(32);

  // validate balances
  // If unlocked LP balance is < amount, throw error
  if ((await stakingToken.balanceOf(crucible.address)) < amount) {
    alert("You must have more Alchemist Liquidity Pool tokens");
    throw new Error("Stake amount exceeds available LP token balance");
  }

  // craft permission

  console.log("Sign Unlock perm ission");

  const permit = await signPermitEIP2612(
    signer,
    walletAddress,
    stakingToken,
    transmuter.address,
    amount,
    deadline
  );

  const permission = await signPermission(
    "Lock",
    crucible,
    signer,
    aludel.address,
    stakingToken.address,
    amount,
    nonce
  );

  console.log("Increase stake");
  try {
    const tx = await transmuter.permitAndStake(
      aludel.address,
      crucibleAddress,
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
