import React from 'react';
import UserWallet from '../UserWallet';
import UserAddress from '../UserAddress';
import LOGO_LIGHT from '../../img/logo_light.png';
import LOGO_DARK from '../../img/logo_dark.png';
import Web3Context from '../../Web3Context';
import { Image } from '@chakra-ui/image';
import { IconButton } from '@chakra-ui/button';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useColorMode, useColorModeValue } from '@chakra-ui/color-mode';
import { Box, Flex, LinkBox, LinkOverlay } from '@chakra-ui/layout';
import { Wallet } from '@ethersproject/wallet';

const Header: React.FC = () => {
  const { wallet, address } = React.useContext(Web3Context);
  const { colorMode, toggleColorMode } = useColorMode();

  const isDarkMode = colorMode === 'dark';
  const buttonHoverBgColor = useColorModeValue('gray.100', 'gray.700');
  const logo = useColorModeValue(LOGO_LIGHT, LOGO_DARK);

  return (
    <>
      <Flex justifyContent='space-between' alignItems='center' py={4}>
        {/* Hardcoded 283 for now to center user wallet component */}
        <LinkBox width={['auto', 'auto', 283]}>
          <LinkOverlay href='/'>
            <Image src={logo} width={['50px', '50px', '60px']} alt='alchemist logo' />
          </LinkOverlay>
        </LinkBox>
        <Box display={['none', 'none', 'none', 'block']}>{address && <UserWallet />}</Box>
        <Flex>
          <IconButton
            mr={2}
            borderRadius='lg'
            variant='ghost'
            onClick={toggleColorMode}
            icon={isDarkMode ? <FiMoon /> : <FiSun />}
            aria-label={isDarkMode ? 'Toggle light mode' : 'Toggle dark mode'}
            _hover={{ background: buttonHoverBgColor }}
          />
          <UserAddress />
        </Flex>
      </Flex>
    </>
  );
};

export default Header;
