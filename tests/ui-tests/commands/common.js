import config from '../config';
import address from '../utils/address';
const context = require('../utils/testContext');

async function beforeAll() {
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
  return { page, browser };
}

async function retry(page, functionToRetry, retryNumber = 3) {
  for (let i = 1; i <= retryNumber; i++) {
    console.log('Retrying... Attempt No. ' + i + ' of ' + retryNumber);
    try {
      return await functionToRetry();
    } catch (e) {
      if (i === retryNumber) {
        console.log('Retry failed:', e);
        throw e;
      }
      await page.waitFor(2000);
    }
  }
}

module.exports = {
  beforeAll,
  retry
};
