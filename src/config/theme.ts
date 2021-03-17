import { extendTheme, ThemeConfig, theme } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const customTheme = extendTheme({
  config,
  colors: {
    brand: {
      50: "#EDFDFD",
      100: "#C4F1F9",
      200: "#9DECF9",
      300: "#76E4F7",
      400: "#0BC5EA",
      500: "#00B5D8",
      600: "#00A3C4",
      700: "#0987A0",
      800: "#086F83",
      900: "#065666",
    },
  },
  fonts: {
    heading: "Poppins",
    body: "Poppins",
  },
  components: {
    Heading: {
      baseStyle: {
        fontWeight: "500",
      },
    },
    Link: {
      baseStyle: {
        _hover: {
          textDecoration: "none",
          color: "brand.400",
        },
      },
    },
    Alert: {
      baseStyle: {
        borderRadius: theme.radii["2xl"],
      },
    },
    Input: {
      baseStyle: {
        _focus: {
          borderColor: "brand.400",
          borderWidth: "2px",
        },
      },
    },
    Button: {
      baseStyle: {
        fontWeight: "500",
      },
    },
  },
});

export default customTheme;
