// import React from 'react';
// import ReactDOM from 'react-dom';
// import { ApolloProvider } from 'react-apollo';

// import App from './App';
// import builder from './store/builder';

// import { createApolloClient } from './store/index';
// const client = createApolloClient();

// (async () => {
//   await builder.init();
//   ReactDOM.render(
//     <ApolloProvider client={client}>
//       <App />
//     </ApolloProvider>,
//     document.getElementById('root'),
//   );
// })();

import React from 'react';
import { bootstrap, BackendModules } from '@kyma-project/common';

import App from './App';

(async () => {
  await bootstrap({
    app: (
      <>
        <App />
      </>
    ),
    requiredBackendModules: [BackendModules.GRAFANA],
    enableNotifications: false,
    enableSubscriptions: false,
  });
})();
