import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "react-apollo";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App";
import builder from "./commons/builder";

import { createApolloClient } from "./store";
const client = createApolloClient();

(async () => {
  await builder.init();
  ReactDOM.render(
    <BrowserRouter>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </BrowserRouter>,
    document.getElementById("root")
  );
})();
