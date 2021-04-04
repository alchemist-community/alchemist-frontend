import App from "./App";
import React from "react";
import ReactDOM from "react-dom";
import theme from "./config/theme";
import * as serviceWorker from "./serviceWorker";
import { ColorModeScript } from "@chakra-ui/color-mode";

import "../src/styles/transitions.css";
import "focus-visible/dist/focus-visible";

// This app previously supported multiple color modes,
// we need to override the color mode in local storage
localStorage.setItem("chakra-ui-color-mode", "dark");

ReactDOM.render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
