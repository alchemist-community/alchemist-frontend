import { Box, Flex } from "@chakra-ui/layout";
import Footer from "../views/Footer";
import Header from "../views/Header";
import Body from "../views/Body";
import bg from '../img/bg.jpg'
import pool from '../img/pool.png'
import React from "react";
import { Image } from "@chakra-ui/image";

interface LayoutProps {}

const Layout: React.FC<LayoutProps> = () => {

  return (
    <Flex
      px={[4, 4, 12]}
      minHeight="100vh"
      flexDirection="column"
      backgroundSize="cover"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      background={`url(${bg})`}
      position="relative"
      overflow="hidden"
      zIndex={0}
    >
      <Image
        src={pool}
        position="absolute"
        backgroundPosition="center"
        display={['none', 'none', 'block']}
        bottom={-200}
        zIndex={-1}
        left={0}
      />
      <Header />
      <Box flexGrow={1}>
        <Body />
      </Box>
      <Footer />
    </Flex>
  );
};
export default Layout;
