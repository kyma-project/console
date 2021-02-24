const domain = location.hostname.replace(/^console(-dev)?\./, '');

const config = {
  graphqlApiUrl: `https://console-backend.${domain}/graphql`,
  subscriptionsApiUrl: `wss://console-backend.${domain}/graphql`,
};

export const AppConfig = { ...config } as any;
