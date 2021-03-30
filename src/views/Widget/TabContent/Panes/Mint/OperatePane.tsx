import React, { useState, useEffect, useContext } from "react";
import Web3Context from "../../../../../context/web3";
import { mintAndLock } from "../../../../../contracts/alchemist";
import { Button, IconButton } from "@chakra-ui/button";
import { Box, HStack, Link, Text } from "@chakra-ui/layout";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/popover";
import { FiInfo } from "react-icons/fi";
import { Portal } from "@chakra-ui/portal";
import { NumberInput, NumberInputField } from "@chakra-ui/number-input";
import {
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/slider";
import { LightMode } from "@chakra-ui/color-mode";

interface OperatePaneProps {
  handleInputChange?: (form: { [key: string]: string | number }) => void;
  isConnected: boolean;
}

const OperatePane: React.FC<OperatePaneProps> = (props) => {
  const { handleInputChange = () => null } = props;

  const {
    signer,
    provider,
    readyToTransact,
    monitorTx,
    tokenBalances,
  } = useContext(Web3Context);

  const [lpBalance, setLpBalance] = useState("0");

  const onChange = (valueAsString: string) => {
    //setXAmount is the amount displayed in the input, should be string
    setLpBalance(valueAsString);
  };

  useEffect(() => {
    handleInputChange({
      lpBalance,
    });
  }, [lpBalance, handleInputChange]);

  const maxStakeAmount = tokenBalances.cleanLp;

  return (
    <Box p={8}>
      <FormControl mb={4}>
        <FormLabel>
          <HStack>
            <Text fontWeight="bold" fontSize="2xl">
              LP Balance
            </Text>
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
              <Portal>
                <PopoverContent _focus={{ outline: "none" }}>
                  <PopoverArrow />
                  <PopoverBody>
                    <Box>
                      Enter how many LP tokens you want to stake. If you have no
                      LP tokens, you will need to provide liquidity to the{" "}
                      <span role="img" aria-label="alembic">
                        ⚗️
                      </span>
                      /ETH pair on{" "}
                      <Link
                        color="brand.400"
                        isExternal
                        href="https://app.uniswap.org/#/add/0x88acdd2a6425c3faae4bc9650fd7e27e0bebb7ab/ETH"
                      >
                        Uniswap
                      </Link>
                    </Box>
                  </PopoverBody>
                </PopoverContent>
              </Portal>
            </Popover>
          </HStack>
        </FormLabel>
        <LightMode>
          <Box p={8} bg="white" borderRadius="xl">
            <Text mb={4} fontSize="xl" textAlign="left" color="gray.800">
              Balance: <strong>{maxStakeAmount} LP</strong>
            </Text>
            <NumberInput
              size="lg"
              px={0}
              py={0}
              defaultValue={0.0}
              clampValueOnBlur={false}
              max={20}
              color="gray.900"
              value={lpBalance}
              onChange={onChange}
              name="lpBalance"
              type="number"
            >
              <NumberInputField
                bg="gray.50"
                textAlign="right"
                pr={1}
                mb={2}
                fontWeight="bold"
                fontSize="2xl"
              />
              <HStack>
                <Slider
                  flex="1"
                  focusThumbOnChange={false}
                  min={0.0}
                  max={+maxStakeAmount || 1}
                  step={0.1}
                  value={+lpBalance}
                  onChange={(val) => {
                    setLpBalance(val.toString());
                  }}
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb
                    ml={3}
                    fontSize="sm"
                    boxSize="24px"
                    bg="#FFBF00"
                  />
                </Slider>
                <Button
                  px={0}
                  fontWeight="bold"
                  variant="ghost"
                  onClick={() => setLpBalance(maxStakeAmount)}
                  _hover={{
                    background: "none",
                  }}
                  _active={{
                    background: "none",
                  }}
                >
                  USE ALL
                </Button>
              </HStack>
            </NumberInput>
          </Box>
        </LightMode>
      </FormControl>

      <Button
        py={8}
        size="lg"
        isFullWidth
        fontSize="2xl"
        color="gray.800"
        fontWeight="bold"
        borderRadius="xl"
        background="#FFBF00"
        isDisabled={lpBalance > maxStakeAmount}
        onClick={async () => {
          await readyToTransact();
          const hash: string = await mintAndLock(signer, provider, lpBalance);
          monitorTx(hash);
        }}
        _focus={{ boxShadow: "none" }}
        _hover={{ background: "#FFBF00" }}
      >
        Mint and stake
      </Button>

      <Text color="gray.200" fontSize="sm" mt={4} px={2}>
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
    </Box>
  );
};

export default OperatePane;
