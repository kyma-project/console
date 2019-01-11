import config from '../config';
import kymaConsole from '../commands/console';
import common from '../commands/common';
import logOnEvents from '../utils/logging';
import { describeIf } from '../utils/skip';
import dex from '../utils/dex';
import address from '../utils/address';

let page, browser;
let token = '';

describeIf(dex.isStaticUser(), 'Console basic tests', () => {
  beforeAll(async () => {
    try {
      const data = await common.beforeAll();
      browser = data.browser;
      page = data.page;
      logOnEvents(page, t => (token = t));
      await kymaConsole.testLogin(page);
    } catch (e) {
      throw e;
    }
  });

  afterAll(async () => {
    await kymaConsole.clearData(token, config.testEnv);
    await browser.close();
  });

  test('Check if envs exist', async () => {
    const dropdownButton = '.fd-button--shell';
    const dropdownMenu = 'ul#context_menu_middle > li';
    await page.click(dropdownButton);
    await page.waitForSelector(dropdownMenu, { visible: true });
    const environments = await kymaConsole.getEnvironmentsFromContextSwitcher(
      page
    );
    await page.click(dropdownButton);
    console.log('Check if envs exist', environments);
    expect(environments.length).toBeGreaterThan(1);
  });

  test('Create env', async () => {
    await kymaConsole.createEnvironment(page, config.testEnv);
    await page.goto(address.console.getEnvironmentsAddress(), {
      waitUntil: ['domcontentloaded', 'networkidle0']
    });
    const environmentNames = await kymaConsole.getEnvironmentNamesFromEnvironmentsPage(
      page
    );
    expect(environmentNames).toContain(config.testEnv);
  });

  test('Delete env', async () => {
    const initialEnvironmentNames = await kymaConsole.getEnvironmentNamesFromEnvironmentsPage(
      page
    );
    await kymaConsole.deleteEnvironment(page, config.testEnv);
    const environmentNames = await common.retry(page, async () => {
      const environmentNamesAfterDelete = await kymaConsole.getEnvironmentNamesFromEnvironmentsPage(
        page
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
    await page.goto(remoteEnvironmentsUrl, {
      waitUntil: ['domcontentloaded', 'networkidle0']
    });
    const remoteEnvironments = await kymaConsole.getRemoteEnvironmentNames(
      page
    );
    console.log('Check if application exists', remoteEnvironments);
    expect(remoteEnvironments).not.toContain(config.testEnv);
  });

  test('Create Application', async () => {
    await kymaConsole.createRemoteEnvironment(page, config.testEnv);
    await page.reload({ waitUntil: ['domcontentloaded', 'networkidle0'] });
    const remoteEnvironments = await kymaConsole.getRemoteEnvironmentNames(
      page
    );
    expect(remoteEnvironments).toContain(config.testEnv);
  });

  test('Go to details and back', async () => {
    const frame = await kymaConsole.getFrame(page);
    await frame.waitForXPath(
      `//div[contains(@class, 'remoteenv-name') and contains(string(), "${
        config.testEnv
      }")]`
    );
    await kymaConsole.openLinkOnFrame(
      page,
      'div.remoteenv-name',
      config.testEnv
    );
    frame.waitForXPath(`//div[contains(string(), "${config.testEnv}")]`);
    frame.waitForXPath(`//h2[contains(string(), "General Information")]`);
    await frame.waitForXPath(`//a[contains(string(), "Applications")]`);
    await kymaConsole.openLinkOnFrame(page, 'a', 'Applications');
    frame.waitForXPath(
      `//div[contains(@class, 'remoteenv-name') and contains(string(), "${
        config.testEnv
      }")]`
    );
  });

  test('Delete Application', async () => {
    const frame = await kymaConsole.getFrame(page);
    await frame.waitForXPath(
      `//div[contains(@class, 'remoteenv-name') and contains(string(), "${
        config.testEnv
      }")]`
    );
    const initialRemoteEnvironments = await kymaConsole.getRemoteEnvironmentNames(
      page
    );
    await kymaConsole.deleteRemoteEnvironment(page, config.testEnv);
    const remoteEnvironments = await common.retry(
      page,
      async () => {
        const remoteEnvironmentsAfterRemoval = await kymaConsole.getRemoteEnvironmentNames(
          page
        );
        if (initialRemoteEnvironments <= remoteEnvironmentsAfterRemoval) {
          throw new Error(`Application ${config.testEnv} was not yet removed`);
        }
        return remoteEnvironmentsAfterRemoval;
      },
      5
    );
    expect(remoteEnvironments).not.toContain(config.testEnv);
  });
});
