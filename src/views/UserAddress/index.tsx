import React, { useContext } from "react";
import Web3Context from "../../Web3Context";
import { Text, Button, Box, Image } from "@chakra-ui/react";
import { IoMdClose } from "react-icons/io";
import powerIcon from "../../img/power-icon.png";

export default function UserAddress() {
  const { wallet, address, onboard, readyToTransact } = useContext(Web3Context);

  const handleClick = () => (!wallet.provider ? readyToTransact() : null);

  return (
    <>
      <Button
        onClick={handleClick}
        height={["40px", "40px", "60px"]}
        background={wallet?.provider ? "#35C932" : "#FFBF00"}
        borderRadius="0px 0px 0px 24px"
        boxShadow="xl"
      >
        <Text
          fontFamily="Poppins"
          fontWeight="700"
          fontSize={["md", "md", "lg"]}
          color={wallet?.provider ? "white" : "black"}
          mr={2}
        >
          {wallet?.provider ? "Mainnet:" : "Connect Wallet"}
        </Text>
        {wallet?.provider && address && (
          <>
            <Text fontSize="sm" mr={4}>
              {address.substring(0, 6) + "..." + address.substring(address.length - 4)}
            </Text>
          </>
        )}
        {wallet?.provider && (
          <Image
            src={powerIcon}
            height={["20px", "20px", "30px"]}
            ml={2}
            mr={-2}
            onClick={() => onboard.walletReset()}
            aria-label="reset wallet"
          />
        )}
      </Button>
    </>
  );
}
