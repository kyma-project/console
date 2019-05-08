import { environment } from '../environments/environment';

let domain = 'kyma.local';
let gateway_kyma_project_io_version = 'v1alpha2';
let idpLogoutUrl = null;

const clusterConfig: object = window['clusterConfig'];
if (clusterConfig) {
  if (clusterConfig['domain']) {
    domain = clusterConfig['domain'];
  }
  if (clusterConfig['gateway_kyma_project_io_version']) {
    gateway_kyma_project_io_version =
      clusterConfig['gateway_kyma_project_io_version'];
  }
  idpLogoutUrl = clusterConfig['idpLogoutUrl']
    ? clusterConfig['idpLogoutUrl']
    : null;
}

const k8sServerUrl = `https://apiserver.${domain}`;

const config = {
  authIssuer: `https://dex.${domain}`,
  authRedirectUri: 'http://console-dev.kyma.local:4200',
  consoleClientId: 'console',
  domain,
  graphqlApiUrl: `https://console-backend.${domain}/graphql`,
  subscriptionsApiUrl: `wss://console-backend.${domain}/graphql`,
  k8sApiServerUrl: `${k8sServerUrl}/api/v1/`,
  gateway_kyma_project_io_version,
  k8sApiServerUrl_apimanagement: `${k8sServerUrl}/apis/gateway.kyma-project.io/${gateway_kyma_project_io_version}/`,
  k8sApiServerUrl_apps: `${k8sServerUrl}/apis/apps/v1/`,
  k8sApiServerUrl_applications: `${k8sServerUrl}/apis/applicationconnector.kyma-project.io/v1alpha1/applications/`,
  k8sApiServerUrl_servicecatalog: `${k8sServerUrl}/apis/servicecatalog.k8s.io/v1beta1/`,
  k8sApiServerUrl_rbac: `${k8sServerUrl}/apis/rbac.authorization.k8s.io/v1/`,
  k8sServerUrl,
  lambdasModuleUrl: `https://lambdas-ui.${domain}`,
  orgId: 'my-org-123',
  orgName: 'My Organization',
  headerTitle: '',
  headerLogoUrl: '',
  faviconUrl: 'favicon.ico',
  scope:
    'audience:server:client_id:kyma-client audience:server:client_id:console openid profile email groups',
  serviceCatalogModuleUrl: `https://catalog.${domain}`,
  serviceInstancesModuleUrl: `https://instances.${domain}`,
  serviceBrokersModuleUrl: `https://brokers.${domain}`,
  docsModuleUrl: `https://docs.${domain}`,
  addOnsConfigurationModuleUrl: `https://add-ons.${domain}`,
  logsModuleUrl: `https://log-ui.${domain}`,
  kubeconfigGeneratorUrl: `https://configurations-generator.${domain}/kube-config`,
  idpLogoutUrl,
  dexFQDNUri : 'http://dex-service.kyma-system.svc.cluster.local:5556/keys'
};

// Overwriting values from injected configuration (k8s configMap -> assets/config/config.js)
if (clusterConfig) {
  for (const propertyName in config) {
    if (clusterConfig.hasOwnProperty(propertyName)) {
      config[propertyName] = clusterConfig[propertyName];
    }
  }
}

if (
  clusterConfig &&
  (clusterConfig['graphqlApiUrlLocal'] || clusterConfig['graphqlApiUrl'])
) {
  config.graphqlApiUrl = environment.localApi
    ? clusterConfig['graphqlApiUrlLocal']
    : clusterConfig['graphqlApiUrl'];
}

export const AppConfig = { ...config };
