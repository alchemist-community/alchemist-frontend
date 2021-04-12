import React, { useState, useCallback, useEffect } from "react";
import { ethers } from "ethers";
import { Web3Provider as Web3ProviderType } from "../types";
import { initNotify, initOnboard } from "../services/walletServices";
import {
  getUserRewards,
  getNetworkStats,
  calculateMistRewards,
} from "../contracts/aludel";
import { getOwnedCrucibles } from "../contracts/getOwnedCrucibles";
import { getTokenBalances } from "../contracts/getTokenBalances";
import { getUniswapBalances } from "../contracts/getUniswapBalances";
import { formatUnits } from "@ethersproject/units";
import { useQuery } from "@apollo/client";
import { GET_PRICES, GET_UNISWAP_MINTS } from "../queries/uniswap";

interface Rewards {
  etherRewards: any;
  tokenRewards: any;
}

const Web3Context = React.createContext<{
  web3: Web3ProviderType;
  address: null | string;
  onboard: any;
  wallet: any;
  readyToTransact: () => Promise<boolean>;
  provider: any;
  signer: any;
  monitorTx: (hash: string) => Promise<void>;
  reloadCrucibles: () => Promise<any>;
  crucibles: any;
  rewards: Rewards[];
  network: any;
  networkStats: any;
  tokenBalances: any;
  lpStats: any;
}>({
  web3: null,
  onboard: null,
  wallet: null,
  address: null,
  readyToTransact: async () => false,
  provider: null,
  signer: null,
  monitorTx: async () => undefined,
  reloadCrucibles: async () => undefined,
  crucibles: null,
  rewards: [],
  network: null,
  networkStats: null,
  tokenBalances: null,
  lpStats: null,
});

