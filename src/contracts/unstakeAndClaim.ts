import { ethers } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { signPermission } from "./utils";
import IERC20 from "./IERC20.json";
import aludelAbi from "./aludelAbi";
import Crucible from "./Crucible.json";
import { config } from "../config/app";

const { aludelAddress } = config

export async function unstakeAndClaim(
  signer: any,
  monitorTx: (hash: string) => Promise<any>,
  crucibleAddress: string,
  rawAmount: string
) {
  const walletAddress = await signer.getAddress();

  const args = {
    crucible: crucibleAddress,
    aludel: aludelAddress,
    recipient: walletAddress,
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
