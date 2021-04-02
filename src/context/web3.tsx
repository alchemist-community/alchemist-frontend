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
import { useLazyQuery, gql } from "@apollo/client";

const GET_UNISWAP_MINTS = gql`
  query getUserMints($userAddress: String!  ) {
    mints(
      where: {
        to: $userAddress
        pair: "0xcd6bcca48069f8588780dfa274960f15685aee0e"
      }
    ) {
      id
      timestamp
      transaction {
        id
      }
      amount0
      amount1
      pair {
        id
        token0 {
          id
          symbol
          derivedETH
        }
        token1 {
          id
          symbol
          derivedETH
        }
      }
      amountUSD
    }
  }
`;

const GET_PRICES = gql`
  query getPrices($beforeTimestamp: Number!, $afterTimestamp: Number! ) {
  wethPriceUSD: tokenDayDatas(
    where: {
      token:"0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", # Eth Address
      date_lt: $beforeTimestamp
      date_gt: $afterTimestamp
      }) 
    {
      id
      date
      priceUSD
    }
  mistPriceUSD: tokenDayDatas(
    where: {
      token:"0x88acdd2a6425c3faae4bc9650fd7e27e0bebb7ab", # Eth Address
      date_lt: $beforeTimestamp
      date_gt: $afterTimestamp
    }) 
    {
      id
      date
      priceUSD
    }
  }
`;

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
  const [getUserDeposits,{ loading, error, data }] = useLazyQuery(GET_UNISWAP_MINTS, {
    variables: { userAddress: address },
  });

  const [getPricesAtTimestamp,{ loading: pricesLoading, error: pricesError, data: pricesData}] = useLazyQuery(GET_PRICES, {
    variables: {
      beforeTimestamp: Number(lpStats?.timestamp), 
      afterTimestamp: Number(lpStats?.timestamp) - 24 * 60 * 60 
    },
  });

  if(error){
    console.log("Error fetching from subgraph", error)
  }
  if (data && !lpStats) {

    let totalAmountUSD = 0;
    let totalMistDeposited = 0;
    let totalWethDeposited = 0;
    let reformatted = data.mints?.length && data.mints.map((mint: any) => {
      totalAmountUSD += Number(mint.amountUSD);
      totalMistDeposited += Number(mint.amount0);
      totalWethDeposited += Number(mint.amount1);
      return {
        ...mint,
        mistAmount: mint.amount0,
        lpAmount: mint.amount1,
      };
    });
    console.log("Data",       ...reformatted,
    totalAmountUSD,
    totalMistDeposited,
    totalWethDeposited)
    setLpStats({
      ...reformatted,
      totalAmountUSD,
      totalMistDeposited,
      totalWethDeposited,
    });
  }

  if(pricesData){
    console.log("Prices Data", pricesData)
    setLpStats((lpStats: any) => ({
      ...lpStats,
      wethPriceUSD: pricesData.wethPriceUSD.priceUSD,
      mistPriceUSD: pricesData.mistPriceUSD.priceUSD
    }))
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

  useEffect(()=>{
    if(address) getUserDeposits()
  }, [address, getUserDeposits])
  
  useEffect(()=>{
    if(lpStats){
      console.log("Getting prices")
      getPricesAtTimestamp()
    }
  }, [lpStats, getPricesAtTimestamp])

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
    interface Transaction {
      hash: string;
    }
    emitter.on("txPool", (transaction: Transaction) => {
      return {
        message: `Your transaction is pending, click <a href="https://mainnet.etherscan.io/tx/${transaction.hash}" rel="noopener noreferrer" target="_blank">here</a> for more info.`,
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
