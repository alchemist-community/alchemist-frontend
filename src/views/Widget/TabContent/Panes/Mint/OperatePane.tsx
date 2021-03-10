import React, { useState, useEffect, useContext } from "react";
import { toMaxDecimalsRound } from "../../../utils";
import Web3Context from "../../../../../Web3Context";
import { mintAndLock } from "../../../../../contracts/alchemist";
import { Input } from "@chakra-ui/input";
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

  const { connectWallet } = useContext(Web3Context);

  const [formValues, setFormValues] = useState({
    lpBalance: "",
    lockLength: "",
  });

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

  const alertBgColor = useColorModeValue("gray.50", "gray.600");

  return (
    <>
      <Alert
        mb={8}
        status="info"
        borderWidth={1}
        borderRadius="lg"
        borderColor="green.300"
        background={alertBgColor}
      >
        <Text>
          First you will need to provide liquidity to the{" "}
          <span role="img" aria-label="alembic">
            ⚗️
          </span>
          /ETH pair on Uniswap through{" "}
          <Link
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
                _hover={{ background: "transparent", color: "green.300" }}
                _focus={{ border: "none" }}
              />
            </PopoverTrigger>
            <PopoverContent _focus={{ outline: "none" }}>
              <PopoverArrow />
              <PopoverBody>How many LP tokens you want to stake.</PopoverBody>
            </PopoverContent>
          </Popover>
        </FormLabel>
        <Input
          size="lg"
          variant="filled"
          _focus={{ borderColor: "green.300" }}
          value={formValues["lpBalance"]}
          onChange={onChange}
          name="lpBalance"
          label="LP Balance "
          placeholder="0.0"
          type="number"
        />
      </FormControl>

      {/* Todo: Make buttons reusable / define styles in global theme */}
      {isConnected ? (
        <Button
          size="lg"
          isFullWidth
          color="white"
          background="green.300"
          _focus={{ boxShadow: "none" }}
          _hover={{ background: "green.400" }}
          onClick={() => {
            mintAndLock(formValues.lpBalance);
          }}
        >
          Stake
        </Button>
      ) : (
        <Button
          size="lg"
          isFullWidth
          color="white"
          background="green.300"
          _focus={{ boxShadow: "none" }}
          _hover={{ background: "green.400" }}
          onClick={() => connectWallet()}
        >
          Connect Wallet
        </Button>
      )}
      <Text color="gray.500" mt={4} px={2}>
        Ledger wallets on Metamask don't support the signature types required,
        so they won't work. See{" "}
        <Link
          color="green.300"
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
