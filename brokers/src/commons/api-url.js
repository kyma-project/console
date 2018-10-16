export function getURL(endpoint) {
  let config = {
    graphqlApiUrl: 'http://localhost:3000/graphql',
  };
  const clusterConfig = window['clusterConfig'];
  config = { ...config, ...clusterConfig };
  return config[endpoint];
}
