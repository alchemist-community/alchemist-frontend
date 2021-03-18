import IUniswapV2ERC20 from "@uniswap/v2-core/build/IUniswapV2ERC20.json";
import { ethers } from "ethers";
import { parseUnits, randomBytes } from "ethers/lib/utils";
import { signPermission, signPermitEIP2612 } from "./utils";
import aludelAbi from "./aludelAbi";
import Crucible from "./Crucible.json";
import transmuterAbi from "./transmuterAbi";

export async function increaseStake(
  signer: any,
  crucibleAddress: string,
  rawAmount: string
) {
  const walletAddress = await signer.getAddress();

  // Recipient doesn't make much sense when increasing stake
  const args = {
    crucible: crucibleAddress,
    aludel: "0xf0D415189949d913264A454F57f4279ad66cB24d",
    transmuter: "0xB772ce9f14FC7C7db0D4525aDb9349FBD7ce456a",
    crucibleFactory: "0x54e0395CFB4f39beF66DBCd5bD93Cca4E9273D56",
    amount: rawAmount,
  };

  // fetch contracts
  const aludel = new ethers.Contract(args.aludel, aludelAbi, signer);
  const stakingToken = new ethers.Contract(
    (await aludel.getAludelData()).stakingToken,
    IUniswapV2ERC20.abi,
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
  const recipient = args.recipient;

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
