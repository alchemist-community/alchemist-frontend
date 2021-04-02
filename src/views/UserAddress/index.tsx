import React, { useContext } from "react";
import Web3Context from "../../context/web3";
import Power from "../../components/icons/power";
import { Text, Button, IconButton } from "@chakra-ui/react";

export default function UserAddress() {
  const { wallet, address, onboard, readyToTransact } = useContext(Web3Context);

  const handleClick = () => (!wallet.provider ? readyToTransact() : null);

  return (
    <>
      <Button
        onClick={handleClick}
        height={["40px", "40px", "50px"]}
        background={wallet?.provider ? "#35C932" : "#FFBF00"}
        borderRadius="0px 0px 0px 24px"
        boxShadow="xl"
        _hover={{ background: wallet?.provider ? "#35C932" : "#FFBF00" }}
      >
        <Text
          fontFamily="Poppins"
          fontWeight="700"
          fontSize={["md", "md", "lg"]}
          color={wallet?.provider ? "white" : "black"}
          mr={2}
        >
          {wallet?.provider && address
            ? address.substring(0, 6) +
              "..." +
              address.substring(address.length - 4)
            : "Connect to a Wallet"}
        </Text>
        {wallet?.provider && (
          <IconButton
            ml={2}
            mr={-2}
            icon={<Power color="white" />}
            onClick={() => onboard.walletReset()}
            aria-label="reset wallet"
          />
        )}
      </Button>
    </>
  );
}
