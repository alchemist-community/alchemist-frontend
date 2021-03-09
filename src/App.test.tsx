import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

test("renders widget & footer", () => {
  const { getByText, getAllByText } = render(<App />);
  const footerElement = getByText(/Code/i);
  expect(footerElement).toBeInTheDocument();
  const widgetElement = getAllByText(/Mint/i)[0];
  expect(widgetElement).toBeInTheDocument();
});
