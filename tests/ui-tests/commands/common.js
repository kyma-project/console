import config from '../config';
import address from '../utils/address';
import kymaConsole from './console';
import logOnEvents from '../utils/logging';
const context = require('../utils/testContext');

async function beforeAll(tokenCallback) {
  const consoleUrl = address.console.getConsole();
  let browser = await context.getBrowser();

  // throttle network to test variable conditions
  if (config.throttleNetwork) {
    console.log('WARNING! Network Throttling Enabled');
    browser.on('targetchanged', async target => {
      const page = await target.page();
      page.setDefaultNavigationTimeout(config.defaultNavigationTimeout);
      if (!page) {
        return;
      }
      const client = await page.target().createCDPSession();
      await client.send('Network.setCacheDisabled', { cacheDisabled: true });
      await client.send(
        'Network.emulateNetworkConditions',
        config.throttledNetworkConditions
      );
    });
  }

  let page = await browser.newPage();
  page.setDefaultNavigationTimeout(config.defaultNavigationTimeout);
  const width = config.viewportWidth;
  const height = config.viewportHeight;
  await page.setViewport({ width, height });
  console.log(`Opening ${consoleUrl}`);
  await Promise.all([
    page.goto(consoleUrl),
    page.waitForNavigation({ waitUntil: ['domcontentloaded'] })
  ]);
  process.on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at: Promise', p, 'reason:', reason);
    browser.close();
  });
  page.on('requestfailed', request => {
    const errText = request.failure().errorText;
    if (
      request.method() !== 'POST' ||
      (errText !== 'net::ERR_NETWORK_CHANGED' && errText !== 'net::ERR_FAILED')
    ) {
      console.log(
        `Request failed:\nURL: ${request.url()} \nMethod: ${request.method()}\nFailure: ${request.failure()}`
      );
      return;
    }

    throw new Error(
      `Request failed:\nURL: ${request.url()} \nMethod: ${request.method()}\nFailure: ${request.failure()}`
    );
  });
  logOnEvents(page, tokenCallback);
  await kymaConsole.testLogin(page);
  return { page, browser };
}
module.exports = {
  beforeAll
};
