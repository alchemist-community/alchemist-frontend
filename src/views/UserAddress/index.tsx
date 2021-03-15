import React, { useContext } from "react";
import Web3Context from "../../Web3Context";
import {
  Text,
  Button,
  Box,
  useColorModeValue,
  IconButton,
} from "@chakra-ui/react";
import { IoMdClose } from "react-icons/io";

export default function UserAddress() {
  const { wallet, address, onboard, readyToTransact } = useContext(Web3Context);

  const handleClick = () => (!wallet.provider ? readyToTransact() : null);

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
          background={address ? "green.500" : "gray.400"}
          borderRadius="100%"
          width={2.5}
          height={2.5}
        />
        {wallet.provider && (
          <IconButton
            ml={2}
            mr={-2}
            size="sm"
            variant="ghost"
            icon={<IoMdClose />}
            onClick={() => onboard.walletReset()}
            aria-label="reset wallet"
          />
        )}
      </Button>
    </>
  );
}
