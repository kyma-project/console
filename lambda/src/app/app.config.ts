import { environment } from '../environments/environment';

const defaultDomain = 'kyma.local';
let domain = defaultDomain;
const clusterConfig: object = window['clusterConfig'];
if (clusterConfig && clusterConfig['domain']) {
  domain = clusterConfig['domain'];
}

const k8sServerUrl = `https://apiserver.${domain}`;

const config = {
  authIssuer: `https://dex.${domain}`,
  k8sServerUrl,
  kubelessApiUrl: `${k8sServerUrl}/apis/kubeless.io/v1beta1`,
  k8sApiUrl: `${k8sServerUrl}/apis/apps/v1`,
  k8sApiServerUrl: `${k8sServerUrl}/api/v1`,
  apisApiUrl: `${k8sServerUrl}/apis/gateway.kyma.cx/v1alpha2`,
  serviceBindingUsageUrl: `${k8sServerUrl}/apis/servicecatalog.kyma.cx/v1alpha1`,
  serviceCatalogApiUrl: `${k8sServerUrl}/apis/servicecatalog.k8s.io/v1beta1`,
  subscriptionApiUrl: `${k8sServerUrl}/apis/eventing.kyma.cx/v1alpha1`,
  graphqlApiUrl: `https://ui-api.${domain}/graphql`,
  domain,
};

if (clusterConfig) {
  config.graphqlApiUrl = environment.localApi
    ? clusterConfig['graphqlApiUrlLocal']
    : clusterConfig['graphqlApiUrl'];
}

export const AppConfig = { ...config };
