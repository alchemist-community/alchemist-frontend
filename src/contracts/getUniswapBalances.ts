import { ChainId, Token, TokenAmount, Pair } from "@uniswap/sdk";

import { config } from "../config/app";

const { lpTokenAddress, mistTokenAddress, wethAddress } = config;

export const getUniswapBalances = (
  lpBalance: any,
  lpMistBalance: string,
  lpWethBalance: string,
  totalLpSupply: string,
  wethPrice: number,
  mistPrice: number
) => {
  const chainId =
    process.env.REACT_APP_NETWORK_ID === "1"
      ? ChainId.MAINNET
      : ChainId.RINKEBY;
  const MIST = new Token(chainId, mistTokenAddress, 18, "⚗", "Alchemist");
  const WETH = new Token(chainId, wethAddress, 18, "WETH", "Wrapped Ether");
  const LP = new Token(chainId, lpTokenAddress, 18, "UNI-V2", "UniswapV2Pair");
  const pair = new Pair(
    new TokenAmount(MIST, lpMistBalance.toString()),
    new TokenAmount(WETH, lpWethBalance.toString())
  );

  let mistValue = pair
    .getLiquidityValue(
      MIST,
      new TokenAmount(LP, totalLpSupply.toString()),
      new TokenAmount(LP, lpBalance.toString()),
      false
    )
    .toSignificant();
  let wethValue = pair
    .getLiquidityValue(
      WETH,
      new TokenAmount(LP, totalLpSupply.toString()),
      new TokenAmount(LP, lpBalance.toString()),
      false
    )
    .toSignificant();
  return {
    mistValue,
    wethValue,
    ...(wethPrice && {
      wethValueUsd: (Number(wethValue) * wethPrice).toFixed(2),
    }),
    ...(mistPrice && {
      mistValueUsd: (Number(mistValue) * mistPrice).toFixed(2),
    }),
  };
};
