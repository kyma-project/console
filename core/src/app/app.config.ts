import { environment } from '../environments/environment';
interface StringMap {
  [s: string]: string;
}

declare const INJECTED_CLUSTER_CONFIG: StringMap; // injected by webpack
const windowClusterConfig = (window as any).clusterConfig;
const clusterConfig = Object.keys(windowClusterConfig || {}).length ? windowClusterConfig : undefined;
const configToRead: StringMap = clusterConfig || (typeof INJECTED_CLUSTER_CONFIG !== 'undefined' ? INJECTED_CLUSTER_CONFIG : { domain: 'kyma.local' }); // fallback for tests

const domain = configToRead.domain;
const gateway_kyma_cx_api_version = configToRead.gateway_kyma_cx_api_version || configToRead.gateway_kyma_project_io_version;
const k8sServerUrl = `https://apiserver.${domain}`;

const config = {
  authIssuer: `https://dex.${domain}`,
  k8sServerUrl,
  k8sApiServerUrl: `${k8sServerUrl}/api/v1/`,
  k8sApiServerUrl_apimanagement: `${k8sServerUrl}/apis/gateway.kyma-project.io/${gateway_kyma_cx_api_version}/`,
  k8sApiServerUrl_apps: `${k8sServerUrl}/apis/apps/v1/`,
  k8sApiServerUrl_applications: `${k8sServerUrl}/apis/applicationconnector.kyma-project.io/v1alpha1/applications/`,
  k8sApiServerUrl_servicecatalog: `${k8sServerUrl}/apis/servicecatalog.k8s.io/v1beta1/`,
  k8sApiServerUrl_rbac: `${k8sServerUrl}/apis/rbac.authorization.k8s.io/v1/`,
  subscriptionsApiUrl: `wss://console-backend.${domain}/graphql`,
  gateway_kyma_cx_api_version,

  headerTitle: '',
  headerLogoUrl: '',
  faviconUrl: 'favicon.ico',
  kubeconfigGeneratorUrl: `https://configurations-generator.${domain}/kube-config`,
  idpLogoutUrl: null,
  dexFQDNUri: 'http://dex-service.kyma-system.svc.cluster.local:5556/keys',
  ...configToRead,
  graphqlApiUrl: environment.localApi ? configToRead.graphqlApiUrlLocal : configToRead.graphqlApiUrl
};

export const AppConfig = { ...config } as any;
