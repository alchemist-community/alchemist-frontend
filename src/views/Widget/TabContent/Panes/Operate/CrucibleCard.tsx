import React, { Dispatch, SetStateAction, useState } from "react";
import { decimalCount } from "../../../utils";
import { Button } from "@chakra-ui/button";
import { Badge, Box, Flex, HStack, Text } from "@chakra-ui/layout";
import { FaLock } from "react-icons/fa";
import { Tooltip } from "@chakra-ui/tooltip";
import { LightMode } from "@chakra-ui/color-mode";

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
  return (
    <Box
      key={crucible.id}
      p={8}
      mb={6}
      bg="white"
      boxShadow="md"
      borderWidth={1}
      borderRadius="xl"
      alignItems="center"
      justifyContent="space-between"
      flexDirection={"column"}
    >
      <LightMode>
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
                    color="gray.800"
                    fontSize="xl"
                    onClick={isBalanceTrunc ? expandBalanceNumber : undefined}
                    _hover={isBalanceTrunc ? { cursor: "pointer" } : undefined}
                  >
                    Total Balance:{" "}
                    {!expandBalance ? (
                      <strong>
                        {`${parseFloat(
                          Number(crucible?.cleanBalance).toFixed(4)
                        )}`}
                        {isBalanceTrunc && "..."}
                      </strong>
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
                    variant="solid"
                    colorScheme="brand"
                    borderRadius="xl"
                    fontSize=".7em"
                    onClick={isLockTrunc ? expandLockNumber : undefined}
                    _hover={isLockTrunc ? { cursor: "pointer" } : undefined}
                  >
                    <HStack>
                      <Box>
                        {!expandLock ? (
                          <>
                            {parseFloat(
                              Number(crucible?.cleanLockedBalance).toFixed(3)
                            )}
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
                color="gray.400"
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
                <HStack mt={4} color="gray.800">
                  <Box mr={2}>
                    <strong>MIST Rewards:</strong> {`${rewards.tokenRewards}`}
                  </Box>
                  <Box mr={2}>
                    <strong>Ether Rewards:</strong> {`${rewards.etherRewards}`}
                  </Box>
                </HStack>
                {/* <HStack>
                      <Box mr={2}>
                        <strong>Staking Rewards (Y):</strong>{" "}
                        {`${rewards[i].futStakeRewards}`}
                      </Box>
                      <Box mr={2}>
                        <strong>Future Vault Rewards (Y):</strong>{" "}
                        {`${rewards[i].futVaultRewards}`}
                      </Box>
                    </HStack> */}
              </>
            )}
          </Text>
        </Box>
        {/* <ButtonGroup isAttached variant="outline" mb={[4, 4, 0]} spacing="4" width="100%"> */}
        <HStack mt={4}>
          <Button
            isFullWidth
            color="gray.800"
            fontWeight="bold"
            borderRadius="xl"
            background="#FFBF00"
            fontSize={{ base: "sm", sm: "md" }}
            _focus={{ boxShadow: "none" }}
            _hover={{ background: "#FFBF00" }}
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
            color="gray.800"
            fontWeight="bold"
            borderRadius="xl"
            background="#FFBF00"
            _focus={{ boxShadow: "none" }}
            _hover={{ background: "#FFBF00" }}
            onClick={() => {
              setModalOperation("unstake");
              setSelectedCrucible(crucible["id"]);
              setSelectedRewards(rewards);
              setModalIsOpen(true);
            }}
          >
            Unstake & Claim Rewards
          </Button>
        </HStack>
        <HStack mt={4}>
          <Button
            isFullWidth
            color="gray.800"
            fontWeight="bold"
            borderRadius="xl"
            background="#FFBF00"
            fontSize={{ base: "sm", sm: "md" }}
            _focus={{ boxShadow: "none" }}
            _hover={{ background: "#FFBF00" }}
            onClick={() => {
              setModalOperation("withdraw");
              setSelectedCrucible(crucible["id"]);
              setModalIsOpen(true);
            }}
          >
            Withdraw Unstaked
          </Button>
          <Button
            isFullWidth
            color="gray.800"
            fontWeight="bold"
            borderRadius="xl"
            background="#FFBF00"
            fontSize={{ base: "sm", sm: "md" }}
            _focus={{ boxShadow: "none" }}
            _hover={{ background: "#FFBF00" }}
            onClick={() => {
              setModalOperation("send");
              setSelectedCrucible(crucible["id"]);
              setModalIsOpen(true);
            }}
          >
            Transfer Crucible
          </Button>
        </HStack>
      </LightMode>
    </Box>
  );
};

export default CrucibleCard;
