import React, { useContext, useState, useEffect } from "react";
import Web3Context from "../../context/web3";
import { toMaxDecimalsRound } from "../Widget/utils";
import { Spinner } from "@chakra-ui/react";
import { CSSTransition } from "react-transition-group";
import { Badge, Box, HStack, Text } from "@chakra-ui/layout";

export default function UserAddress() {
  const [inProp, setInProp] = useState(false);
  const { provider, tokenBalances } = useContext(Web3Context);

  useEffect(() => {
    setInProp(true);
  }, []);

  return (
    <CSSTransition in={inProp} timeout={1000} classNames="slideDown">
      {provider ? (
        <Box
          py={2}
          px={2}
          borderRadius="lg"
          bg="gray.800"
          shadow="xl"
          borderWidth={1}
          borderColor="cyan.500"
        >
          <HStack>
            <Text color="gray.300">My wallet:</Text>
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
