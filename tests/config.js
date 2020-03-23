module.exports = {
  login: process.env.LOGIN || 'admin@kyma.cx',
  password: process.env.PASSWORD || 'nimda123',
  domain: process.env.DOMAIN || 'kyma.local',
  localdev: process.env.LOCAL_DEV || false,
  apiPackagesEnabled: process.env.API_PACKAGES_ENABLED || true,
  serciceCatalogEnabled: process.env.CATALOG_ENABLED || true,
};
