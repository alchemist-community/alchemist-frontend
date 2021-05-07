import React, { useState, useEffect, useContext } from "react";
import Web3Context from "../../../../../context/web3";
import { toMaxDecimalsRound } from "../../../utils";
import { mintAndLock } from "../../../../../contracts/alchemist";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { Alert } from "@chakra-ui/alert";
import { Button, IconButton } from "@chakra-ui/button";
import { Link, Text } from "@chakra-ui/layout";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/popover";
import { FiInfo } from "react-icons/fi";

interface OperatePaneProps {
  handleInputChange?: (form: { [key: string]: string | number }) => void;
  isConnected: boolean;
}

const OperatePane: React.FC<OperatePaneProps> = (props) => {
  const { handleInputChange = () => null, isConnected } = props;

  // Todo: type the extended web3context
  const {
    signer,
    provider,
    readyToTransact,
    monitorTx,
    tokenBalances,
  } = useContext(Web3Context);

  const [lpBalance, setLpBalance] = useState("");

  const onChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    //setXAmount is the amount displayed in the input, should be string
    let value = ev.target.value;
    if (ev.target.type === "number")
      value =
        ev.target.value === ""
          ? ev.target.value
          : toMaxDecimalsRound(ev.target.value, +ev.target.step).toString();

    setLpBalance(value);
  };

  useEffect(() => {
    handleInputChange({
      lpBalance,
    });
  }, [lpBalance, handleInputChange]);

  const maxStakeAmount = tokenBalances.cleanLp;

  return (
    <>
      <Alert
        mb={8}
        status="info"
        boxShadow="lg"
        borderWidth={1}
        borderRadius="lg"
        background="gray.700"
      >
        <Text color="gray.200">
          First, you will need to provide liquidity to the{" "}
          <span role="img" aria-label="alembic">
            ⚗️
          </span>
          /ETH liquidity pool on{" "}
          <Link
            color="brand.400"
            isExternal
            href="https://app.uniswap.org/#/add/v2/0x88ACDd2a6425c3FaAE4Bc9650Fd7E27e0Bebb7aB/ETH"
          >
            Uniswap V2
          </Link>
          .
        </Text>
      </Alert>

      <FormControl mb={4}>
        <FormLabel>
          Mist/ETH Liquidity Token Balance
          <Popover placement="right-start">
            <PopoverTrigger>
              <IconButton
                aria-label="info"
                variant="ghost"
                icon={<FiInfo />}
                _hover={{ background: "transparent", color: "brand.400" }}
                _focus={{ border: "none" }}
              />
            </PopoverTrigger>
            <PopoverContent _focus={{ outline: "none" }}>
              <PopoverArrow />
              <PopoverBody>How many LP tokens you want to subscribe to the Aludel rewards program.</PopoverBody>
            </PopoverContent>
          </Popover>
        </FormLabel>
        <InputGroup size="md">
          <Input
            size="lg"
            variant="filled"
            _focus={{ borderColor: "brand.400" }}
            value={lpBalance}
            onChange={onChange}
            name="lpBalance"
            placeholder="0.0"
            type="number"
          />
          <InputRightElement width="4.5rem" zIndex={0}>
            <Button
              mr={2}
              mt={2}
              h="2rem"
              variant="ghost"
              onClick={() => setLpBalance(maxStakeAmount)}
            >
              Max
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      {/* Todo: Make this button reusable, repeated styles */}
      {isConnected ? (
        <Button
          size="lg"
          isFullWidth
          color="white"
          background="brand.400"
          _focus={{ boxShadow: "none" }}
          _hover={{ background: "brand.400" }}
          isDisabled
          onClick={async () => {
            await readyToTransact();
            const hash: string = await mintAndLock(signer, provider, lpBalance);
            monitorTx(hash);
          }}
        >
          <Text fontSize={["xs", "xs", "md"]}>
            Mint Crucible and Subscribe LP to Aludel
          </Text>
        </Button>
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
      <Text color="white" fontSize="sm" mt={4} px={2}>
        Minting on alchemist.farm has been disabled with the launch of our new beta site: <Link color="blue.400" href='https://crucible.alchemist.wtf' target="_blank">crucible.alchemist.wtf</Link>. For all the wallets that are not yet supported on the beta release, you will be able to continue using Alchemist.Farm for your interactions with existing Crucibles.
      </Text>
    </>
  );
};

export default OperatePane;
