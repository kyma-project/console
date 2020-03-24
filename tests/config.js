module.exports = {
  login: process.env.LOGIN || 'admin@kyma.cx',
  password: process.env.PASSWORD || 'nimda123',
  domain: process.env.DOMAIN || 'kyma.local',
  localDev: process.env.LOCAL_DEV || false,
  apiPackagesEnabled: process.env.API_PACKAGES_ENABLED || false,
  serviceCatalogEnabled: process.env.CATALOG_ENABLED || false,
};
