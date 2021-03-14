import React, { Dispatch, SetStateAction, useState } from "react";
import { decimalCount } from "../../../utils";
import { Button, ButtonGroup } from "@chakra-ui/button";
import { Badge, Box, Flex, HStack, Text } from "@chakra-ui/layout";
import { FaLock } from "react-icons/fa";
import { Tooltip } from "@chakra-ui/tooltip";
import { useColorModeValue } from "@chakra-ui/color-mode";

interface CrucibleCardProps {
  crucible: {
    id: string;
    balance: string;
    lockedBalance: string;
  };
  setModalOperation: Dispatch<SetStateAction<"withdraw" | "unstake" | "send" | "increaseStake">>;
  setSelectedCrucible: (crucible: any) => void;
  setModalIsOpen: (open: boolean) => void;
}
const CrucibleCard: React.FC<CrucibleCardProps> = (props) => {
  const { crucible, setModalOperation, setSelectedCrucible, setModalIsOpen } = props;
  const cruciblesCardBg = useColorModeValue("white", "gray.600");
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

  const isBalanceTrunc = decimalCount(crucible?.balance) > 3;
  const isLockTrunc = decimalCount(crucible?.lockedBalance) > 3;

  return (
    <Box
      key={crucible.id}
      p={4}
      mb={6}
      bg={cruciblesCardBg}
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
                  <strong>Balance: </strong>
                  {!expandBalance ? (
                    <>
                      {`${parseFloat(Number(crucible?.balance).toFixed(3))}`}
                      {isBalanceTrunc && "..."}
                    </>
                  ) : (
                    crucible?.balance
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
                          {parseFloat(Number(crucible?.lockedBalance).toFixed(3))}
                          {isLockTrunc && "..."}
                        </>
                      ) : (
                        crucible?.lockedBalance
                      )}
                    </Box>
                    <FaLock />
                  </HStack>
                </Badge>
              </Tooltip>
            </Flex>
            <Flex fontSize="sm" color="gray.400" textAlign="left" verticalAlign="top" marginTop="8px">
              <label style={{ alignSelf: "flex-start" }}>ID: </label>
              <span style={{ wordWrap: "break-word", width: "100%", paddingLeft: "4px", paddingRight: "16px" }}>
                {crucible["id"]}
              </span>
            </Flex>
          </Flex>
        </Text>
      </Box>
      <ButtonGroup isAttached variant="outline" mb={[4, 4, 0]} width="100%">
        {/*
              <Button
                isFullWidth
                color="white"
                borderWidth={1}
                borderColor={cruciblesCardBg}
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
                Increase stake
              </Button>
              */}
        <Button
          isFullWidth
          color="white"
          borderWidth={1}
          borderColor={cruciblesCardBg}
          background="brand.400"
          _focus={{ boxShadow: "none" }}
          _hover={{ background: "brand.400" }}
          onClick={() => {
            setModalOperation("unstake");
            setSelectedCrucible(crucible["id"]);
            setModalIsOpen(true);
          }}
        >
          Unstake
        </Button>
        <Button
          isFullWidth
          color="white"
          borderWidth={1}
          borderColor={cruciblesCardBg}
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
          Withdraw
        </Button>
        <Button
          isFullWidth
          color="white"
          borderWidth={1}
          borderColor={cruciblesCardBg}
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
          Send
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default CrucibleCard;
