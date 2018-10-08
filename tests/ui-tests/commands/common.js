import config from '../config';
import address from '../utils/address';
import waitForNavigationAndContext from '../utils/waitForNavigationAndContext';
import kymaConsole from './console';
const context = require('../utils/testContext');

function validateTestEnvironment(isTestEnvironmentReady) {
  if (!isTestEnvironmentReady) {
    throw new Error("Test environment wasn't ready");
  }
}

async function beforeAll(isTestEnvironmentReady) {
  validateTestEnvironment(isTestEnvironmentReady);
  const consoleUrl = address.console.getConsole();
  let browser = await context.getBrowser();
  let page = await browser.newPage();
  const width = config.viewportWidth;
  const height = config.viewportHeight;
  await page.setViewport({ width, height });
  await page.goto(consoleUrl, { waitUntil: 'networkidle0' });
  await waitForNavigationAndContext(page);

  return { page, browser };
}

async function testLogin(isTestEnvironmentReady, page) {
  validateTestEnvironment(isTestEnvironmentReady);
  await kymaConsole.login(page, config);

  // as title is configurable, test need to check something else
  await page.waitForSelector('.sf-toolbar', { visible: true });
}

module.exports = {
  validateTestEnvironment,
  beforeAll,
  testLogin
};
