import { getApiUrl } from '@kyma-project/common';

const domain = getApiUrl('domain');

const config = {
  queryEndpoint: `https://loki.${domain}/api/prom/query`,
  labelEndpoint: `https://loki.${domain}/api/prom/label`,
  resourceLabels: resource =>
    `https://loki.${domain}/api/prom/label/${resource}/values`,

  // graphqlApiUrl: `https://console-backend.${domain}/graphql`,
  // subscriptionsApiUrl: `wss://console-backend.${domain}/graphql`,
};

export default { ...config };
