export const helmBrokerConfig = {
  name: process.env.HELM_BROKER_NAME
    ? process.env.HELM_BROKER_NAME
    : 'helm-broker',
  namespace: process.env.HELM_BROKER_NAMESPACE
    ? process.env.HELM_BROKER_NAMESPACE
    : 'kyma-system',
  testBundleUrl: process.env.HELM_BROKER_TEST_BUNDLE_URL
    ? process.env.HELM_BROKER_TEST_BUNDLE_URL
    : 'https://github.com/kyma-project/bundles/releases/download/0.3.0/index-testing.yaml',
  testBundleExternalName: process.env.HELM_BROKER_TEST_BUNDLE_EXTERNAL_NAME
    ? process.env.HELM_BROKER_TEST_BUNDLE_EXTERNAL_NAME
    : 'testing',
  testBundleMinimalName: process.env.HELM_BROKER_TEST_BUNDLE_MINIMAL_NAME
    ? process.env.HELM_BROKER_TEST_BUNDLE_MINIMAL_NAME
    : 'minimal',
  testBundleFullName: process.env.HELM_BROKER_TEST_BUNDLE_FULL_NAME
    ? process.env.HELM_BROKER_TEST_BUNDLE_FULL_NAME
    : 'full',
  repositoriesEnvName: process.env.HELM_BROKER_REPOSITORIES_ENV_NAME
    ? process.env.HELM_BROKER_REPOSITORIES_ENV_NAME
    : 'APP_REPOSITORY_URLS',
  readyTimeout: process.env.HELM_BROKER_READY_TIMEOUT
    ? Number(process.env.HELM_BROKER_READY_TIMEOUT)
    : 120 * 1000,
  repositoriesSeparator: ';',
};
