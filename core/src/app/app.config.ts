import { environment } from '../environments/environment';

let domain = 'kyma.local';
let gateway_kyma_cx_api_version = 'v1alpha2';
let idpLogoutUrl = null;

const clusterConfig: object = window['clusterConfig'];
if (clusterConfig) {
  if (clusterConfig['domain']) {
    domain = clusterConfig['domain'];
  }
  if (clusterConfig['gateway_kyma_cx_api_version']) {
    gateway_kyma_cx_api_version = clusterConfig['gateway_kyma_cx_api_version'];
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
  graphqlApiUrl: `https://ui-api.${domain}/graphql`,
  k8sApiServerUrl: `${k8sServerUrl}/api/v1/`,
  gateway_kyma_cx_api_version,
  k8sApiServerUrl_apimanagement: `${k8sServerUrl}/apis/gateway.kyma.cx/${gateway_kyma_cx_api_version}/`,
  k8sApiServerUrl_apps: `${k8sServerUrl}/apis/apps/v1beta1/`,
  k8sApiServerUrl_extensions: `${k8sServerUrl}/apis/extensions/v1beta1/`,
  k8sApiServerUrl_remoteenvs: `${k8sServerUrl}/apis/remoteenvironment.kyma.cx/v1alpha1/remoteenvironments/`,
  k8sDashboardApiUrl: `${k8sServerUrl}/api/v1/namespaces/kube-system/services/kubernetes-dashboard/proxy/api/v1/`,
  k8sApiServerUrl_servicecatalog: `${k8sServerUrl}/apis/servicecatalog.k8s.io/v1beta1/`,
  k8sApiServerUrl_ui: `${k8sServerUrl}/apis/ui.kyma.cx/v1alpha1/`,
  k8sApiServerUrl_rbac: `${k8sServerUrl}/apis/rbac.authorization.k8s.io/v1/`,
  k8sDashboardUrl: `${k8sServerUrl}/namespaces/kube-system/services/kubernetes-dashboard/proxy`,
  k8sServerUrl,
  lambdasModuleUrl: `https://lambdas-ui.${domain}`,
  orgId: 'my-org-123',
  orgName: 'My Organization',
  scope:
    'audience:server:client_id:kyma-client audience:server:client_id:console openid profile email groups',
  serviceCatalogModuleUrl: `https://catalog.${domain}`,
  serviceInstancesModuleUrl: `https://instances.${domain}`,
  docsModuleUrl: `https://docs.${domain}`,
  kubeconfigGeneratorUrl: `https://configurations-generator.${domain}/kube-config`,
  idpLogoutUrl
};

// Overwriting values from injected configuration (k8s configMap -> assets/config/config.js)
if (clusterConfig) {
  for (const propertyName in config) {
    if (clusterConfig.hasOwnProperty(propertyName)) {
      config[propertyName] = clusterConfig[propertyName];
    }
  }
}

if (clusterConfig) {
  config.graphqlApiUrl = environment.localApi
    ? clusterConfig['graphqlApiUrlLocal']
    : clusterConfig['graphqlApiUrl'];
}

// TEMPORARY ;) WORKAROUND, TO BE DELETED ONCE THE GRAPHQL FACADE IS IN PLACE
// YSF-1330
if (clusterConfig && window.location.hostname !== 'console.kyma.local') {
  config.k8sDashboardApiUrl = `${k8sServerUrl}/api/v1/namespaces/kube-system/services/https:kubernetes-dashboard:/proxy/api/v1/`;
}

export const AppConfig = { ...config };
