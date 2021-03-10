import { ethers } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import Crucible from "./Crucible.json";
import IERC20 from "./IERC20.json";

export async function withdraw(crucibleAddress: string, rawAmount: string) {
  const provider = new ethers.providers.Web3Provider((window as any).ethereum);
  const signer = provider.getSigner();

  const walletAddress = await signer.getAddress();

  const args = {
    crucible: crucibleAddress,
    token: "0xCD6bcca48069f8588780dFA274960F15685aEe0e",
    recipient: walletAddress,
    amount: rawAmount,
  };

  // fetch contracts

  const token = new ethers.Contract(args.token, IERC20.abi, signer);
  const crucible = new ethers.Contract(args.crucible, Crucible.abi, signer);

  // declare config

  const amount = parseUnits(args.amount, 18);
  const recipient = args.recipient;

  // validate balances

  const balance = await token.balanceOf(crucible.address);
  const lock = await crucible.getBalanceLocked(token.address);
  if (balance.sub(lock) < amount) {
    throw new Error("ser unlock pls");
  }

  console.log("Withdraw from crucible");

  const withdrawTx = await crucible.transferERC20(
    token.address,
    recipient,
    amount
  );

  console.log("  in", withdrawTx.hash);
}
