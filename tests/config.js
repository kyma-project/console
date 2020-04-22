module.exports = {
  login: process.env.LOGIN || 'admin@kyma.cx',
  password: process.env.PASSWORD || 'nimda123',
  domain: process.env.DOMAIN || 'kyma.local',
  localDev: process.env.LOCAL_DEV || false,
  disableLegacyConnectivity: process.env.DISABLE_LEGACY_CONNECTIVITY || false,
  serviceCatalogEnabled: process.env.CATALOG_ENABLED || true,
};
