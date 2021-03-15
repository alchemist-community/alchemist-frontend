import React from "react";
import UserWallet from "../UserWallet";
import UserAddress from "../UserAddress";
import logo from "../../img/logo.png";
import Web3Context from "../../Web3Context";
import { Image } from "@chakra-ui/image";
import { Box, Flex, LinkBox, LinkOverlay } from "@chakra-ui/layout";

const Header: React.FC = () => {
  const { address } = React.useContext(Web3Context);

  return (
    <>
      <Flex justifyContent="space-between" alignItems="center" py={4}>
        {/* Hardcoded 246 for now to center user wallet component */}
        <LinkBox width={["auto", "auto", 246]}>
          <LinkOverlay href="/">
            <Image
              src={logo}
              width={["50px", "50px", "60px"]}
              alt="alchemist logo"
            />
          </LinkOverlay>
        </LinkBox>
        <Box display={["none", "none", "none", "block"]}>
          {address && <UserWallet />}
        </Box>
        <Flex>
          <UserAddress />
        </Flex>
      </Flex>
    </>
  );
};

export default Header;
