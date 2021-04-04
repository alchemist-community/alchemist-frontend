import { extendTheme, ThemeConfig, theme } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "dark",
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
    gray: {
      50: "#EFEFF6",
      100: "#D4D2E5",
      200: "#B8B5D4",
      300: "#9C98C3",
      400: "#807BB2",
      500: "#645EA1",
      600: "#504B81",
      700: "#3C3960",
      800: "#24223A",
      900: "#141320",
    },
  },
  fonts: {
    heading: "Poppins",
    body: "Poppins",
  },
  components: {
    Heading: {
      baseStyle: {
        fontWeight: "700",
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
