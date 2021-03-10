import { Box, Heading, Text } from "@chakra-ui/layout";
import React from "react";
import Widget from "../Widget";

const Body: React.FC = () => {
  return (
    <Box textAlign="center" mt={[8, 16, 24]}>
      <Heading size="lg" mb={2}>Alchemist</Heading>
      <Text fontSize="lg" color="gray.500" mb={16}>
        The only plan is there is no plan{" "}
        <span role="img" aria-label="alchemist logo">
          ⚗️
        </span>
      </Text>
      <Widget />
    </Box>
  );
};

export default Body;
