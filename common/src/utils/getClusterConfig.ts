const domain = location.hostname.replace(/^console(-dev)?\./, '');

export const getClusterConfig = () =>
  ({
    domain,
    graphqlApiUrl: `https://console-backend.${domain}/graphql`,
    subscriptionsApiUrl: `wss://console-backend.${domain}/graphql`,
  } as any);
