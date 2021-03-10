import React, { useState, useCallback, useEffect } from "react";
import Web3 from "web3";
import { ethers } from "ethers";
import { Web3Provider as Web3ProviderType } from "../ethereum";
import { initNotify, initOnboard } from "../walletServices";

const Web3Context = React.createContext<{
  web3: Web3ProviderType;
  address: null | string;
  onboard: any;
  wallet: any;
  readyToTransact: () => Promise<boolean>;
  provider: any;
  signer: any;
  monitorTx: (hash: string) => Promise<void>;
}>({
  web3: null,
  onboard: null,
  wallet: null,
  address: null,
  readyToTransact: async () => false,
  provider: null,
  signer: null,
  monitorTx: async () => undefined,
});

const Web3Provider: React.FC = (props) => {
  const [web3, setWeb3] = useState<Web3ProviderType>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<any>(null);
  const [network, setNetwork] = useState<any>(null);
  const [etherBalance, setEtherBalance] = useState<any>(null);
  const [signer, setSigner] = useState<any>();
  const [wallet, setWallet] = useState<any>({});
  const [onboard, setOnboard] = useState<any>(null);
  const [notify, setNotify] = useState<any>(null);

  useEffect(() => {
    const onboard = initOnboard({
      address: setAddress,
      network: setNetwork,
      balance: setEtherBalance,
      wallet: (wallet: any) => {
        if (wallet?.provider?.selectedAddress) {
          setWallet(wallet);
          const ethersProvider = new ethers.providers.Web3Provider(
            wallet.provider
          );
          setProvider(ethersProvider);
          setSigner(ethersProvider.getSigner());
          window.localStorage.setItem("selectedWallet", wallet.name);
        } else {
          setProvider(null);
          setWallet({});
        }
      },
    });

    setOnboard(onboard);
    setNotify(initNotify());
  }, []);

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
    return ready;
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
      }}
    >
      {props.children}
    </Web3Context.Provider>
  );
};

export { Web3Provider };

export default Web3Context;
