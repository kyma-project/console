const domain = location.hostname.replace(/^console(-dev)?\./, '');
const isLocalDev = location.hostname.startsWith('console-dev');

export const getClusterConfig = () => ({
  domain,
  graphqlApiUrl: `https://console-backend.${domain}/graphql`,
  subscriptionsApiUrl: `wss://console-backend.${domain}/graphql`,
  pamelaApiUrl: isLocalDev
    ? 'http://localhost:3001'
    : `${location.protocol}//${location.host}/backend`,
});
