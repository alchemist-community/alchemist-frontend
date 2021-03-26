import { Network } from '../types';

type Config = {
  networkId: Network;
  mistTokenAddress: string;
  lpTokenAddress: string;
  aludelAddress: string;
  wethAddress: string;
  crucibleFactoryAddress: string;
  transmuterAddress: string;
  rewardPool: string,
  rpcUrl: string;
  dappId: string;
  appName: string;
  portisApiKey: string;
  infuraApiKey: string;
};

export const config: Config = {
  networkId: Network.MAINNET,
  mistTokenAddress: '0x88ACDd2a6425c3FaAE4Bc9650Fd7E27e0Bebb7aB',
  lpTokenAddress: '0xCD6bcca48069f8588780dFA274960F15685aEe0e',
  aludelAddress: '0xf0D415189949d913264A454F57f4279ad66cB24d',
  wethAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  crucibleFactoryAddress: '0x54e0395CFB4f39beF66DBCd5bD93Cca4E9273D56',
  transmuterAddress: '0xB772ce9f14FC7C7db0D4525aDb9349FBD7ce456a',
  rewardPool: '0x04108d6E9a51BeC5170F8Fd953a156cF754bA541',
  rpcUrl: 'https://mainnet.infura.io/v3/965c5ec028c84ffcb22c799eddba83a4',
  portisApiKey: 'e86e917b-b682-4a5c-bbc5-0f8c3b787562',
  infuraApiKey: 'd5e29c9b9a9d4116a7348113f57770a8',
  dappId: 'ad454b00-3218-4403-95e9-22c3c7d3adc0',
  appName: 'Alchemist',
};
