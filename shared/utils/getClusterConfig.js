const domain = location.hostname.replace(/^console(-dev)?\./, '');
const isLocalDev = location.hostname.startsWith('console-dev');

export const getClusterConfig = () => ({
  domain,
  graphqlApiUrl: `https://console-backend.${domain}/graphql`,
  subscriptionsApiUrl: `wss://console-backend.${domain}/graphql`,
  pamelaApiUrl: 'http://localhost:3001/backend',
});
