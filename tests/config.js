const env = Cypress.env();

module.exports = {
  login: env.LOGIN || 'admin@kyma.cx',
  password: env.PASSWORD || 'nimda123',
  domain: env.DOMAIN || 'kyma.local',
  localDev: env.LOCAL_DEV || false,
  disableLegacyConnectivity: env.DISABLE_LEGACY_CONNECTIVITY || false,
  serviceCatalogEnabled: env.CATALOG_ENABLED || true,
  loggingEnabled: env.LOGGING_ENABLED || false,
  functionsEnabled: env.FUNCTIONS_ENABLED || true,
  DEFAULT_NAMESPACE_NAME: 'default',
};
