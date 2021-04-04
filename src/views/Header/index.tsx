import React from "react";
import UserWallet from "../UserWallet";
import UserAddress from "../UserAddress";
import logo from "../../img/logo.png";
import Web3Context from "../../context/web3";
import { Image } from "@chakra-ui/image";
import { Box, Flex, LinkBox, LinkOverlay } from "@chakra-ui/layout";

const Header: React.FC = () => {
  const { address } = React.useContext(Web3Context);

  return (
    <>
      <Flex justifyContent="space-between" alignItems="center">
        {/* Hardcoded 246 for now to center user wallet component */}
        <LinkBox width={["auto", "auto", 246]} py={4} pl={[4, 4, 12]}>
          <LinkOverlay href="/">
            <Image
              src={logo}
              width={["50px", "50px", "60px"]}
              alt="alchemist logo"
            />
          </LinkOverlay>
        </LinkBox>
        <Box
          position="absolute"
          transform="translateX(-50%)"
          left="50%"
          display={["none", "none", "none", "block"]}
        >
          {address && <UserWallet />}
        </Box>
        <Flex alignSelf="flex-start">
          <UserAddress />
        </Flex>
      </Flex>
    </>
  );
};

export default Header;
