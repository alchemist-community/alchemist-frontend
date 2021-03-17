import React, { useContext, useState, useEffect } from "react";
import Web3Context from "../../Web3Context";
import { getTokenBalances } from "../../contracts/getTokenBalances";
import { toMaxDecimalsRound } from "../Widget/utils";
import { Spinner, useColorModeValue } from "@chakra-ui/react";
import { CSSTransition } from "react-transition-group";
import { Badge, Box, HStack, Text } from "@chakra-ui/layout";

export default function UserAddress() {
  const [inProp, setInProp] = useState(false);
  const { signer, provider, tokenBalances } = useContext(Web3Context);

  useEffect(() => {
    setInProp(true);
  }, []);

  const userWalletBgColor = useColorModeValue("white", "gray.600");
  const userWalletTextColor = useColorModeValue("gray.500", "gray.400");

  return (
    <CSSTransition in={inProp} timeout={1000} classNames="slideDown">
      {provider ? (
        <Box py={2} px={2} borderRadius="lg" bg={userWalletBgColor} shadow="xl">
          <HStack>
            <Text color={userWalletTextColor}>My wallet:</Text>
            {!tokenBalances && <Spinner />}
            {tokenBalances && (
              <Badge px={2} py={1} borderRadius="md" boxShadow="sm">
                Alchemist: {toMaxDecimalsRound(tokenBalances.cleanMist, 0.01)}{" "}
                ⚗️
              </Badge>
            )}
            {tokenBalances && (
              <Badge px={2} py={1} borderRadius="md" boxShadow="sm">
                LP: {toMaxDecimalsRound(tokenBalances.cleanLp, 0.01)} ⚗️
              </Badge>
            )}
          </HStack>
        </Box>
      ) : (
        <></>
      )}
    </CSSTransition>
  );
}
