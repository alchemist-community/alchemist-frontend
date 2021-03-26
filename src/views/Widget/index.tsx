import React from "react";
import { Box, Center } from "@chakra-ui/layout";
import { SwapPane, OperatePane } from "./TabContent/Panes";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/tabs";

interface WidgetProps {}

const Widget: React.FC<WidgetProps> = () => {
  return (
    <Center>
      <Box
        shadow="xl"
        borderRadius="2xl"
        bg="gray.800"
        borderWidth={1}
        width={["100%", 540, 540]}
      >
        <Tabs isFitted>
          <TabList
            height="70px"
            bg="gray.800"
            borderTopLeftRadius="2xl"
            borderTopRightRadius="2xl"
          >
            <Tab
              fontSize="xl"
              fontWeight={500}
              _selected={{
                color: "inherit",
                borderColor: "brand.400",
                borderBottomWidth: 3,
              }}
            >
              Crucibles
            </Tab>
            <Tab
              fontSize="xl"
              fontWeight={500}
              _selected={{
                color: "inherit",
                borderColor: "brand.400",
                borderBottomWidth: 3,
              }}
            >
              Mint
            </Tab>
          </TabList>

          <TabPanels p={4} overflowY="auto" maxH="480px">
            <TabPanel>
              <OperatePane />
            </TabPanel>
            <TabPanel>
              <SwapPane />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Center>
  );
};

export default Widget;
