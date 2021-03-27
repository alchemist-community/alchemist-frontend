import React, { useContext, useEffect, useState } from "react";
import { Box, Center, Flex, Grid, Heading } from "@chakra-ui/layout";
import { HiCheckCircle } from "react-icons/hi";
import { SwapPane, OperatePane } from "./TabContent/Panes";
import Web3Context from "../../context/web3";
import ConnectWallet from "./Steps/ConnectWallet";

interface WidgetProps {}

type Steps = {
  label: string;
  isActive: boolean;
  isComplete: boolean;
  component: any;
}[];

const initSteps: Steps = [
  {
    label: "connect wallet",
    isActive: false,
    isComplete: false,
    component: <ConnectWallet />,
  },
  {
    label: "mint crucible",
    isActive: true,
    isComplete: false,
    component: <SwapPane />,
  },
  {
    label: "stake crucible",
    isActive: false,
    isComplete: false,
    component: <OperatePane />,
  },
];

const Widget: React.FC<WidgetProps> = () => {
  const { wallet } = useContext(Web3Context);
  const [steps, setSteps] = useState(initSteps);

  const isConnected = !!wallet.provider;

  useEffect(() => {
    if (wallet.provider) {
      const stepsClone = [...steps];
      stepsClone[0].isComplete = true;
      setSteps(stepsClone);
    } else {
      const stepsClone = [...steps];
      const updatedSteps = stepsClone.map((step) => ({
        ...step,
        isActive: false,
      }));
      updatedSteps[0].isComplete = false;
      updatedSteps[0].isActive = true;
      setSteps(updatedSteps);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet]);

  const getTemplateColumns = () => {
    return steps
      .map((step) =>
        step.isActive ? "600px" : step.isComplete ? "80px" : "1fr"
      )
      .join(" ");
  };

  const handleStepUpdate = (index: number) => {
    if (!isConnected) {
      return null;
    }
    const updatedSteps = steps.map((step, stepIndex) => ({
      ...step,
      isActive: stepIndex === index,
    }));
    setSteps(updatedSteps);
  };

  return (
    <Center>
      <Grid
        columns={3}
        gap={4}
        width={1200}
        templateColumns={getTemplateColumns()}
      >
        {steps.map(({ isActive, isComplete, component }, index) => (
          <Box
            height={440}
            borderRadius="3xl"
            overflow="hidden"
            onClick={() => handleStepUpdate(index)}
            bg={isComplete && !isActive ? "#35C932" : "gray.800"}
            transition="box-shadow 0.3s ease"
            _hover={{
              boxShadow: "2xl",
            }}
          >
            {isActive ? (
              component
            ) : isComplete ? (
              <Flex justifyContent="center" p={4}>
                <HiCheckCircle fontSize={32} />
              </Flex>
            ) : (
              <Flex justifyContent="center" alignItems="center" height="100%">
                <Heading color={isConnected ? "white" : "gray.700"}>
                  {index + 1}
                </Heading>
              </Flex>
            )}
          </Box>
        ))}
      </Grid>
    </Center>
  );
};

export default Widget;
