const domain = location.hostname.replace(/^console(-dev)?\./, '');

function getPamelaApiUrl() {
  if (location.origin === 'http://localhost:3001') {
    return 'http://localhost:3001/backend'; // npx
  } else if (
    location.hostname.startsWith('console-dev') ||
    location.hostname.startsWith('localhost')
  ) {
    // dev console
    return 'http://localhost:3001';
  } else {
    // on cluster
    return 'https://' + domain + '/backend';
  }
}

export const getClusterConfig = () => ({
  domain,
  graphqlApiUrl: `https://console-backend.${domain}/graphql`,
  subscriptionsApiUrl: `wss://console-backend.${domain}/graphql`,
  pamelaApiUrl: getPamelaApiUrl(),
});
