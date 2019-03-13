import config from '../config';
import kymaConsole from '../commands/console';
import common from '../commands/common';
import { describeIf } from '../utils/skip';
import dex from '../utils/dex';
import address from '../utils/address';
import { retry } from '../utils/retry';
import { testPluggable } from '../setup/test-pluggable';

let page, browser;
let token = '';

// TODO: Move application tests to a separate file
const REQUIRED_MODULE = 'application';

describeIf(dex.isStaticUser(), 'Console basic tests', () => {
  beforeAll(async () => {
    await retry(async () => {
      const data = await common.beforeAll(t => (token = t));
      browser = data.browser;
      page = data.page;
    });
  });

  afterAll(async () => {
    await kymaConsole.clearData(token, config.testEnv);
    if (browser) {
      await browser.close();
    }
  });

  test('Check if envs exist', async () => {
    const dropdownButton = '.fd-button--shell';
    const dropdownMenu = 'ul#context_menu_middle > li';
    await page.click(dropdownButton);
    await page.waitForSelector(dropdownMenu, { visible: true });
    const environments = await kymaConsole.getEnvironmentsFromContextSwitcher(
      page,
    );
    await page.click(dropdownButton);
    console.log('Check if envs exist', environments);
    expect(environments.length).toBeGreaterThan(1);
  });

  test('Create env', async () => {
    await kymaConsole.createEnvironment(page, config.testEnv);
    await Promise.all([
      page.goto(address.console.getEnvironmentsAddress()),
      page.waitForNavigation({
        waitUntil: ['domcontentloaded', 'networkidle0'],
      }),
    ]);
    const environmentNames = await kymaConsole.getEnvironmentNamesFromEnvironmentsPage(
      page,
    );
    expect(environmentNames).toContain(config.testEnv);
  });

  test('Delete env', async () => {
    const initialEnvironmentNames = await kymaConsole.getEnvironmentNamesFromEnvironmentsPage(
      page,
    );
    await kymaConsole.deleteEnvironment(page, config.testEnv);
    const environmentNames = await retry(async () => {
      const environmentNamesAfterDelete = await kymaConsole.getEnvironmentNamesFromEnvironmentsPage(
        page,
      );
      if (initialEnvironmentNames <= environmentNamesAfterDelete) {
        throw new Error(`Namespace ${config.testEnv} not yet deleted`);
      }
      return environmentNamesAfterDelete;
    });

    //assert
    expect(initialEnvironmentNames).toContain(config.testEnv);
    expect(environmentNames).not.toContain(config.testEnv);
  });

  test('Check if Application exist', async () => {
    const applicationsUrl = address.console.getApplications();
    await Promise.all([
      page.goto(applicationsUrl),
      page.waitForNavigation({
        waitUntil: ['domcontentloaded', 'networkidle0'],
      }),
    ]);
    const applications = await kymaConsole.getApplicationNames(
      page,
    );
    console.log('Check if application exists', applications);
    expect(applications).not.toContain(config.testApp);
  });

  testPluggable(REQUIRED_MODULE, 'Create Application', async () => {
    await retry(async () => {
      await page.reload({ waitUntil: ['domcontentloaded', 'networkidle0'] });
      await kymaConsole.createApplication(page, config.testApp);
    });
    await page.reload({ waitUntil: ['domcontentloaded', 'networkidle0'] });
    const applications = await kymaConsole.getApplicationNames(
      page,
    );
    expect(applications).toContain(config.testApp);
  });

  testPluggable(REQUIRED_MODULE, 'Go to details and back', async () => {
    const frame = await kymaConsole.getFrame(page);
    await frame.waitForXPath(
      `//a[contains(@data-e2e-id, 'application-name') and contains(string(), "${
        config.testApp
      }")]`,
    );
    await kymaConsole.openLinkOnFrame(
      page,
      '[data-e2e-id=application-name]',
      config.testApp,
    );
    frame.waitForXPath(`//td[contains(string(), "${config.testApp}")]`);
    frame.waitForXPath(`//h1[contains(string(), "General Information")]`);

    frame.waitForSelector('.fd-breadcrumb__link');
    frame.click('.fd-breadcrumb__link');
  });

  testPluggable(REQUIRED_MODULE, 'Delete Application', async () => {
    const frame = await kymaConsole.getFrame(page);
    await frame.waitForXPath(
      `//a[contains(@data-e2e-id, 'application-name') and contains(string(), "${
        config.testApp
      }")]`,
    );
    const initialApplications = await kymaConsole.getApplicationNames(
      page,
    );
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
});
