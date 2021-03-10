import React, { useContext, useState, useEffect } from "react";
import Web3Context from "../../Web3Context";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Text,
  Link,
  Button,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";

export default function UserAddress() {
  const { web3, connectWallet } = useContext(Web3Context);
  const [selectedAddress, setSelectedAddress] = useState<string>();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    setSelectedAddress(
      web3 === null ? undefined : (web3.currentProvider as any).selectedAddress
    );
  }, [web3]);

  const handleClick = () =>
    !selectedAddress &&
    connectWallet((errType) => errType === "NO_METAMASK" && onOpen());

  const buttonBgColor = useColorModeValue('white', 'gray.700')

  return (
    <>
      <Button
        onClick={handleClick}
        background={buttonBgColor}
        variant="muted"
        boxShadow="md"
        borderRadius="lg"
      >
        <Text fontSize="sm" color="gray.500" mr={2}>{selectedAddress ? "Mainnet:" : "Connect Wallet"}</Text>
        {selectedAddress && (
          <Text fontSize="sm" mr={4}>
            {selectedAddress.substring(0, 6) +
              "..." +
              selectedAddress.substring(selectedAddress.length - 4)}
          </Text>
        )}
        <Box
          background={selectedAddress ? "green.400" : "gray.400"}
          borderRadius="100%"
          width={3}
          height={3}
        />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Wallet not found</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              You must have MetaMask installed to use this product, get it
            </Text>
            You must have MetaMask installed to use this product, get it{" "}
            <Link
              isExternal
              rel="noopener noreferrer"
              href="https://metamask.io/"
            >
              here
            </Link>
            .
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Okay
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
