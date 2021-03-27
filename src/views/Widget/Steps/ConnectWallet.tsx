import React, { useContext } from "react";
import Web3Context from "../../../context/web3";
import { Flex, Heading } from "@chakra-ui/layout";

const ConnectWallet: React.FC = () => {
  const { onboard, wallet } = useContext(Web3Context);
  const isConnected = !!wallet.provider;

  return (
    <Flex
      p={32}
      width="100%"
      height="100%"
      alignItems="center"
      justifyContent="center"
      bg={isConnected ? "#35C932" : "#FFBF00"}
      onClick={() => onboard.walletSelect()}
    >
      <Heading size="2xl" color="gray.800">
        {isConnected ? "1. Wallet connected" : "1. Connect wallet"}
      </Heading>
    </Flex>
  );
};

export default ConnectWallet;
