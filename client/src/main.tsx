import { createRoot } from "react-dom/client";
import App from "./App";
import client from "./apollo/client";
import { ApolloProvider } from "@apollo/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import routerConfig from './react-router.config'
// Get the root element
const rootElement = document.getElementById("root");
if (rootElement) {
  const root = createRoot(rootElement);

  root.render(
    <BrowserRouter {...(routerConfig)}>
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
    </BrowserRouter>
  );
}
