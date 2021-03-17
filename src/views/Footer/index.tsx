import { Box, Flex, HStack, Link, Text } from "@chakra-ui/layout";
import React from "react";

const links = [
  {
    label: "Code",
    href: "https://github.com/alchemist-community/alchemist-frontend",
    isExternal: true,
  },
  {
    label: "Discord",
    href: "http://discord.alchemist.wtf",
    isExternal: true,
  },
  {
    label: "FAQ",
    href: "https://hackmd.io/@thegostep/BJ40PSVQd",
    isExternal: true,
  },
  {
    label: "Governance",
    href: "https://cast.alchemist.wtf",
    isExternal: true,
  },
];

const Footer: React.FC = () => {
  return (
    <Box as="footer">
      <Flex
        py={8}
        flexDirection={["column", "column", "row"]}
        justifyContent="space-between"
        alignItems="center"
        as="footer"
      >
        <Box textAlign={["center", "center", "initial"]}>
          <Text fontWeight="bold" fontSize="md">
            alchemist.farm
          </Text>
          <Text fontSize="sm" color="gray.200">
            Searching for the philosopher's stone
          </Text>
        </Box>
        <Box>
          <HStack spacing={4}>
            {links.map(({ href, isExternal, label }) => (
              <Link
                py={1}
                key={label}
                href={href}
                fontSize="sm"
                isExternal={isExternal}
                rel="noopener noreferrer"
                _hover={{
                  color: "brand.400",
                  borderBottomColor: "brand.400",
                  borderBottomWidth: 1,
                }}
              >
                {label}
              </Link>
            ))}
          </HStack>
        </Box>
      </Flex>
    </Box>
  );
};

export default Footer;
