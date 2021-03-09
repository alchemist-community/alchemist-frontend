import React, { useState, useCallback, useEffect } from "react";
import Web3 from "web3";
import { Web3Provider as Web3ProviderType } from "../ethereum";

const Web3Context = React.createContext<{
  web3: Web3ProviderType;
  userAddress: null | string;
  connectWallet: (
    onError?: (errType: "NO_METAMASK" | "ALREADY_CONNECTED") => void,
    onSuccess?: () => void
  ) => void;
}>({
  web3: null,
  connectWallet: () => null,
  userAddress: null,
});

const Web3Provider: React.FC = (props) => {
  const [web3, setWeb3] = useState<Web3ProviderType>(null);
  const [userAddress, setUserAddress] = useState<string | null>(null);

  useEffect(() => {
    const initialize = async () => {
      const accounts = await window.ethereum?.request({
        method: "eth_accounts",
      });
      if (accounts && accounts.length > 0) {
        setUserAddress(accounts[0]);
        setWeb3(new Web3(window.ethereum as any));
      }
    };
    initialize();
  }, []);

  const connectWallet = useCallback(
    (
      onError?: (errType: "NO_METAMASK" | "ALREADY_CONNECTED") => void,
      onSuccess?: () => void
    ) => {
      if (web3 !== null) {
        if (onError) onError("ALREADY_CONNECTED");
      }
      if (window.ethereum === undefined) {
        if (onError) onError("NO_METAMASK");
        return;
      }
      window.ethereum.enable().then(() => {
        window.ethereum
          ?.request({
            method: "eth_accounts",
          })
          .then((accounts) => {
            setUserAddress(accounts[0]);
          });
        setWeb3(new Web3(window.ethereum as any));
        if (onSuccess) onSuccess();
      });
    },
    [web3]
  );

  let web3Normalized: Web3;
  if (web3 === null) {
    web3Normalized = new Web3(
      new Web3.providers.HttpProvider(
        "https://mainnet.infura.io/v3/965c5ec028c84ffcb22c799eddba83a4"
      )
    );
  } else {
    web3Normalized = web3;
  }

  return (
    <Web3Context.Provider
      value={{
        userAddress,
        web3,
        connectWallet,
      }}
    >
      {props.children}
    </Web3Context.Provider>
  );
};

export { Web3Provider };

export default Web3Context;
