import React, { Dispatch, SetStateAction, useState } from "react";
import { decimalCount } from "../../../utils";
import { Button } from "@chakra-ui/button";
import { Badge, Box, Flex, HStack, Text } from "@chakra-ui/layout";
import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
  Divider,
} from "@chakra-ui/react";
import { FaLock } from "react-icons/fa";
import { Tooltip } from "@chakra-ui/tooltip";
import dayjs from "dayjs";

interface CrucibleCardProps {
  index: number;
  crucible: {
    id: string;
    mintTimestamp: number;
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
    index,
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
  const netWethGainLoss =
    Number(crucible.wethValue) - Number(lpStats?.totalWethDeposited);
  const netWethGainLossUSD = netWethGainLoss * crucible.wethPrice;
  const netMistGainLoss =
    Number(crucible.mistValue) - Number(lpStats?.totalMistDeposited);
  const netMistGainLossUSD = netMistGainLoss * crucible.mistPrice;
  const cummulativeGainLossUSD =
    crucible?.wethValueUsd * 2 -
    lpStats?.totalWethDeposited * lpStats.initialWethPriceUSD * 2;

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
                  as="h2"
                  fontWeight="semibold"
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
              direction="column"
            >
              <span
                style={{
                  wordWrap: "break-word",
                  width: "100%",
                  paddingLeft: "4px",
                  paddingRight: "16px",
                }}
              >
                ID: {crucible["id"]}
              </span>
              {lpStats && (
                <span
                  style={{
                    wordWrap: "break-word",
                    width: "100%",
                    paddingLeft: "4px",
                    paddingRight: "16px",
                  }}
                >
                  Minted{" "}
                  {dayjs(crucible.mintTimestamp * 1000).format("MMM-DD YYYY")}
                </span>
              )}
            </Flex>
          </Flex>
          <Box
            mt="8"
            fontWeight="semibold"
            as="h4"
            lineHeight="tight"
            isTruncated
          >
            Rewards
          </Box>
          <Divider />
          {rewards && (
            <>
              <StatGroup mt={4} alignItems="baseline">
                <Tooltip
                  label="Total protocol rewards from MIST inflation"
                  placement="top"
                  hasArrow={true}
                >
                  <Stat>
                    <StatLabel>Earned MIST Rewards</StatLabel>
                    <StatNumber>
                      {!isNaN(rewards.tokenRewards)
                        ? Number(rewards.tokenRewards).toFixed(4)
                        : "0"}
                    </StatNumber>
                    <StatHelpText>
                      <StatArrow type="increase" />$
                      {!isNaN(rewards.tokenRewards)
                        ? (rewards.tokenRewards * crucible.mistPrice).toFixed(0)
                        : "0"}
                    </StatHelpText>
                  </Stat>
                </Tooltip>

                <Tooltip
                  label="Total protocol rewards from the ETH rewards pool"
                  placement="top"
                  hasArrow={true}
                >
                  <Stat>
                    <StatLabel>Earned ETH Rewards</StatLabel>
                    <StatNumber>
                      {!isNaN(rewards.etherRewards)
                        ? Number(rewards.etherRewards).toFixed(4)
                        : "0"}
                    </StatNumber>
                    <StatHelpText>
                      <StatArrow type="increase" />$
                      {!isNaN(rewards.etherRewards)
                        ? (rewards.etherRewards * crucible.wethPrice).toFixed(0)
                        : "0"}
                    </StatHelpText>
                  </Stat>
                </Tooltip>
              </StatGroup>
            </>
          )}
          {crucible.mistValue && (
            <>
              <Box
                mt="8"
                fontWeight="semibold"
                as="h4"
                lineHeight="tight"
                isTruncated
              >
                LP Token Performance
              </Box>
              <Divider />
              <StatGroup mt={4} justifyContent="space-between">
                <Tooltip
                  label="Current ETH deposited in your staked liquidity pool tokens"
                  placement="top"
                  hasArrow={true}
                >
                  <Stat>
                    <StatLabel>Current ETH Balance</StatLabel>
                    <StatNumber>
                      {`${Number(crucible?.wethValue).toFixed(3)}`}
                    </StatNumber>
                    {/* <StatHelpText>
                      <StatArrow
                        type={netWethGainLoss > 0 ? "increase" : "decrease"}
                      />
                      {`${netWethGainLoss.toFixed(
                        3
                      )} Ξ  ($${netWethGainLossUSD.toFixed(0)})`}
                    </StatHelpText> */}
                  </Stat>
                </Tooltip>
                <Tooltip
                  label="Current MIST deposited in your staked liquidity pool tokens"
                  placement="top"
                  hasArrow={true}
                >
                  <Stat>
                    <StatLabel>Current MIST Balance</StatLabel>
                    <StatNumber>
                      {`${Number(crucible?.mistValue).toFixed(3)}`}
                    </StatNumber>
                    {/* <StatHelpText>
                      <StatArrow
                        type={netMistGainLoss > 0 ? "increase" : "decrease"}
                      />
                      {`${netMistGainLoss.toFixed(
                        3
                      )} · ($${netMistGainLossUSD.toFixed(0)})`}
                    </StatHelpText> */}
                  </Stat>
                </Tooltip>
                {/* <Tooltip
                  label="Total gains (USD) given the starting price of your ETH and MIST deposit into the Uniswap liquidity pool."
                  placement="top"
                  hasArrow={true}
                >
                  <Stat>
                    <StatLabel>
                      Cummulative {cummulativeGainLossUSD > 0 ? "Gain" : "Loss"}
                    </StatLabel>
                    <StatNumber>
                      {`$${cummulativeGainLossUSD.toFixed(0)}`}
                    </StatNumber>
                  </Stat>
                </Tooltip> */}
              </StatGroup>
            </>
          )}
          {/* {lpStats && (
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
          )} */}
          {/* {lpStats && (
            <>
              <HStack mt={4} justifyContent="space-between">
                <Tooltip
                  label="Cummulative Gain/Loss of underlying ETH in your liquidity pool."
                  placement="top"
                  hasArrow={true}
                >
                  <Box mr={2}>
                    <strong>{`Net ETH ${
                      netWethGainLoss > 0 ? "Gain" : "Loss"
                    }`}</strong>{" "}
                    <br />
                    {`${netWethGainLoss.toFixed(4)} ($${netWethGainLossUSD.toFixed(0)})
                  `}
                  </Box>
                </Tooltip>
                <Tooltip
                  label="Gain/loss of underlying MIST in your liquidity pool."
                  placement="top"
                  hasArrow={true}
                >
                  <Box mr={2}>
                    <strong>{`Net MIST ${
                      netMistGainLoss > 0 ? "Gain" : "Loss"
                    }`}</strong>{" "}
                    <br />
                    {`${netMistGainLoss.toFixed(4)} ($${netMistGainLossUSD.toFixed(0)})
                  `}{" "}
                  </Box>
                </Tooltip>
              </HStack>
            </>
          )} */}
        </Text>
      </Box>
      {/* <ButtonGroup isAttached variant="outline" mb={[4, 4, 0]} spacing="4" width="100%"> */}
      <HStack mt={12}>
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
