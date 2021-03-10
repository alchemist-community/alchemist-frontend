import { Box, Flex } from "@chakra-ui/layout";
import Footer from "../views/Footer";
import Header from "../views/Header";
import Body from "../views/Body";
import React from "react";
import { useColorModeValue } from "@chakra-ui/color-mode";

interface LayoutProps {}

const Layout: React.FC<LayoutProps> = () => {
  const bgColor = useColorModeValue("gray.50", "gray.800");

  return (
    <Flex
      minHeight="100vh"
      flexDirection="column"
      backgroundColor={bgColor}
      px={[4, 4, 12]}
    >
      <Header />
      <Box flexGrow={1}>
        <Body />
      </Box>
      <Footer />
    </Flex>
  );
};
export default Layout;
