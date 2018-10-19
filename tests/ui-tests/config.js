module.exports = {
  login: process.env.LOGIN || 'admin@kyma.cx',
  password: process.env.PASSWORD || 'nimda123',
  domain: process.env.DOMAIN || 'kyma.local',
  devConsoleUrl:
    process.env.DEV_CONSOLE_URl || 'http://console-dev.kyma.local:4200',
  localdev: process.env.LOCAL_DEV || false,
  testEnv: process.env.TEST_ENV || 'testenvironment',
  catalogTestEnv: process.env.CATALOG_TEST_ENV || 'catalogtestenvironment',
  headless: process.env.HEADLESS || false,
  viewportWidth: process.env.WIDTH || 1400,
  viewportHeight: process.env.HEIGHT || 1080,
  testLambda: process.env.TEST_LAMBDA || 'testlambda',
  catalogTestingAtribute: 'data-e2e-id',
  verbose: process.env.VERBOSE || false,
  dexConfig: process.env.DEX_CONFIG || '/etc/dex/cfg/config.yaml'
};
