import React, { useState, useEffect, useContext } from "react";
import { toMaxDecimalsRound } from "../../../utils";
import Web3Context from "../../../../../context/web3";
import { getOwnedCrucibles } from "../../../../../contracts/getOwnedCrucibles";
import { unstakeAndClaim } from "../../../../../contracts/unstakeAndClaim";
import { sendNFT } from "../../../../../contracts/sendNFT";
import { withdraw } from "../../../../../contracts/withdraw";
import { increaseStake } from "../../../../../contracts/increaseStake";
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
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
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
    tokenBalances,
  } = useContext(Web3Context);

  const [amount, setAmount] = useState("");
  const [sendAddress, setSendAddress] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalOperation, setModalOperation] = useState<
    "withdraw" | "unstake" | "send" | "increaseStake"
  >("unstake");
  const [selectedCrucible, setSelectedCrucible] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRewards, setSelectedRewards] = useState({
    tokenRewards: "",
    etherRewards: "",
  });

  const [formValues, setFormValues] = useState({
    lnBalance: "",
    tbtcBalance: "",
    linearFee: "",
    constantFee: "",
    nodeAddress: "",
  });

  // Check user LP balances and user's selected crucible for locked/unlocked balances
  const foundCrucible =
    selectedCrucible &&
    crucibles.find((crucible: any) => selectedCrucible === crucible.id);
  const maxWithdrawAmount = foundCrucible.cleanUnlockedBalance;
  const maxUnstakeAmount = foundCrucible.cleanLockedBalance;
  const maxStakeAmount = tokenBalances.cleanLp;

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
      alert(
        "You have not changed your network yet. Follow this guide to privately withdraw your stake- https://github.com/Taichi-Network/docs/blob/master/sendPriveteTx_tutorial.md"
      );
      return;
    }
    await unstakeAndClaim(signer, monitorTx, selectedCrucible, amount);
    alert(
      "You have unstaked your crucible. Remember to change your network back to Mainnet and hit the refresh button to see your crucibles."
    );
    setModalIsOpen(false);
  };

  const increaseStakeAmount = async () => {
    await readyToTransact();
    const hash: string = await increaseStake(signer, selectedCrucible, amount);
    monitorTx(hash);
    setModalIsOpen(false);
    alert(
      "You have added to your crucible stake and will start earning rewards once the transaction confirms."
    );
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
    <Modal
      isOpen
      onClose={() => {
        setAmount("");
        setModalIsOpen(false);
      }}
    >
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
              placeholder="0x4ab..."
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
                  ? "Unstake and claim"
                  : "Increase Stake"}
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                {modalOperation === "withdraw" ? (
                  <>
                    Before withdrawing your LP tokens from your crucible, you
                    must first unstake and claim your rewards.
                  </>
                ) : modalOperation === "unstake" ? (
                  <>
                    You are claiming {selectedRewards?.tokenRewards} MIST and{" "}
                    {selectedRewards?.etherRewards} Ether rewards.
                    <br />
                    Before unstaking you'll need to add a new network provider
                    following{" "}
                    <Link
                      color="brand.400"
                      href="https://github.com/Taichi-Network/docs/blob/master/sendPriveteTx_tutorial.md"
                      isExternal
                    >
                      this guide.
                    </Link>
                  </>
                ) : (
                  <>
                    Increase your Crucible Stake by depositing Uniswap Liquidity
                    Pool tokens. You can get LP tokens by depositing ETH and
                    MIST to the trading pair{" "}
                    <Link
                      color="brand.400"
                      isExternal
                      href="https://app.uniswap.org/#/add/0x88acdd2a6425c3faae4bc9650fd7e27e0bebb7ab/ETH"
                    >
                      here.
                    </Link>
                  </>
                )}
                <FormControl mb={4} mt={4}>
                  <FormLabel>Amount</FormLabel>
                  {/* TODO: Add max button */}
                  <InputGroup size="md">
                    <Input
                      size="lg"
                      variant="filled"
                      _focus={{ borderColor: "brand.400" }}
                      value={amount}
                      isInvalid={
                        modalOperation === "increaseStake"
                          ? amount > maxStakeAmount
                          : modalOperation === "withdraw"
                          ? amount > maxWithdrawAmount
                          : amount > maxUnstakeAmount
                      }
                      onChange={formatAmount}
                      name="balance"
                      placeholder={"Uniswap LP Tokens"}
                      type="number"
                    />
                    <InputRightElement width="4.5rem" zIndex={0}>
                      <Button
                        mr={2}
                        mt={2}
                        h="2rem"
                        variant="ghost"
                        onClick={() => {
                          modalOperation === "increaseStake"
                            ? setAmount(maxStakeAmount)
                            : modalOperation === "withdraw"
                            ? setAmount(maxWithdrawAmount)
                            : setAmount(maxUnstakeAmount);
                        }}
                      >
                        Max
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
              </ModalBody>

              <ModalFooter>
                <Button
                  bg="brand.400"
                  color="white"
                  mr={3}
                  isDisabled={
                    modalOperation === "increaseStake"
                      ? amount > maxStakeAmount
                      : modalOperation === "withdraw"
                      ? amount > maxWithdrawAmount
                      : amount > maxUnstakeAmount
                  }
                  onClick={
                    modalOperation === "withdraw"
                      ? withdrawTokens
                      : modalOperation === "unstake"
                      ? unstake
                      : increaseStakeAmount
                  }
                >
                  {modalOperation === "withdraw"
                    ? "Withdraw"
                    : modalOperation === "unstake"
                    ? "Unstake and claim"
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
                    setSelectedRewards={setSelectedRewards}
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
