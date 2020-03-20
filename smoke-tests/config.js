module.exports = {
  login: process.env.LOGIN || 'admin@kyma.cx',
  password: process.env.PASSWORD || 'nimda123',
  domain: process.env.DOMAIN || 'kyma.local',
  localdev: process.env.LOCAL_DEV || false,
  backendModules: process.env.BACKENDMODULES || ['Applications'],
};
