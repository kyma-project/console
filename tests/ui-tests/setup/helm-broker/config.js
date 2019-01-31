export const helmBrokerConfig = {
  name: process.env.HELM_BROKER_NAME
    ? process.env.HELM_BROKER_NAME
    : 'core-helm-broker',
  namespace: process.env.HELM_BROKER_NAMESPACE
    ? process.env.HELM_BROKER_NAMESPACE
    : 'kyma-system',
  testBundleUrl: process.env.HELM_BROKER_TEST_BUNDLE_URL
    ? process.env.HELM_BROKER_TEST_BUNDLE_URL
    : 'https://github.com/kyma-project/bundles/releases/download/0.3.0/index-testing.yaml',
  testBundleExternalName: 'testing',
  repositoriesEnvName: process.env.HELM_BROKER_REPOSITORIES_ENV_NAME
    ? process.env.HELM_BROKER_REPOSITORIES_ENV_NAME
    : 'APP_REPOSITORY_URLS',
  readyTimeout: process.env.HELM_BROKER_READY_TIMEOUT
    ? Number(process.env.HELM_BROKER_READY_TIMEOUT)
    : 120 * 1000,
  repositoriesSeparator: ';'
};
