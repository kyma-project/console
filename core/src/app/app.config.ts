import { environment } from '../environments/environment';

const clusterConfig = (window as any).clusterConfig || { domain: 'kyma.local' };

const domain = clusterConfig.domain;
const gateway_kyma_project_io_version = clusterConfig.gateway_kyma_project_io_version;
const k8sServerUrl = `https://apiserver.${domain}`;

const config = {
  authIssuer: `https://dex.${domain}`,
  k8sApiServerUrl: `${k8sServerUrl}/api/v1/`,
  k8sApiServerUrl_apimanagement: `${k8sServerUrl}/apis/gateway.kyma-project.io/${gateway_kyma_project_io_version}/`,
  k8sApiServerUrl_apps: `${k8sServerUrl}/apis/apps/v1/`,
  k8sApiServerUrl_applications: `${k8sServerUrl}/apis/applicationconnector.kyma-project.io/v1alpha1/applications/`,
  k8sApiServerUrl_servicecatalog: `${k8sServerUrl}/apis/servicecatalog.k8s.io/v1beta1/`,
  k8sApiServerUrl_rbac: `${k8sServerUrl}/apis/rbac.authorization.k8s.io/v1/`,
  subscriptionsApiUrl: `wss://console-backend.${domain}/graphql`,

  headerTitle: '',
  headerLogoUrl: '',
  faviconUrl: 'favicon.ico',
  kubeconfigGeneratorUrl: `https://configurations-generator.${domain}/kube-config`,
  idpLogoutUrl: null,
  dexFQDNUri: 'http://dex-service.kyma-system.svc.cluster.local:5556/keys',
  ...clusterConfig,
  graphqlApiUrl: environment.localApi ? clusterConfig.graphqlApiUrlLocal : clusterConfig.graphqlApiUrl
};

export const AppConfig = { ...config } as any;
