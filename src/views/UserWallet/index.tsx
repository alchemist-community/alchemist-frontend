import React, { useContext, useState, useEffect } from "react";
import Web3Context from "../../Web3Context";
import { getTokenBalances } from "../../contracts/getTokenBalances";
import { toMaxDecimalsRound } from "../Widget/utils";

export default function UserAddress() {
  const { signer, address } = useContext(Web3Context);
  const [tokenBalance, setTokenBalance] = useState<{
    alchemist: string;
    lp: string;
  }>();

  useEffect(() => {
    (async () => {
      if(signer){
        const balances = await getTokenBalances(signer);
        setTokenBalance(balances);
      }
    })();
  }, [signer]);

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
          address ? "success" : "no"
        }`}
      >
        <div style={{ display: "block", marginBottom: "0.3125rem" }}>
          My wallet
        </div>
        {tokenBalance ? (
          <>
            <div style={{ display: "block", width: "100%" }}>
              <span style={{ fontWeight: "bold" }}>Alchemist: </span>
              <span>{toMaxDecimalsRound(tokenBalance.alchemist, 0.01)} ⚗️</span>
            </div>
            <div style={{ display: "block", width: "100%" }}>
              <span style={{ fontWeight: "bold" }}>LP: </span>
              <span>{toMaxDecimalsRound(tokenBalance.lp, 0.01)} ⚗️/ETH</span>
            </div>
          </>
        ) : (
          <span>Loading...</span>
        )}
      </div>
    </>
  );
}
