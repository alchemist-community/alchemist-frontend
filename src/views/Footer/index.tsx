import { IconButton } from "@chakra-ui/button";
import { Center, HStack, Link } from "@chakra-ui/layout";
import React from "react";
import {
  FaDiscord,
  FaGithub,
  FaQuestionCircle,
  FaVoteYea,
} from "react-icons/fa";

const links = [
  {
    label: "Discord",
    icon: <FaDiscord />,
    href: "http://discord.alchemist.wtf",
    isExternal: true,
  },
  {
    label: "Code",
    icon: <FaGithub />,
    href: "https://github.com/alchemist-community/alchemist-frontend",
    isExternal: true,
  },
  {
    label: "FAQ",
    icon: <FaQuestionCircle />,
    href: "https://hackmd.io/@thegostep/BJ40PSVQd",
    isExternal: true,
  },
  {
    label: "Governance",
    icon: <FaVoteYea />,
    href: "https://cast.alchemist.wtf",
    isExternal: true,
  },
];

const Footer: React.FC = () => {
  return (
    <Center py={12}>
      <HStack spacing={4}>
        {links.map(({ href, isExternal, label, icon }) => (
          <Link
            py={1}
            key={label}
            href={href}
            fontSize="sm"
            isExternal={isExternal}
            rel="noopener noreferrer"
            _hover={{
              color: "white",
            }}
          >
            <IconButton
              size="lg"
              isRound
              fontSize="2xl"
              aria-label={label}
              icon={icon}
              _hover={{
                color: "gray.800",
                background: "#FFBF00",
                boxShadow: "4px 4px 4px solid yellow",
              }}
            />
          </Link>
        ))}
      </HStack>
    </Center>
  );
};

export default Footer;
