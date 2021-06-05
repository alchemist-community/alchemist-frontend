import { Box, Flex, Link, Text } from "@chakra-ui/layout";
import { Image } from "@chakra-ui/image";
import Footer from "../views/Footer";
import Header from "../views/Header";
import Body from "../views/Body";
import bg from "../img/bg.jpg";
import pool from "../img/pool.png";
import React from "react";
import { Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay } from "@chakra-ui/modal";

interface LayoutProps { }

const Layout: React.FC<LayoutProps> = () => {
  return (
    <Flex
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
        display={["none", "none", "block"]}
        bottom={-200}
        zIndex={-1}
        left="50%"
        transform="translateX(-50%)"
      />
      <Header />
      <Box flexGrow={1}>
        <Body />
      </Box>
      <Footer />
      <Modal isOpen onClose={() => null} closeOnOverlayClick={false} closeOnEsc={false} size='xl'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>This site is no longer being maintained</ModalHeader>
          <ModalBody mb={4}>
            <Text>Our new and improved site can be found here:</Text>
            <Link href='https://crucible.alchemist.wtf' color="blue.400">https://crucible.alchemist.wtf</Link>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};
export default Layout;
