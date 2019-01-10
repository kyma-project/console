import config from '../config';
import address from '../utils/address';
const context = require('../utils/testContext');

async function beforeAll() {
  const consoleUrl = address.console.getConsole();
  let browser = await context.getBrowser();

  browser.on('targetchanged', async target => {
    const page = await target.page();
    page.setDefaultNavigationTimeout(config.defaultNavigationTimeout);
    if (!page) {
      return;
    }
    const client = await page.target().createCDPSession();
    await client.send('Network.setCacheDisabled', { cacheDisabled: true });
    // throttle network to test variable conditions
    if (config.throttleNetwork) {
      await client.send(
        'Network.emulateNetworkConditions',
        config.throttledNetworkConditions
      );
    }
  });

  let page = await browser.newPage();
  page.setDefaultNavigationTimeout(config.defaultNavigationTimeout);
  const width = config.viewportWidth;
  const height = config.viewportHeight;
  await page.setViewport({ width, height });
  console.log(`Opening ${consoleUrl}`);
  await page.goto(consoleUrl, {
    waitUntil: ['domcontentloaded', 'networkidle0']
  });
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
