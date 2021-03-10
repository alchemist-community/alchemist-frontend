import React, { useContext, useState, useEffect } from "react";
import Web3Context from "../../Web3Context";
import {
  Text,
  Button,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";

export default function UserAddress() {
  const { web3, wallet, address, onboard } = useContext(Web3Context);
  const [selectedAddress, setSelectedAddress] = useState<string>();

  useEffect(() => {
    setSelectedAddress(
      web3 === null ? undefined : (web3.currentProvider as any).selectedAddress
    );
  }, [web3]);

  const handleClick = () =>
    !wallet.provider ? onboard.walletSelect() : onboard.walletReset();

  const buttonBgColor = useColorModeValue("white", "gray.700");

  return (
    <>
      <Button
        onClick={handleClick}
        background={buttonBgColor}
        variant="muted"
        boxShadow="md"
        borderRadius="lg"
      >
        <Text fontSize="sm" color="gray.500" mr={2}>
          {selectedAddress ? "Mainnet:" : "Connect Wallet"}
        </Text>
        {selectedAddress && (
          <Text fontSize="sm" mr={4}>
            {selectedAddress.substring(0, 6) +
              "..." +
              selectedAddress.substring(selectedAddress.length - 4)}
          </Text>
        )}
        <Box
          background={selectedAddress ? "green.400" : "gray.400"}
          borderRadius="100%"
          width={3}
          height={3}
        />
      </Button>
    </>
  );
}
