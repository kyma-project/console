import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import LuigiClient from '@kyma-project/luigi-client';
import ApolloClient from 'apollo-boost';
import { gql } from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

const client = new ApolloClient({
  uri: `https://compass-gateway.kyma.local/director/graphql`,
});

client
  .query({
    query: gql`
      query {
        runtimes(
          filter: [
            {
              label: "group"
              values: ["production", "experimental"]
              operator: ANY
            }
          ]
        ) {
          data {
            id
            name
            description
            tenant
            labels
            annotations
          }
        }
      }
    `,
    variables: {},
  })
  .then(result => console.log(result.data.runtimes.data));

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
