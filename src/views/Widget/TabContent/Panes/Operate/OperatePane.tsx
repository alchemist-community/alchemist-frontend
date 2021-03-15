import React, { useState, useEffect, useContext } from "react";
import { toMaxDecimalsRound } from "../../../utils";
import Web3Context from "../../../../../Web3Context";
import { getOwnedCrucibles } from "../../../../../contracts/getOwnedCrucibles";
import { unstakeAndClaim } from "../../../../../contracts/unstakeAndClaim";
import { sendNFT } from "../../../../../contracts/sendNFT";
import { withdraw } from "../../../../../contracts/withdraw";
import { Button } from "@chakra-ui/button";
import { Link, Flex } from "@chakra-ui/layout";
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
import { RepeatIcon } from "@chakra-ui/icons";
import { Spinner, Text } from "@chakra-ui/react";
import { mintAndLock } from "../../../../../contracts/alchemist";
import CrucibleCard from "./CrucibleCard";

interface OperatePaneProps {
  handleInputChange?: (form: { [key: string]: string | number }) => void;
  isConnected: boolean;
  crucibles: any;
  rewards: any;
}

const OperatePane: React.FC<OperatePaneProps> = (props) => {
  const {
    handleInputChange = () => null,
    isConnected,
    crucibles,
    rewards,
  } = props;

  const {
    readyToTransact,
    signer,
    provider,
    monitorTx,
    reloadCrucibles,
  } = useContext(Web3Context);

  const [amount, setAmount] = useState("");
  const [sendAddress, setSendAddress] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalOperation, setModalOperation] = useState<
    "withdraw" | "unstake" | "send" | "increaseStake"
  >("unstake");
  const [selectedCrucible, setSelectedCrucible] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [formValues, setFormValues] = useState({
    lnBalance: "",
    tbtcBalance: "",
    linearFee: "",
    constantFee: "",
    nodeAddress: "",
  });

  useEffect(() => {
    if (signer) {
      // getOwnedCrucibles(signer, provider).then(setCrucibles);
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
  const formatAmount = (ev: React.ChangeEvent<HTMLInputElement>) => {
    let amount = ev.target.value;
    setAmount(amount);
  };

  //todo
  const unstake = async () => {
    const cruciblesOnCurrentNetwork = await getOwnedCrucibles(signer, provider);
    // It would be nice to suggest the taichi network to the user but metamask doesn't allow suggestions for networks whose chainId it already contains
    if (cruciblesOnCurrentNetwork.length !== 0) {
      // On taichi eth_getLogs doesn't work and returns empty logs, we use this to hack together a taichi detection mechanism
      alert("You have not changed your network yet");
      return;
    }
    await unstakeAndClaim(signer, monitorTx, selectedCrucible, amount);
    alert(
      "Unstaked! Remember to change your network back to Mainnet and hit the refresh button to see your crucibles."
    );
    setModalIsOpen(false);
  };

  const increaseStake = async () => {
    await readyToTransact();
    const hash: string = await mintAndLock(signer, provider, amount);
    monitorTx(hash);
  };
  const withdrawTokens = async () => {
    await withdraw(selectedCrucible, amount);
    setModalIsOpen(false);
  };

  const refreshCrucibles = () => {
    setIsLoading(true);
    reloadCrucibles().then(() => {
      setIsLoading(false);
    });
  };

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
              _focus={{ borderColor: "brand.400" }}
              value={sendAddress}
              onChange={(ev) => setSendAddress(ev.target.value)}
              name="address"
              type="string"
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            bg="brand.400"
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
                {modalOperation === "withdraw"
                  ? "Withdraw"
                  : modalOperation === "unstake"
                  ? "Unstake"
                  : "Increase stake"}
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                {modalOperation === "unstake" ? (
                  <>
                    Before unstaking you'll need to add a new network provider
                    following{" "}
                    <Link
                      color="green.300"
                      href="https://github.com/Taichi-Network/docs/blob/master/sendPriveteTx_tutorial.md"
                      isExternal
                    >
                      this guide
                    </Link>
                  </>
                ) : (
                  ""
                )}
                <FormControl mb={4}>
                  <FormLabel>Amount</FormLabel>
                  {/* TODO: Add max button */}
                  <Input
                    size="lg"
                    variant="filled"
                    _focus={{ borderColor: "brand.400" }}
                    value={amount}
                    onChange={formatAmount}
                    name="balance"
                    placeholder="0.0"
                    type="number"
                  />
                </FormControl>
              </ModalBody>

              <ModalFooter>
                <Button
                  bg="brand.400"
                  color="white"
                  mr={3}
                  onClick={
                    modalOperation === "withdraw"
                      ? withdrawTokens
                      : modalOperation === "unstake"
                      ? unstake
                      : increaseStake
                  }
                >
                  {modalOperation === "withdraw"
                    ? "Withdraw"
                    : modalOperation === "unstake"
                    ? "Unstake"
                    : "Increase stake"}
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        ))}
      {isConnected && (
        <Flex flexDirection="column">
          <RepeatIcon
            onClick={refreshCrucibles}
            _hover={{ cursor: "pointer" }}
            alignSelf="flex-end"
            mb={4}
          />
        </Flex>
      )}
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          {isConnected &&
            rewards &&
            (crucibles.length ? (
              crucibles.map((crucible: any, i: number) => {
                return (
                  <CrucibleCard
                    crucible={crucible}
                    rewards={rewards[i]}
                    setModalOperation={setModalOperation}
                    setModalIsOpen={setModalIsOpen}
                    setSelectedCrucible={setSelectedCrucible}
                  />
                );
              })
            ) : (
              <Text textAlign="left">
                Your crucibles may not be appearing if you are on a private
                network. Switch to the Mainnet and click the refresh button.
              </Text>
            ))}
        </>
      )}
      {isConnected ? (
        <></>
      ) : (
        <Button
          size="lg"
          isFullWidth
          color="white"
          background="brand.400"
          _focus={{ boxShadow: "none" }}
          _hover={{ background: "brand.400" }}
          onClick={() => readyToTransact()}
        >
          Connect Wallet
        </Button>
      )}
    </>
  );
};

export default OperatePane;
