module.exports = {
  login: process.env.LOGIN || 'admin@kyma.cx',
  password: process.env.PASSWORD || 'nimda123',
  domain: process.env.DOMAIN || 'kyma.local',
  devConsoleUrl:
    process.env.DEV_CONSOLE_URl || 'http://console-dev.kyma.local:4200',
  devCatalogUrl:
    process.env.DEV_CATALOG_URl || 'http://console-dev.kyma.local:8000',
  devInstancesUrl:
    process.env.DEV_INSTANCES_URl || 'http://console-dev.kyma.local:8001',
  devLambdasUrl:
    process.env.DEV_LAMBDAS_URl || 'http://console-dev.kyma.local:4201',
  localdev: process.env.LOCAL_DEV || false,
  testNamespace: process.env.TEST_NAMESPACE || 'testnamespace',
  testApp: process.env.TEST_APP || 'testapplication',
  headless: process.env.HEADLESS || false,
  viewportWidth: process.env.WIDTH || 1400,
  viewportHeight: process.env.HEIGHT || 1080,
  testLambda: process.env.TEST_LAMBDA || 'testlambda',
  catalogTestingAtribute: 'data-e2e-id',
  verbose: process.env.VERBOSE || false,
  dexConfig: process.env.DEX_CONFIG || '/etc/dex/cfg/config.yaml',
  throttleNetwork: process.env.THROTTLE_NETWORK || false,
  throttledNetworkConditions: {
    offline: false,
    latency: 800,
    downloadThroughput: 280000,
    uploadThroughput: 256000,
  },
  defaultNavigationTimeout: 60000,
  outsideCluster: process.env.OUTSIDE_CLUSTER
    ? process.env.OUTSIDE_CLUSTER
    : false,
  kubeConfigPath: process.env.KUBECONFIG ? process.env.KUBECONFIG : undefined,
  loggingEnabled: process.env.LOGGING_ENABLED || false,
};
