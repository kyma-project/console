const env = Cypress.env();

module.exports = {
  login: env.LOGIN || 'admin@kyma.cx',
  password: env.PASSWORD || 'nimda123',
  domain: env.DOMAIN || 'kyma.local',
  localDev: env.LOCAL_DEV,
  disableLegacyConnectivity: env.DISABLE_LEGACY_CONNECTIVITY,
  serviceCatalogEnabled: env.CATALOG_ENABLED,
  loggingEnabled: env.LOGGING_ENABLED,
  functionsEnabled: env.FUNCTIONS_ENABLED,
  docsEnabled: env.RAFTER_ENABLED,
  DEFAULT_NAMESPACE_NAME: 'default',
};
