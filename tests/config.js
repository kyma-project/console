const env = Cypress.env();

module.exports = {
  login: env.LOGIN || 'admin@kyma.cx',
  password: env.PASSWORD || 'nimda123',
  domain: env.DOMAIN || 'kyma.local',
  disableLegacyConnectivity: env.DISABLE_LEGACY_CONNECTIVITY,
  serviceCatalogEnabled: env.CATALOG_ENABLED,
  functionsEnabled: env.FUNCTIONS_ENABLED,
  DEFAULT_NAMESPACE_NAME: 'default',
};
