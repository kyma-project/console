import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { COMPASS_GRAPHQL_ENDPOINT } from './config/config';
import builder from './commons/builder';
import { BrowserRouter } from 'react-router-dom';

console.log(builder.getTenant())
const client = new ApolloClient({
  uri: COMPASS_GRAPHQL_ENDPOINT,
  // headers: {
  //   tenant: builder.getTenant()
  // }
});

(async () => {
  await builder.init();
  ReactDOM.render(
    <BrowserRouter>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </BrowserRouter>,
    document.getElementById('root'),
  );

  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: https://bit.ly/CRA-PWA
  serviceWorker.unregister();
})();
