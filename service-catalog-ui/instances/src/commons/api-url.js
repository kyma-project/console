import builder from './builder';

const CURRENT_ENV_TAG = '{CURRENT_ENV}';

export function getURL(endpoint) {
  let config = {
    catalogUrl: 'http://localhost:8000',
    graphqlApiUrl: 'http://localhost:3000/graphql',
    subscriptionsApiUrl: 'ws://localhost:3000/graphql',
  };
  const clusterConfig = window['clusterConfig'];
  config = { ...config, ...clusterConfig };
  return config[endpoint];
}

export function openLink(path) {
  if (process.env.REACT_APP_ENV !== 'production') {
    window.location.replace(path);
  }

  const redirectPath = path.replace(
    CURRENT_ENV_TAG,
    builder.getCurrentEnvironmentId(),
  );
  window.parent.postMessage(
    {
      msg: 'navigation.open',
      params: {
        link: redirectPath,
      },
    },
    '*',
  );
}
