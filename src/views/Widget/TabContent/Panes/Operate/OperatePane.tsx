import React, { useState, useEffect, useContext } from "react";
import { toMaxDecimalsRound } from "../../../utils";
import Web3Context from "../../../../../Web3Context";
import { getOwnedCrucibles } from "../../../../../contracts/getOwnedCrucibles";
import { unstakeAndClaim } from "../../../../../contracts/unstakeAndClaim";
import { withdraw } from "../../../../../contracts/withdraw";
import { Button, ButtonGroup } from "@chakra-ui/button";
import { Box, Flex, Text } from "@chakra-ui/layout";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/modal";
import { Input } from "@chakra-ui/input";
import { FormControl, FormLabel } from "@chakra-ui/form-control";

interface OperatePaneProps {
  handleInputChange?: (form: { [key: string]: string | number }) => void;
  isConnected: boolean;
}

const OperatePane: React.FC<OperatePaneProps> = (props) => {
  const { handleInputChange = () => null, isConnected } = props;

  const { onboard, signer, provider, monitorTx } = useContext(Web3Context);

  const [amount2Withdraw, setAmount2Withdraw] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalOperation, setModalOperation] = useState<"withdraw" | "unstake">(
    "unstake"
  );
  const [selectedCrucible, setSelectedCrucible] = useState("");

  const [formValues, setFormValues] = useState({
    lnBalance: "",
    tbtcBalance: "",
    linearFee: "",
    constantFee: "",
    nodeAddress: "",
  });

  const [crucibles, setCrucibles] = useState(
    [] as {
      id: string;
      balance: string;
      lockedBalance: string;
    }[]
  );
  useEffect(() => {
    getOwnedCrucibles(signer, provider).then(setCrucibles);
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

  // Todo: Add empty state
  return (
    <>
      {modalIsOpen && (
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
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button
                bg="green.300"
                color="white"
                mr={3}
                onClick={
                  modalOperation === "withdraw"
                    ? () => withdrawTokens
                    : () => unstake
                }
              >
                {modalOperation === "withdraw" ? "Withdraw" : "Unstake"}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {crucibles.map((crucible) => {
        return (
          <Flex
            py={2}
            borderRadius="lg"
            alignItems="center"
            justifyContent="space-between"
            flexDirection={["column", "column", "row"]}
          >
            <Box flexGrow={1} minWidth="300px" mb={[4, 4, 0]}>
              <Text textAlign={["center", "center", "left"]}>
                <Box>
                  <strong>Balance:</strong>{" "}
                  {`${crucible["balance"]} (${crucible["lockedBalance"]} locked)`}
                </Box>
                <Box>
                  <strong>ID:</strong> {crucible["id"]}
                </Box>
              </Text>
            </Box>
            <ButtonGroup size="sm" isAttached variant="outline"  mb={[4, 4, 0]}>
              <Button
                color="white"
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
              <Button
                color="white"
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
            </ButtonGroup>
          </Flex>
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
          onClick={() => onboard.walletSelect()}
        >
          Connect Wallet
        </Button>
      )}
    </>
  );
};

export default OperatePane;
