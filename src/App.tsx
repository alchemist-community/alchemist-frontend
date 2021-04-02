import React from "react";
import Layout from "./layouts";
import { Web3Provider } from "./context/web3";
import { ChakraProvider } from "@chakra-ui/react";
import { GlobalStyles } from "./styles/global-styles";
import { Global } from "@emotion/react";
import theme from "./config/theme";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2",
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="wrapper">
        <ChakraProvider theme={theme}>
          <Web3Provider>
            <Global styles={GlobalStyles} />
            <Layout />
          </Web3Provider>
        </ChakraProvider>
      </div>
    </ApolloProvider>
  );
}

export default App;
