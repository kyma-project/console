import puppeteer from 'puppeteer';
import config from '../config';
import testIfWebResourceAvailable from '../utils/testIfWebResourceAvailable';
import address from './address';

const context = (function() {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  jasmine.stopSpecOnExpectationFailure = true;

  process.on('unhandledRejection', error => {
    console.log('unhandledRejection', error.message);
  });

  return {
    isDexReady: async function() {
      const url = address.dex.getOpenID();
      try {
        let isReady = await testIfWebResourceAvailable(url);
        if (!isReady) {
          console.error(`Test failed! ${url} not ready yet`);
          process.exitCode = 1;
        }
        return isReady;
      } catch (error) {
        console.error(`Test failed!`, error);
        process.exitCode = 1;
      }
    },
    getBrowser: () => {
      return puppeteer.launch({
        ignoreHTTPSErrors: true,
        headless: config.headless,
        slowMo: 80,
        devtools: true,
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
