import React, { useContext } from "react";
import Web3Context from "../../Web3Context";
import {
  Text,
  Button,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";

export default function UserAddress() {
  const { wallet, address, onboard } = useContext(Web3Context);

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
          {address ? "Mainnet:" : "Connect Wallet"}
        </Text>
        {address && (
          <Text fontSize="sm" mr={4}>
            {address.substring(0, 6) +
              "..." +
              address.substring(address.length - 4)}
          </Text>
        )}
        <Box
          background={address ? "green.400" : "gray.400"}
          borderRadius="100%"
          width={3}
          height={3}
        />
      </Button>
    </>
  );
}
