import React, { useState, useEffect, useContext } from "react";
import { toMaxDecimalsRound } from "../../../utils";
import Web3Context from "../../../../../Web3Context";
import { getOwnedCrucibles } from "../../../../../contracts/getOwnedCrucibles";
import { unstakeAndClaim } from "../../../../../contracts/unstakeAndClaim";
import { sendNFT } from "../../../../../contracts/sendNFT";
import { withdraw } from "../../../../../contracts/withdraw";
import { Button, ButtonGroup } from "@chakra-ui/button";
import { Badge, Box, Flex, HStack, Text } from "@chakra-ui/layout";
import { FaLock } from "react-icons/fa";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/modal";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { useColorModeValue } from "@chakra-ui/color-mode";

interface OperatePaneProps {
  handleInputChange?: (form: { [key: string]: string | number }) => void;
  isConnected: boolean;
}

// Todo extract common interfaces/types to seperate file
interface Crucible {
  id: string;
  balance: string;
  lockedBalance: string;
}

const OperatePane: React.FC<OperatePaneProps> = (props) => {
  const { handleInputChange = () => null, isConnected } = props;

  const { readyToTransact, signer, provider, monitorTx } = useContext(
    Web3Context
  );

  const [amount2Withdraw, setAmount2Withdraw] = useState("");
  const [sendAddress, setSendAddress] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalOperation, setModalOperation] = useState<
    "withdraw" | "unstake" | "send"
  >("unstake");
  const [selectedCrucible, setSelectedCrucible] = useState("");

  const [formValues, setFormValues] = useState({
    lnBalance: "",
    tbtcBalance: "",
    linearFee: "",
    constantFee: "",
    nodeAddress: "",
  });

  const [crucibles, setCrucibles] = useState<Crucible[]>([]);
  useEffect(() => {
    if (signer) {
      getOwnedCrucibles(signer, provider).then(setCrucibles);
    }
  }, [isConnected, provider, signer]);

  const onChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    //setXAmount is the amount displayed in the input, should be string
    const name = ev.target.name;
    let value = ev.target.value;
    if (ev.target.type === "number")
      value =
        ev.target.value === ""
          ? ev.target.value
          : toMaxDecimalsRound(ev.target.value, +ev.target.step).toString();

    setFormValues((old) => {
      return {
        ...old,
        [name]: value,
      };
    });
  };

  useEffect(() => {
    handleInputChange(formValues);
  }, [formValues, handleInputChange]);

  //todo
  const formatAmount2Withdraw = (ev: React.ChangeEvent<HTMLInputElement>) => {
    let amount = ev.target.value;

    setAmount2Withdraw(amount);
  };

  //todo
  const unstake = async () => {
    await unstakeAndClaim(signer, monitorTx, selectedCrucible, amount2Withdraw);
    setModalIsOpen(false);
  };
  const withdrawTokens = async () => {
    await withdraw(selectedCrucible, amount2Withdraw);
    setModalIsOpen(false);
  };
  const handleMax = () => {
    const selected = crucibles.find(crucible => crucible.id === selectedCrucible);

    if (modalOperation === 'unstake') {
      const maxAmount = selected?.lockedBalance ?? "0";
      setAmount2Withdraw(maxAmount);
      return;
    } else {
      // Implementation dependant on pull/23
    }
  }
  const cruciblesCardBg = useColorModeValue("white", "gray.600");

  const sendModal = (
    <Modal isOpen onClose={() => setModalIsOpen(false)}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Send</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4}>
            <FormLabel>Address</FormLabel>
            <Input
              size="lg"
              variant="filled"
              _focus={{ borderColor: "green.300" }}
              value={sendAddress}
              onChange={(ev) => setSendAddress(ev.target.value)}
              name="address"
              type="string"
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            bg="green.300"
            color="white"
            mr={3}
            onClick={async () => {
              await sendNFT(signer, selectedCrucible, sendAddress);
              setModalIsOpen(false);
            }}
          >
            Send
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  // Todo: Add empty state
  return (
    <>
      {modalIsOpen &&
        (modalOperation === "send" ? (
          sendModal
        ) : (
          <Modal isOpen onClose={() => setModalIsOpen(false)}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
                {modalOperation === "withdraw" ? "Withdraw" : "Unstake"}
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl mb={4}>
                  <FormLabel>Amount</FormLabel>
                  <InputGroup size="md">
                    <Input
                      size="lg"
                      variant="filled"
                      _focus={{ borderColor: "green.300" }}
                      value={amount2Withdraw}
                      onChange={formatAmount2Withdraw}
                      name="balance"
                      placeholder="0.0"
                      type="number"
                    />
                    <InputRightElement width="4.5rem">
                      <Button
                        mr={2}
                        mt={2}
                        h="2rem"
                        variant="ghost"
                        onClick={handleMax}
                      >
                        Max
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
              </ModalBody>

              <ModalFooter>
                <Button
                  bg="green.300"
                  color="white"
                  mr={3}
                  onClick={
                    modalOperation === "withdraw" ? withdrawTokens : unstake
                  }
                >
                  {modalOperation === "withdraw" ? "Withdraw" : "Unstake"}
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        ))}

      {crucibles.map((crucible) => {
        return (
          <Box
            p={4}
            mb={6}
            bg={cruciblesCardBg}
            boxShadow="md"
            borderWidth={1}
            borderRadius="lg"
            alignItems="center"
            justifyContent="space-between"
            flexDirection={"column"}
          >
            <Box mb={4}>
              <Text
                as="div"
                fontSize="lg"
                textAlign={["center", "center", "left"]}
              >
                <Flex justifyContent="space-between">
                  <HStack>
                    <Box mr={2}>
                      <strong>Balance:</strong> {`${crucible["balance"]}`}
                    </Box>
                    <Badge py={1} px={2} borderRadius="xl" fonSize="2em">
                      <HStack>
                        <Box>{crucible["lockedBalance"]}</Box>
                        <FaLock />
                      </HStack>
                    </Badge>
                  </HStack>
                  <Box fontSize="sm" color="gray.400">
                    ID: {crucible["id"]}
                  </Box>
                </Flex>
              </Text>
            </Box>
            <ButtonGroup
              isAttached
              variant="outline"
              mb={[4, 4, 0]}
              width="100%"
            >
              {/*
              <Button
                isFullWidth
                color="white"
                borderWidth={1}
                borderColor={cruciblesCardBg}
                background="green.300"
                _focus={{ boxShadow: "none" }}
                _hover={{ background: "green.400" }}
                onClick={() => {
                  setModalOperation("unstake");
                  setSelectedCrucible(crucible["id"]);
                  setModalIsOpen(true);
                }}
              >
                Unstake
              </Button>
              */}
              <Button
                isFullWidth
                color="white"
                borderWidth={1}
                borderColor={cruciblesCardBg}
                background="green.300"
                _focus={{ boxShadow: "none" }}
                _hover={{ background: "green.400" }}
                onClick={() => {
                  setModalOperation("withdraw");
                  setSelectedCrucible(crucible["id"]);
                  setModalIsOpen(true);
                }}
              >
                Withdraw
              </Button>
              <Button
                isFullWidth
                color="white"
                borderWidth={1}
                borderColor={cruciblesCardBg}
                background="green.300"
                _focus={{ boxShadow: "none" }}
                _hover={{ background: "green.400" }}
                onClick={() => {
                  setModalOperation("send");
                  setSelectedCrucible(crucible["id"]);
                  setModalIsOpen(true);
                }}
              >
                Send
              </Button>
            </ButtonGroup>
          </Box>
        );
      })}
      {isConnected ? (
        <></>
      ) : (
        <Button
          size="lg"
          isFullWidth
          color="white"
          background="green.300"
          _focus={{ boxShadow: "none" }}
          _hover={{ background: "green.400" }}
          onClick={() => readyToTransact()}
        >
          Connect Wallet
        </Button>
      )}
    </>
  );
};

export default OperatePane;
