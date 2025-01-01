import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import client from "./apollo/client";
import { ApolloProvider } from "@apollo/client";
import "./index.css";

// Get the root element
const rootElement = document.getElementById("root");
if (rootElement) {
  const root = createRoot(rootElement);

  root.render(
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
  );
}
