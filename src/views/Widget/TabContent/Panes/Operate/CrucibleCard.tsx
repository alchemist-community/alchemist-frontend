import React, { Dispatch, SetStateAction, useState } from "react";
import { decimalCount } from "../../../utils";
import { Button } from "@chakra-ui/button";
import { Badge, Box, Flex, HStack, Text } from "@chakra-ui/layout";
import { FaLock } from "react-icons/fa";
import { Tooltip } from "@chakra-ui/tooltip";

interface CrucibleCardProps {
  crucible: {
    id: string;
    balance: string;
    lockedBalance: string;
    cleanBalance: string;
    cleanLockedBalance: string;
    mistValue: string;
    wethValue: string;
    wethValueUsd: number;
    mistValueUsd: number;
    wethPrice: number;
    mistPrice: number;
  };
  setModalOperation: Dispatch<
    SetStateAction<"withdraw" | "unstake" | "send" | "increaseStake">
  >;
  setSelectedCrucible: (crucible: any) => void;
  setModalIsOpen: (open: boolean) => void;
  rewards: {
    tokenRewards: number;
    etherRewards: number;
  };
  lpStats: any;
  setSelectedRewards: (rewards: any) => void;
}
const CrucibleCard: React.FC<CrucibleCardProps> = (props) => {
  const {
    crucible,
    setModalOperation,
    setSelectedCrucible,
    setModalIsOpen,
    setSelectedRewards,
    rewards,
    lpStats,
  } = props;
  const [expandBalance, setExpandBalance] = useState(false);
  const [expandLock, setExpandLock] = useState(false);

  const expandBalanceNumber = () => {
    setExpandBalance(!expandBalance);
    setExpandLock(false);
  };

  const expandLockNumber = () => {
    setExpandLock(!expandLock);
    setExpandBalance(false);
  };

  const isBalanceTrunc = decimalCount(crucible?.cleanBalance) > 3;
  const isLockTrunc = decimalCount(crucible?.cleanLockedBalance) > 3;
  const netWethGain =
    Number(crucible.wethValue) - Number(lpStats?.totalWethDeposited);
  const netWethGainUSD = netWethGain * crucible.wethPrice;
  const netMistGain =
    Number(crucible.mistValue) - Number(lpStats?.totalMistDeposited);
  const netMistGainUSD = netMistGain * crucible.mistPrice;

  return (
    <Box
      key={crucible.id}
      p={4}
      mb={6}
      bg="gray.700"
      boxShadow="md"
      borderWidth={1}
      borderRadius="lg"
      alignItems="center"
      justifyContent="space-between"
      flexDirection={"column"}
    >
      <Box mb={4}>
        <Text as="div" fontSize="lg" textAlign={["center", "center", "left"]}>
          <Flex justifyContent="space-between" flexDirection="column">
            <Flex justifyContent="space-between">
              <Tooltip
                label="View total balance"
                placement="top"
                hasArrow={true}
                isDisabled={expandBalance || !isBalanceTrunc}
              >
                <Box
                  onClick={isBalanceTrunc ? expandBalanceNumber : undefined}
                  _hover={isBalanceTrunc ? { cursor: "pointer" } : undefined}
                >
                  <strong>Total Balance: </strong>
                  {!expandBalance ? (
                    <>
                      {`${Number(crucible?.cleanBalance).toFixed(4)}`}
                      {isBalanceTrunc && "..."}
                    </>
                  ) : (
                    crucible?.cleanBalance
                  )}
                </Box>
              </Tooltip>
              <Tooltip
                label="View staked balance"
                placement="top"
                hasArrow={true}
                isDisabled={expandLock || !isLockTrunc}
              >
                <Badge
                  py={1}
                  px={2}
                  borderRadius="xl"
                  fontSize=".7em"
                  onClick={isLockTrunc ? expandLockNumber : undefined}
                  _hover={isLockTrunc ? { cursor: "pointer" } : undefined}
                >
                  <HStack>
                    <Box>
                      {!expandLock ? (
                        <>
                          {Number(crucible?.cleanLockedBalance).toFixed(3)}
                          {isLockTrunc && "..."}
                        </>
                      ) : (
                        crucible?.cleanLockedBalance
                      )}
                    </Box>
                    <Tooltip
                      hasArrow
                      label="Staked amount"
                      bg="gray.600"
                      color="white"
                      placement="bottom-end"
                      offset={[0, 16]}
                    >
                      <div>
                        <FaLock />
                      </div>
                    </Tooltip>
                  </HStack>
                </Badge>
              </Tooltip>
            </Flex>
            <Flex
              fontSize="sm"
              color="gray.200"
              textAlign="left"
              verticalAlign="top"
              marginTop="8px"
            >
              <label style={{ alignSelf: "flex-start" }}>ID: </label>
              <span
                style={{
                  wordWrap: "break-word",
                  width: "100%",
                  paddingLeft: "4px",
                  paddingRight: "16px",
                }}
              >
                {crucible["id"]}
              </span>
            </Flex>
          </Flex>
          {rewards && (
            <>
              <HStack mt={4} justifyContent="space-between">
                <Tooltip
                  label="Total protocol rewards from MIST inflation"
                  placement="top"
                  hasArrow={true}
                >
                  <Box mr={2}>
                    <strong>MIST Rewards</strong>
                    <br />{" "}
                    {`${Number(rewards.tokenRewards).toFixed(4)} ($${(
                      rewards.tokenRewards * crucible.mistPrice
                    ).toFixed(2)})`}
                  </Box>
                </Tooltip>
                <Tooltip
                  label="Total protocol rewards from the ETH rewards pool"
                  placement="top"
                  hasArrow={true}
                >
                  <Box mr={2}>
                    <strong>ETH Rewards</strong> <br />{" "}
                    {`${Number(rewards.etherRewards).toFixed(4)} ($${(
                      rewards.etherRewards * crucible.wethPrice
                    ).toFixed(2)})`}
                  </Box>
                </Tooltip>
              </HStack>
            </>
          )}
          {crucible.mistValue && (
            <>
              <HStack mt={4} justifyContent="space-between">
                <Tooltip
                  label="Current ETH deposited in your staked liquidity pool tokens"
                  placement="top"
                  hasArrow={true}
                >
                  <Box mr={2}>
                    <strong>Current ETH</strong> <br />
                    {`${Number(crucible?.wethValue).toFixed(3)} ($${
                      crucible?.wethValueUsd
                    })`}
                  </Box>
                </Tooltip>
                <Tooltip
                  label="Current MIST deposited in your staked liquidity pool tokens"
                  placement="top"
                  hasArrow={true}
                >
                  <Box mr={2}>
                    <strong>Current MIST</strong> <br />
                    {`${Number(crucible?.mistValue).toFixed(3)} ($${
                      crucible?.mistValueUsd
                    })`}
                  </Box>
                </Tooltip>
              </HStack>
            </>
          )}
          {lpStats && (
            <>
              <HStack mt={4} justifyContent="space-between">
                <Tooltip
                  label="The initial amount of ETH you deposited for ETH/MIST liquidity pool tokens"
                  placement="top"
                  hasArrow={true}
                >
                  <Box mr={2}>
                    <strong>Starting ETH:</strong> <br />
                    {`${Number(lpStats?.totalWethDeposited).toFixed(3)}
                  `}
                  </Box>
                </Tooltip>
                <Tooltip
                  label="The initial amount of MIST you deposited for ETH/MIST liquidity pool tokens"
                  placement="top"
                  hasArrow={true}
                >
                  <Box mr={2}>
                    <strong>Starting MIST:</strong> <br />
                    {`${Number(lpStats?.totalMistDeposited).toFixed(3)}`}
                  </Box>
                </Tooltip>
              </HStack>
            </>
          )}
          {lpStats && (
            <>
              <HStack mt={4} justifyContent="space-between">
                <Tooltip
                  label="Gain/loss of ETH  represented in your liquidity pool"
                  placement="top"
                  hasArrow={true}
                >
                  <Box mr={2}>
                    <strong>{`Net ${
                      netWethGain > 0 ? "Gain" : "Loss"
                    } ETH`}</strong>{" "}
                    <br />
                    {`${netWethGain.toFixed(4)} ($${netWethGainUSD.toFixed(2)})
                  `}
                  </Box>
                </Tooltip>
                <Tooltip
                  label="Gain/loss of MIST in your liquidity pool"
                  placement="top"
                  hasArrow={true}
                >
                  <Box mr={2}>
                    <strong>{`Net ${
                      netMistGain > 0 ? "Gain" : "Loss"
                    } Mist`}</strong>{" "}
                    <br />
                    {`${netMistGain.toFixed(4)} ($${netMistGainUSD.toFixed(2)})
                  `}{" "}
                  </Box>
                </Tooltip>
              </HStack>
            </>
          )}
          {lpStats && (
            <>
              <HStack mt={4} justifyContent="space-between">
                <Tooltip
                  label="Total gains (USD) given the starting price of ETH and MIST"
                  placement="top"
                  hasArrow={true}
                >
                  <Box mr={2}>
                    <strong>Cummulative Gain/Loss</strong> <br />
                    {`$${(
                      crucible?.wethValueUsd * 2 -
                      lpStats?.totalWethDeposited * lpStats.wethPriceUSD * 2
                    ).toFixed(2)}
                  `}
                  </Box>
                </Tooltip>
              </HStack>
            </>
          )}
        </Text>
      </Box>
      {/* <ButtonGroup isAttached variant="outline" mb={[4, 4, 0]} spacing="4" width="100%"> */}
      <HStack mt={4}>
        <Button
          isFullWidth
          color="white"
          borderWidth={1}
          borderColor="gray.600"
          background="brand.400"
          fontSize={{ base: "sm", sm: "md" }}
          _focus={{ boxShadow: "none" }}
          _hover={{ background: "brand.400" }}
          onClick={() => {
            setModalOperation("increaseStake");
            setSelectedCrucible(crucible["id"]);
            setModalIsOpen(true);
          }}
        >
          Increase Stake
        </Button>

        <Button
          isFullWidth
          color="white"
          borderWidth={1}
          borderColor="gray.600"
          background="brand.400"
          fontSize={{ base: "sm", sm: "md" }}
          _focus={{ boxShadow: "none" }}
          _hover={{ background: "brand.400" }}
          onClick={() => {
            setModalOperation("send");
            setSelectedCrucible(crucible["id"]);
            setModalIsOpen(true);
          }}
        >
          Transfer Crucible
        </Button>
      </HStack>
      <HStack mt={4}>
        <Button
          isFullWidth
          color="white"
          borderWidth={1}
          borderColor="gray.600"
          background="brand.400"
          _focus={{ boxShadow: "none" }}
          _hover={{ background: "brand.400" }}
          onClick={() => {
            setModalOperation("unstake");
            setSelectedCrucible(crucible["id"]);
            setSelectedRewards(rewards);
            setModalIsOpen(true);
          }}
        >
          Unstake & Claim Rewards
        </Button>
        <Button
          isFullWidth
          color="white"
          borderWidth={1}
          borderColor="gray.600"
          background="brand.400"
          fontSize={{ base: "sm", sm: "md" }}
          _focus={{ boxShadow: "none" }}
          _hover={{ background: "brand.400" }}
          onClick={() => {
            setModalOperation("withdraw");
            setSelectedCrucible(crucible["id"]);
            setModalIsOpen(true);
          }}
        >
          Withdraw Unstaked
        </Button>
      </HStack>
    </Box>
  );
};

export default CrucibleCard;
