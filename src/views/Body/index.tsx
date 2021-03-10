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
      <Heading size="lg" mb={2}>
        Alchemist
      </Heading>
      <Text fontSize="lg" color="gray.500" mb={16}>
        The only plan is there is no plan{" "}
        <span role="img" aria-label="alchemist logo">
          ⚗️
        </span>
      </Text>
      <CSSTransition in={inProp} timeout={1000} classNames="fade">
        <Widget />
      </CSSTransition>
    </Box>
  );
};

export default Body;
