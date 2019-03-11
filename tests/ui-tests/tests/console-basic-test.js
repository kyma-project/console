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
    const remoteEnvironmentsUrl = address.console.getRemoteEnvironments();
    await Promise.all([
      page.goto(remoteEnvironmentsUrl),
      page.waitForNavigation({
        waitUntil: ['domcontentloaded', 'networkidle0'],
      }),
    ]);
    const remoteEnvironments = await kymaConsole.getRemoteEnvironmentNames(
      page,
    );
    console.log('Check if application exists', remoteEnvironments);
    expect(remoteEnvironments).not.toContain(config.testEnv);
  });

  testPluggable(REQUIRED_MODULE, 'Create Application', async () => {
    await retry(async () => {
      await page.reload({ waitUntil: ['domcontentloaded', 'networkidle0'] });
      await kymaConsole.createRemoteEnvironment(page, config.testEnv);
    });
    await page.reload({ waitUntil: ['domcontentloaded', 'networkidle0'] });
    const remoteEnvironments = await kymaConsole.getRemoteEnvironmentNames(
      page,
    );
    expect(remoteEnvironments).toContain(config.testEnv);
  });

  testPluggable(REQUIRED_MODULE, 'Go to details and back', async () => {
    const frame = await kymaConsole.getFrame(page);
    await frame.waitForXPath(
      `//a[contains(@data-e2e-id, 'remoteenv-name') and contains(string(), "${
        config.testEnv
      }")]`,
    );
    await kymaConsole.openLinkOnFrame(
      page,
      '[data-e2e-id=remoteenv-name]',
      config.testEnv,
    );
    frame.waitForXPath(`//td[contains(string(), "${config.testEnv}")]`);
    frame.waitForXPath(`//h1[contains(string(), "General Information")]`);

    frame.waitForSelector('.fd-breadcrumb__link');
    frame.click('.fd-breadcrumb__link');
  });

  testPluggable(REQUIRED_MODULE, 'Delete Application', async () => {
    const frame = await kymaConsole.getFrame(page);
    await frame.waitForXPath(
      `//a[contains(@data-e2e-id, 'remoteenv-name') and contains(string(), "${
        config.testEnv
      }")]`,
    );
    const initialRemoteEnvironments = await kymaConsole.getRemoteEnvironmentNames(
      page,
    );
    await kymaConsole.deleteRemoteEnvironment(page, config.testEnv);
    const remoteEnvironments = await retry(async () => {
      const remoteEnvironmentsAfterRemoval = await kymaConsole.getRemoteEnvironmentNames(
        page,
      );
      if (initialRemoteEnvironments <= remoteEnvironmentsAfterRemoval) {
        throw new Error(`Application ${config.testEnv} was not yet removed`);
      }
      return remoteEnvironmentsAfterRemoval;
    }, 5);
    expect(remoteEnvironments).not.toContain(config.testEnv);
  });
});
