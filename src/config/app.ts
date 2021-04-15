import { Network } from "../types";

type Config = {
  networkId: Network;
  mistTokenAddress: string;
  lpTokenAddress: string;
  aludelAddress: string;
  wethAddress: string;
  crucibleFactoryAddress: string;
  transmuterAddress: string;
  daiAddress: string;
  rewardPool: string;
  rpcUrl: string;
  dappId: string;
  appName: string;
  portisApiKey: string;
  infuraApiKey: string;
  pairAddress: string;
};

export const config: Config =
  process.env.REACT_APP_NETWORK_ID === "1"
    ? {
        networkId: Network.MAINNET,
        mistTokenAddress: "0x88ACDd2a6425c3FaAE4Bc9650Fd7E27e0Bebb7aB",
        lpTokenAddress: "0xCD6bcca48069f8588780dFA274960F15685aEe0e",
        aludelAddress: "0xf0D415189949d913264A454F57f4279ad66cB24d",
        wethAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        crucibleFactoryAddress: "0x54e0395CFB4f39beF66DBCd5bD93Cca4E9273D56",
        transmuterAddress: "0xB772ce9f14FC7C7db0D4525aDb9349FBD7ce456a",
        daiAddress: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        rewardPool: "0x04108d6E9a51BeC5170F8Fd953a156cF754bA541",
        rpcUrl: "https://mainnet.infura.io/v3/00a5b13ef0cf467698571093487743e6",
        portisApiKey: "e86e917b-b682-4a5c-bbc5-0f8c3b787562",
        infuraApiKey: "00a5b13ef0cf467698571093487743e6",
        dappId: "ad454b00-3218-4403-95e9-22c3c7d3adc0",
        appName: "Alchemist",
        pairAddress: "0xcd6bcca48069f8588780dfa274960f15685aee0e",
      }
    : {
        networkId: Network.RINKEBY,
        mistTokenAddress: "0xF6c1210Aca158bBD453A12604A03AeD2659ac0ef",
        lpTokenAddress: "0xe55687682fdf08265d1672ea0c91fa884ccd8955",
        aludelAddress: "0xE2dD7930d8cA478d9aA38Ae0F5483B8A3B331C40",
        wethAddress: "0xc778417E063141139Fce010982780140Aa0cD5Ab",
        crucibleFactoryAddress: "0xf92D86483438BDe1d68e501ce15470155DeE08B3",
        transmuterAddress: "0x0ADc14De42436aD95747a1C9A8002D4E60888ACa",
        daiAddress: "0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea",
        rewardPool: "0x60dd59e72B2468C64fD9F369488aedf9b5F65Ffe",
        rpcUrl: "https://rinkeby.infura.io/v3/ca7f73c788d24c6c853d6b0c1c5347ff",
        portisApiKey: "e86e917b-b682-4a5c-bbc5-0f8c3b787562",
        infuraApiKey: "00a5b13ef0cf467698571093487743e6",
        dappId: "ad454b00-3218-4403-95e9-22c3c7d3adc0",
        appName: "Alchemist",
        pairAddress: "",
      };
