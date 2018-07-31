import puppeteer from 'puppeteer';
import config from '../config';
const context = (function() {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  jasmine.stopSpecOnExpectationFailure = true;

  process.on('unhandledRejection', error => {
    console.log('unhandledRejection', error.message);
  });

  return {
    isDexReady: async function(page) {
      const url = `https://dex.${
        config.domain
      }/.well-known/openid-configuration`;
      return await page.goto(url, { waitUntil: 'networkidle0' });
    },
    getBrowser: () => {
      return puppeteer.launch({
        ignoreHTTPSErrors: true,
        headless: config.headless,
        slowMo: 80,
        args: [
          `--window-size=${config.viewportWidth},${config.viewportHeight}`,
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disk-cache-size=0'
        ]
      });
    }
  };
})();

module.exports = context;
