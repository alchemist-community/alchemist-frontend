import React, { useContext, useState, useEffect } from "react";
import Web3Context from "../../Web3Context";
import { getTokenBalances } from "../../contracts/getTokenBalances";

export default function UserAddress() {
  const { web3 } = useContext(Web3Context);
  const [selectedAddress, setSelectedAddress] = useState<string>();
  const [tokenBalance, setTokenBalance] = useState<{
    alchemist: string;
    lp: string;
  }>();

  useEffect(() => {
    (async () => {
      const balances = await getTokenBalances();
      setTokenBalance(balances);
    })();
  }, []);

  useEffect(() => {
    setSelectedAddress(
      web3 === null ? undefined : (web3.currentProvider as any).selectedAddress
    );
  }, [web3]);

  return (
    <>
      <div
        style={{
          flexDirection: "column",
          height: "auto",
          width: "100%",
          minWidth: "0px",
          marginTop: "1rem",
        }}
        className={`header__connect connect connect--${
          selectedAddress ? "success" : "no"
        }`}
      >
        <div style={{ display: "block", marginBottom: "0.3125rem" }}>
          My wallet
        </div>
        {tokenBalance ? (
          <>
            <div style={{ display: "block", width: "100%" }}>
              <span style={{ fontWeight: "bold" }}>Alchemist: </span>
              <span>{tokenBalance.alchemist} ⚗️</span>
            </div>
            <div style={{ display: "block", width: "100%" }}>
              <span style={{ fontWeight: "bold" }}>LP: </span>
              <span>{tokenBalance.lp} ⚗️/ETH</span>
            </div>
          </>
        ) : (
          <span>Loading...</span>
        )}
      </div>
    </>
  );
}