const Web3Provider: React.FC = (props) => {
  const [web3, setWeb3] = useState<Web3ProviderType>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<any>(null);
  const [network, setNetwork] = useState<any>(null);
  const [etherBalance, setEtherBalance] = useState<any>(null);
  const [signer, setSigner] = useState<any>();
  const [wallet, setWallet] = useState<any>({});
  const [tokenBalances, setTokenBalances] = useState<any>({});
  const [networkStats, setNetworkStats] = useState<any>({});
  const [lpStats, setLpStats] = useState<any>();
  const [crucibles, setCrucibles] = useState(
    [] as {
      id: string;
      balance: string;
      lockedBalance: string;
      owner: string;
      cleanBalance?: string;
      cleanLockedBalance?: string;
      cleanUnlockedBalance?: any;
    }[]
  );
  const [rewards, setRewards] = useState<any>();
  const [onboard, setOnboard] = useState<ReturnType<typeof initOnboard>>(
    null as any
  );
  const [notify, setNotify] = useState<any>(null);
  const { loading, error, data } = useQuery(GET_UNISWAP_MINTS, {
    variables: { userAddress: address },
    skip: !address, // Must have address to query uniswap LP's
  });

  const {
    loading: pricesLoading,
    error: pricesError,
    data: pricesData,
  } = useQuery(GET_PRICES, {
    variables: {
      beforeTimestamp: Number(lpStats?.deposits[0]?.timestamp),
      afterTimestamp: Number(lpStats?.deposits[0]?.timestamp) - 24 * 60 * 60,
    },
    skip: !lpStats?.deposits[0], // User must have deposits in order to query prices
  });

  if (error) {
    console.error("Error fetching mints from subgraph", error);
  }
  if (pricesError) {
    console.error("Error fetching prices from subgraph", pricesError);
  }
  if (data && !lpStats) {
    let totalAmountUSD = 0;
    let totalMistDeposited = 0;
    let totalWethDeposited = 0;
    let allDeposits =
      data.mints?.length &&
      data.mints.map((mint: any) => {
        totalAmountUSD += Number(mint.amountUSD);
        totalMistDeposited += Number(mint.amount0);
        totalWethDeposited += Number(mint.amount1);
        return {
          ...mint,
          mistAmount: mint.amount0,
          lpAmount: mint.amount1,
        };
      });
    setLpStats({
      deposits: allDeposits,
      totalAmountUSD,
      totalMistDeposited,
      totalWethDeposited,
    });
  }

  if (pricesData && !lpStats?.initialWethPriceUSD) {
    setLpStats((lpStats: any) => ({
      ...lpStats,
      initialWethPriceUSD: pricesData?.wethPriceUSD[0].priceUSD,
      initialMistPriceUSD: pricesData?.mistPriceUSD[0].priceUSD,
    }));
  }

  const updateWallet = useCallback((wallet: any) => {
    setWallet(wallet);
    const ethersProvider = new ethers.providers.Web3Provider(wallet.provider);
    let signer = ethersProvider.getSigner();
    setProvider(ethersProvider);
    setSigner(signer);
    window.localStorage.setItem("selectedWallet", wallet.name);
    getNetworkStats(signer).then(setNetworkStats);
    getTokenBalances(signer).then((balances) => {
      setTokenBalances(balances);
      getOwnedCrucibles(signer, ethersProvider)
        .then((ownedCrucibles) => {
          let reformatted = ownedCrucibles.map((crucible) => ({
            ...crucible,
            cleanBalance: formatUnits(crucible.balance),
            cleanLockedBalance: formatUnits(crucible.lockedBalance),
            cleanUnlockedBalance: formatUnits(
              crucible.balance.sub(crucible.lockedBalance)
            ),
            mistPrice: balances.mistPrice,
            wethPrice: balances.wethPrice,
            ...getUniswapBalances(
              crucible.balance,
              balances.lpMistBalance,
              balances.lpWethBalance,
              balances.totalLpSupply,
              balances.wethPrice,
              balances.mistPrice
            ),
          }));
          setCrucibles(reformatted);
          return getUserRewards(signer, ownedCrucibles);
        })
        .then((rewards) => {
          if (rewards?.length) {
            Promise.all(
              rewards.map((reward: any) => {
                return new Promise((resolve, reject) => {
                  resolve(
                    calculateMistRewards(signer, reward.currStakeRewards)
                  );
                });
              })
            ).then(setRewards);
          }
        });
    });
  }, []);

  useEffect(() => {
    const onboard = initOnboard({
      address: setAddress,
      network: setNetwork,
      balance: setEtherBalance,
      wallet: (wallet: any) => {
        if (wallet?.provider?.selectedAddress) {
          updateWallet(wallet);
        } else {
          setProvider(null);
          setWallet({});
        }
      },
    });

    setOnboard(onboard);
    setNotify(initNotify());
  }, [updateWallet]);

  useEffect(() => {
    const previouslySelectedWallet = window.localStorage.getItem(
      "selectedWallet"
    );

    if (previouslySelectedWallet && onboard) {
      onboard.walletSelect(previouslySelectedWallet);
    }
  }, [onboard]);

  async function readyToTransact(): Promise<boolean> {
    if (!provider) {
      const walletSelected = await onboard.walletSelect();
      if (!walletSelected) return false;
    }

    const ready = await onboard.walletCheck();
    if (ready && !provider) {
      updateWallet(onboard.getState().wallet);
    }
    return ready;
  }

  function reloadCrucibles() {
    return new Promise((resolve) => resolve(updateWallet(wallet)));
  }

  async function monitorTx(hash: string) {
    const { emitter } = notify.hash(hash);
    const networkName = network === 1 ? "mainnet" : "rinkeby";
    interface Transaction {
      hash: string;
    }
    emitter.on("txPool", (transaction: Transaction) => {
      return {
        message: `Your transaction is pending, click <a href="https://${networkName}.etherscan.io/tx/${transaction.hash}" rel="noopener noreferrer" target="_blank">here</a> for more info.`,
        // onclick: () =>
        //   window.open(`https://mainnet.etherscan.io/tx/${transaction.hash}`)
      };
    });

    emitter.on("txSent", console.log);
    emitter.on("txConfirmed", console.log);
    emitter.on("txSpeedUp", console.log);
    emitter.on("txCancel", console.log);
    emitter.on("txFailed", console.log);
  }

  return (
    <Web3Context.Provider
      value={{
        address,
        onboard,
        web3,
        wallet,
        readyToTransact,
        signer,
        provider,
        monitorTx,
        reloadCrucibles,
        crucibles,
        rewards,
        network,
        networkStats,
        tokenBalances,
        lpStats,
      }}
    >
      {props.children}
    </Web3Context.Provider>
  );
};

export { Web3Provider };

export default Web3Context;
