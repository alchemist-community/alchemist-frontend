import React, { useContext, useState, useEffect } from "react";
import Web3Context from "../../Web3Context";
import Modal from "../Modal";

export default function UserAddress() {
  const { web3, wallet, address, onboard } = useContext(Web3Context);
  const [selectedAddress, setSelectedAddress] = useState<string>();
  const [displayNoMetamaskModal, setDisplayNoMetamaskModal] = useState(false);

  useEffect(() => {
    setSelectedAddress(
      web3 === null ? undefined : (web3.currentProvider as any).selectedAddress
    );
  }, [web3]);

  return (
    <>
      <div
        className={`header__connect connect connect--${
          wallet.provider ? "success" : "no"
        }`}
        onClick={() => !wallet.provider && onboard.walletSelect()}
      >
        <div className="connect__label">
          {wallet.provider ? "Mainnet:" : "Connect Wallet"}
        </div>
        {address && (
          <div className="connect__text">
            {address.substring(0, 6) +
              "..." +
              address.substring(address.length - 4)}
          </div>
        )}
        <div className="connect__status">
          <span></span>
        </div>
        <button
          onClick={() => onboard.walletReset()}
          style={{ border: "none", outline: "none" }}
          className="reset"
        >
          <svg
            style={{
              cursor: "pointerEvent",
              pointerEvents: "none",
            }}
            width={"14px"}
            height={"14px"}
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <path
              d="M28.5 9.62L26.38 7.5 18 15.88 9.62 7.5 7.5 9.62 15.88 18 7.5 26.38l2.12 2.12L18 20.12l8.38 8.38 2.12-2.12L20.12 18z"
              fill={"#404c58"}
            />
          </svg>
        </button>
      </div>
      <Modal
        isOpen={displayNoMetamaskModal}
        type="error"
        title={"Wallet not found"}
        buttonText={"Okay"}
        onButtonClick={() => setDisplayNoMetamaskModal(false)}
      >
        <span>
          You must have MetaMask installed to use this product, get it{" "}
          <a
            rel="noopener noreferrer"
            target="_blank"
            href="https://metamask.io/"
          >
            here
          </a>
          .
        </span>
      </Modal>
    </>
  );
}
