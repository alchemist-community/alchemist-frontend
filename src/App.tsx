import React from "react";
import Layout from "./layouts";
import { Web3Provider } from "./context/web3";
import { ChakraProvider } from "@chakra-ui/react";
import { GlobalStyles } from "./styles/global-styles";
import { Global } from "@emotion/react";
import theme from "./config/theme";

function App() {
  return (
    <div className="wrapper">
      <ChakraProvider theme={theme}>
        <Web3Provider>
          <Global styles={GlobalStyles} />
          <Layout />
        </Web3Provider>
      </ChakraProvider>
    </div>
  );
}

export default App;
