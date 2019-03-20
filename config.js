var domain = 'kyma.local';
var localDomain = 'console-dev.kyma.local';

window.clusterConfig = {
  graphqlApiUrl: 'https://console-backend.' + domain + '/graphql',
  graphqlApiUrlLocal: 'http://' + localDomain + ':3000/graphql',

  subscriptionsApiUrl: 'wss://console-backend.' + domain + '/graphql',
  subscriptionsApiUrlLocal: 'ws://' + localDomain + ':3000/graphql',

  authRedirectUri: 'http://' + localDomain + ':4200',
  domain: domain,
  consoleClientId: 'console',
  orgId: 'my-org-123',
  orgName: 'My Organization',
  scope:
    'audience:server:client_id:kyma-client audience:server:client_id:console openid profile email groups',
  gateway_kyma_project_io_version: 'v1alpha2',

  serviceCatalogModuleUrl: 'http://' + localDomain + ':8000',
  serviceInstancesModuleUrl: 'http://' + localDomain + ':8001',
  serviceBrokersModuleUrl: 'http://' + localDomain + ':8002',
  docsModuleUrl: 'http://' + localDomain + ':8003',
  lambdasModuleUrl: 'http://' + localDomain + ':4201',
  logsModuleUrl: 'http://' + localDomain + ':4400',
};
