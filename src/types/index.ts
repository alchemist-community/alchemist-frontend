import Web3 from "web3";

export type Web3Provider = Web3 | null;

export enum Network {
  MAINNET = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GOERLI = 5,
  KOVAN = 42,
  xDAI = 100,
}
