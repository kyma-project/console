import config from '../config';
import kymaConsole from '../commands/console';
import common from '../commands/common';
import address from '../utils/address';
import { retry } from '../utils/retry';
import { testPluggable } from '../setup/test-pluggable';
import { describeIf } from '../utils/skip';

common.setRandomNamespaceName();
let page, browser;
let token = ''; // eslint-disable-line no-unused-vars

const REQUIRED_MODULE = 'application';

describeIf(
  !config.apiPackagesEnabled,
  'Console Application UI smoke tests',
  () => {
    beforeAll(async () => {
      await retry(async () => {
        const data = await common.beforeAll(t => (token = t));
        browser = data.browser;
        page = data.page;
      });
    });

    afterAll(async () => {
      if (browser) {
        await browser.close();
      }
    });

    test('Check if Application exist', async () => {
      const applicationsUrl = address.console.getApplications();
      await Promise.all([
        page.goto(applicationsUrl),
        page.waitForNavigation({
          waitUntil: ['domcontentloaded', 'networkidle0'],
        }),
      ]);
      const applications = await kymaConsole.getApplicationNames(page);
      console.log('Check if application exists', applications);
      expect(applications).not.toContain(config.testApp);
    });

    testPluggable(REQUIRED_MODULE, 'Create Application', async () => {
      await kymaConsole.createApplication(page, config.testApp);
      const applications = await kymaConsole.getApplicationNames(page);
      expect(applications).toContain(config.testApp);
    });

    testPluggable(REQUIRED_MODULE, 'Go to details and back', async () => {
      const frame = await kymaConsole.waitForConsoleCoreFrame(page);
      await frame.waitForXPath(
        `//a[contains(@data-e2e-id, 'application-name') and contains(string(), "${config.testApp}")]`,
      );
      await kymaConsole.openLinkOnFrame(
        page,
        '[data-e2e-id=application-name]',
        config.testApp,
      );
      frame.waitForSelector('.fd-breadcrumb__link');
      frame.click('.fd-breadcrumb__link');
    });

    testPluggable(REQUIRED_MODULE, 'Delete Application', async () => {
      const frame = await kymaConsole.waitForConsoleCoreFrame(page);
      await frame.waitForXPath(
        `//a[contains(@data-e2e-id, 'application-name') and contains(string(), "${config.testApp}")]`,
      );
      const initialApplications = await kymaConsole.getApplicationNames(page);
      await kymaConsole.deleteApplication(page, config.testApp);
      const applications = await retry(async () => {
        const applicationsAfterRemoval = await kymaConsole.getApplicationNames(
          page,
        );
        if (initialApplications <= applicationsAfterRemoval) {
          throw new Error(`Application ${config.testApp} was not yet removed`);
        }
        return applicationsAfterRemoval;
      }, 5);
      expect(applications).not.toContain(config.testApp);
    });
  },
);
