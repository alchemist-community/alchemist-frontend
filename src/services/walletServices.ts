import Onboard from "bnc-onboard";
import { Network } from "../types";
import { config } from "../config/app";
import { Dispatch, SetStateAction } from "react";
import Notify, { API as NotifyAPI } from "bnc-notify";
import { API as OnboardAPI, Wallet } from 'bnc-onboard/dist/src/interfaces';

type Subscriptions = {
  address: Dispatch<SetStateAction<string | null>>;
  network: Dispatch<SetStateAction<Network | null>>;
  balance: (balance: string) => void;
  wallet: (wallet: Wallet) => void;
};

const { dappId, networkId, rpcUrl, appName, portisApiKey, infuraApiKey } = config;

export function initOnboard(subscriptions: Subscriptions): OnboardAPI {
  return Onboard({
    dappId,
    hideBranding: true,
    networkId,
    darkMode: true,
    subscriptions,
    walletSelect: {
      wallets: [
        { walletName: "metamask", preferred: true },
        { walletName: "trust", preferred: true },
        { walletName: "authereum", preferred: true },
        { walletName: "coinbase", preferred: true },
        {
          walletName: "walletConnect",
          infuraKey: infuraApiKey,
          preferred: true
        },
        {
          walletName: "portis",
          label: "Portis",
          apiKey: portisApiKey,
          preferred: true
        },
        { walletName: "opera", preferred: true },
        { walletName: "torus", preferred: true },
        { walletName: "walletLink", appName, rpcUrl, preferred: true },
        { walletName: "liquality", preferred: true },
        { walletName: "frame", preferred: true },
        { walletName: "status", preferred: true },
        { walletName: "operaTouch", preferred: true },
        { walletName: "imToken", rpcUrl, preferred: true },
        { walletName: "meetone", preferred: true },
        { walletName: "mykey", rpcUrl, preferred: true },
        { walletName: "wallet.io", rpcUrl, preferred: true },
        { walletName: "huobiwallet", rpcUrl, preferred: true },
        { walletName: "hyperpay", preferred: true },
        { walletName: "atoken", preferred: true }
      ]
    },
    walletCheck: [
      { checkName: "derivationPath" },
      { checkName: "connect" },
      { checkName: "accounts" },
      { checkName: "network" }
    ]
  });
}

export function initNotify(): NotifyAPI {
  return Notify({
    dappId,
    networkId
  });
}
