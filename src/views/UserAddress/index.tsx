import React, { useContext, useState, useEffect } from "react";
import Web3Context from "../../Web3Context";
import { Text, Button, Box, useColorModeValue } from "@chakra-ui/react";
import { CancelButton } from "../../components";

export default function UserAddress() {
  const { wallet, address, onboard } = useContext(Web3Context);

  const handleClick = () => (!wallet.provider ? onboard.walletSelect() : null);

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
          <>
            <Text fontSize="sm" mr={4}>
              {address.substring(0, 6) +
                "..." +
                address.substring(address.length - 4)}
            </Text>
          </>
        )}
        <Box
          background={address ? "green.400" : "gray.400"}
          borderRadius="100%"
          width={3}
          height={3}
        />
        {wallet.provider && (
          <CancelButton
            margin={{ marginLeft: "8px" }}
            width="14px"
            height="14px"
            handleClick={() => onboard.walletReset()}
          />
        )}
      </Button>
    </>
  );
}
