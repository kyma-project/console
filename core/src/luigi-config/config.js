var clusterConfig = window['clusterConfig'] || INJECTED_CLUSTER_CONFIG;
var k8sDomain = (clusterConfig && clusterConfig['domain']) || 'kyma.local';

export const config = {
  domain: 'kyma.local',
  localDomain: 'console-dev.kyma.local',
  serviceCatalogModuleUrl: 'https://catalog.' + k8sDomain,
  serviceInstancesModuleUrl: 'https://instances.' + k8sDomain,
  serviceBrokersModuleUrl: 'https://brokers.' + k8sDomain,
  docsModuleUrl: 'https://docs.' + k8sDomain,
  addOnsModuleUrl: 'https://addons.' + k8sDomain,
  logsModuleUrl: 'https://log-ui.' + k8sDomain,
  coreModuleUrl: 'https://core-ui.' + k8sDomain,
  graphqlApiUrl: 'https://console-backend.' + k8sDomain + '/graphql',
  apiserverUrl: 'https://apiserver.' + k8sDomain,
  disabledNavigationNodes: '',
  compassDefaultTenant:'',
  systemNamespaces:
    'compass-system istio-system knative-eventing knative-serving kube-public kube-system kyma-backup kyma-installer kyma-integration kyma-system natss kube-node-lease kubernetes-dashboard serverless-system',
    ...clusterConfig
};
