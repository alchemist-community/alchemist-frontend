import { Box, Flex } from "@chakra-ui/layout";
import Footer from "../views/Footer";
import Header from "../views/Header";
import Body from "../views/Body";
import bg from '../img/bg.jpg'
import React from "react";

interface LayoutProps {}

const Layout: React.FC<LayoutProps> = () => {

  return (
    <Flex
      px={[4, 4, 12]}
      minHeight="100vh"
      flexDirection="column"
      backgroundSize="cover"
      backgroundPosition="center"
      background={`url(${bg})`}
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
