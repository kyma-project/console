import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App.container";
import * as serviceWorker from "./serviceWorker";
import { ApolloProvider } from "react-apollo";
import builder from "./commons/builder";
import { createApolloClient } from "./store";

(async () => {
  await builder.init();
  const client = createApolloClient();
  ReactDOM.render(
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>,
    document.getElementById("root")
  );

  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: https://bit.ly/CRA-PWA
  serviceWorker.unregister();
})();
