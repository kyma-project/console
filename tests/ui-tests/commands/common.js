import config from '../config';
import waitForNavigationAndContext from '../utils/waitForNavigationAndContext';
import kymaConsole from './console';
const context = require('../utils/testContext');

module.exports = {
  validateDex,
  beforeAll: async function(dexReady) {
    validateDex(dexReady);
    const consoleUrl = config.localdev
      ? config.devConsoleUrl
      : config.consoleUrl;
    let browser = await context.getBrowser();
    let page = await browser.newPage();
    const width = config.viewportWidth;
    const height = config.viewportHeight;
    await page.setViewport({ width, height });
    await page.goto(consoleUrl, { waitUntil: 'networkidle0' });
    await waitForNavigationAndContext(page);

    return { page, browser };
  },
  testLogin: async function(dexReady, page) {
    validateDex(dexReady);
    await kymaConsole.login(page, config);
    const title = await page.title();

    expect(title).toBe('Kyma');
  }
};

function validateDex(dexReady) {
  if (!dexReady) {
    throw new Error('Test environment wasnt ready');
  }
}
