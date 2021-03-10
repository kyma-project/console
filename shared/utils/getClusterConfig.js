const domain = location.hostname.replace(/^console(-dev)?\./, '');
const isNpx = location.origin === 'http://localhost:3001';
const isLocalDev = location.hostname.startsWith('console-dev');

function createPamelaApiUrl() {
  switch (true) {
    case isNpx:
      return 'http://localhost:3001/backend';
    case isLocalDev:
      return 'http://localhost:3001';
    default:
      return 'https://' + domain + '/backend';
  }
}

export const getClusterConfig = () => ({
  domain,
  graphqlApiUrl: `https://console-backend.${domain}/graphql`,
  subscriptionsApiUrl: `wss://console-backend.${domain}/graphql`,
  pamelaApiUrl: createPamelaApiUrl(),
});
