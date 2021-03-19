import Widget from "../Widget";
import React, { useEffect, useState } from "react";
import { Box, Heading, Text } from "@chakra-ui/layout";
import { CSSTransition } from "react-transition-group";

const Body: React.FC = () => {
  const [inProp, setInProp] = useState(false);

  useEffect(() => {
    setInProp(true);
  }, []);

  return (
    <Box textAlign="center" mt={[8, 16, 24]}>
      <Text fontSize="2xl" mb={2}>
        alchemist
      </Text>
      <Heading size="2xl" mb={16}>
        Mint a crucible
      </Heading>
      <CSSTransition in={inProp} timeout={1000} classNames="slideUp">
        <Widget />
      </CSSTransition>
    </Box>
  );
};

export default Body;
