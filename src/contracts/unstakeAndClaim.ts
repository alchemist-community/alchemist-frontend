import IUniswapV2ERC20 from "@uniswap/v2-core/build/IUniswapV2ERC20.json";
import { ethers } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { signPermission } from "./utils";
import aludelAbi from "./aludelAbi";
import Crucible from "./Crucible.json";

export async function unstakeAndClaim(
  signer: any,
  monitorTx: (hash: string) => Promise<any>,
  crucibleAddress: string,
  rawAmount: string
) {
  const walletAddress = await signer.getAddress();

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

  if ((await stakingToken.balanceOf(crucible.address)) < amount) {
    throw new Error("stop being poor");
  }

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

  console.log("Unstake and Claim");

  const populatedTx = await aludel.populateTransaction.unstakeAndClaim(
    crucible.address,
    recipient,
    amount,
    permission
  );

  const unstakeTx = await signer.sendTransaction(populatedTx);
  monitorTx(unstakeTx.hash);
  console.log("  in", unstakeTx.hash);

  console.log("Withdraw from crucible");

  const withdrawTx = await crucible.transferERC20(
    stakingToken.address,
    recipient,
    amount
  );

  monitorTx(withdrawTx.hash);

  console.log("  in", withdrawTx?.hash);
}
