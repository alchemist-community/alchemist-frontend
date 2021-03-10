import { extendTheme, ThemeConfig, theme } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const customTheme = extendTheme({
  config,
  colors: {
    green: {
      50: "#defef5",
      100: "#b8f3e5",
      200: "#91ebd3",
      300: "#67e1c1",
      400: "#40d9b0",
      500: "#26bf96",
      600: "#199575",
      700: "#0b6a53",
      800: "#004131",
      900: "#001710",
    },
  },
  fonts: {
    heading: "Work Sans",
    body: "Work Sans",
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
          color: "green.300",
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
          borderColor: "green.300",
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
