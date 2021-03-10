import React from "react";
import { Box, Center } from "@chakra-ui/layout";
import { SwapPane, OperatePane } from "./TabContent/Panes";
import { useColorModeValue } from "@chakra-ui/color-mode";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/tabs";

interface WidgetProps {}

const Widget: React.FC<WidgetProps> = () => {
  const cardBgColor = useColorModeValue("white", "gray.700");
  const tabsBgColor = useColorModeValue("gray.50", "gray.600");

  return (
    <Center>
      <Box
        shadow="xl"
        borderRadius="2xl"
        bg={cardBgColor}
        borderWidth={1}
        width={["100%", 540, 540]}
      >
        <Tabs isFitted>
          <TabList
            px={8}
            height="70px"
            bg={tabsBgColor}
            borderTopLeftRadius="2xl"
            borderTopRightRadius="2xl"
          >
            <Tab
              fontSize="xl"
              fontWeight={500}
              _selected={{
                color: "inherit",
                borderColor: "green.300",
                borderBottomWidth: 3,
              }}
            >
              Mint
            </Tab>
            <Tab
              fontSize="xl"
              fontWeight={500}
              _selected={{
                color: "inherit",
                borderColor: "green.300",
                borderBottomWidth: 3,
              }}
            >
              Crucibles
            </Tab>
          </TabList>

          <TabPanels p={4} overflowY="auto" maxH="480px">
            <TabPanel>
              <SwapPane />
            </TabPanel>
            <TabPanel>
              <OperatePane />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Center>
  );
};

export default Widget;
