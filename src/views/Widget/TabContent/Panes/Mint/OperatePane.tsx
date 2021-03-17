import React, { useState, useEffect, useContext } from "react";
import Web3Context from "../../../../../Web3Context";
import { toMaxDecimalsRound } from "../../../utils";
import { mintAndLock } from "../../../../../contracts/alchemist";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { Alert } from "@chakra-ui/alert";
import { Button, IconButton } from "@chakra-ui/button";
import { Link, Text } from "@chakra-ui/layout";
import { useColorModeValue } from "@chakra-ui/color-mode";
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
    const name = ev.target.name;
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

  const alertBgColor = useColorModeValue("gray.50", "gray.600");
  const maxStakeAmount = tokenBalances.cleanLp;

  return (
    <>
      <Alert
        mb={8}
        status="info"
        borderWidth={1}
        borderRadius="lg"
        borderColor="brand.400"
        background={alertBgColor}
      >
        <Text>
          First you will need to provide liquidity to the{" "}
          <span role="img" aria-label="alembic">
            ⚗️
          </span>
          /ETH pair on Uniswap through{" "}
          <Link
            color="brand.400"
            isExternal
            href="https://app.uniswap.org/#/add/0x88acdd2a6425c3faae4bc9650fd7e27e0bebb7ab/ETH"
          >
            this
          </Link>
          .
        </Text>
      </Alert>

      <FormControl mb={4}>
        <FormLabel>
          LP Balance
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
              <PopoverBody>How many LP tokens you want to stake.</PopoverBody>
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
          isDisabled={ lpBalance > maxStakeAmount}
          onClick={async () => {
            await readyToTransact();
            const hash: string = await mintAndLock(signer, provider, lpBalance);
            monitorTx(hash);
          }}
        >
          Stake
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
      <Text color="gray.500" mt={4} px={2}>
        Ledger wallets on Metamask don't support the signature types required,
        so they won't work. See{" "}
        <Link
          color="brand.400"
          href="https://github.com/MetaMask/metamask-extension/issues/10240"
          isExternal
        >
          the github issue
        </Link>{" "}
        for more info.
      </Text>
    </>
  );
};

export default OperatePane;
