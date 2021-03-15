import IUniswapV2ERC20 from "@uniswap/v2-core/build/IUniswapV2ERC20.json";
import { ethers } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { signPermission } from "./utils";
import aludelAbi from "./aludelAbi";
import Crucible from "./Crucible.json";

export async function increaseStake(
  signer: any,
  monitorTx: (hash: string) => Promise<any>,
  crucibleAddress: string,
  rawAmount: string
) {
  const walletAddress = await signer.getAddress();

  // Recipient doesn't make much sense when increasing stake
  const args = {
    crucible: crucibleAddress,
    aludel: "0xf0D415189949d913264A454F57f4279ad66cB24d",
    recipient: walletAddress,
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
  // declare config

  const amount = parseUnits(args.amount, await stakingToken.decimals());
  const nonce = await crucible.getNonce();
  const recipient = args.recipient;

  // validate balances
  // If unlocked balance is < amount, throw error
  // if ((await stakingToken.balanceOf(crucible.address)) < amount) {
  //   throw new Error("stop being poor");
  // }

  // craft permission

  console.log("Sign Unlock permission");

  const permission = await signPermission(
    "Unlock",
    crucible,
    signer,
    aludel.address,
    stakingToken.address,
    amount,
    nonce
  );

  console.log("Increase stake");

  const populatedTx = await aludel.populateTransaction.increaseStake(
    crucible.address,
    recipient,
    amount,
    permission
  );

  const increaseStakeTx = await signer.sendTransaction(populatedTx);
  monitorTx(increaseStakeTx.hash);
  console.log("  in", increaseStakeTx.hash);

  // Withdraw not needed
  // const withdrawTx = await crucible.transferERC20(
  //   stakingToken.address,
  //   recipient,
  //   amount
  // );

  // monitorTx(withdrawTx.hash);

  // console.log("  in", withdrawTx?.hash);
}
