import React from "react";
import Layout from "./layouts";
import { Web3Provider } from "./Web3Context";
import { ChakraProvider } from "@chakra-ui/react";
import { Global, css } from '@emotion/react'
import theme from "./config/theme";

const GlobalStyles = css`
  /*
    This will hide the focus indicator if the element receives focus via the mouse,
    but it will still show up on keyboard focus.
  */
  .js-focus-visible :focus:not([data-focus-visible-added]) {
     outline: none;
     box-shadow: none;
   }
`;

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
