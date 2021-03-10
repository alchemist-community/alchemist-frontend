import React from "react";
import UserAddress from "../UserAddress";
import LOGO from "../../img/alembic.png";
import { Image } from "@chakra-ui/image";
import { IconButton } from "@chakra-ui/button";
import { FiSun, FiMoon } from "react-icons/fi";
import { useColorMode, useColorModeValue } from "@chakra-ui/color-mode";
import { Box, Flex, LinkBox, LinkOverlay } from "@chakra-ui/layout";

const Header: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  const isDarkMode = colorMode === "dark";
  const buttonHoverBgColor = useColorModeValue('gray.100', 'gray.700')

  return (
    <Flex justifyContent="space-between" alignItems="center" py={4}>
      <LinkBox>
        <LinkOverlay href="/">
          <Image src={LOGO} width={["50px", "50px", "70px"]} alt="alchemist logo" />
        </LinkOverlay>
      </LinkBox>
      <Box>
        <IconButton
          mr={2}
          borderRadius="lg"
          variant="ghost"
          onClick={toggleColorMode}
          icon={isDarkMode ? <FiMoon /> : <FiSun />}
          aria-label={isDarkMode ? "Toggle light mode" : "Toggle dark mode"}
          _hover={{ background: buttonHoverBgColor }}
        />
        <UserAddress />
      </Box>
    </Flex>
  );
};

export default Header;
