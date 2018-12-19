import config from '../config';
import kymaConsole from '../commands/console';
import common from '../commands/common';
import logOnEvents from '../utils/logging';
import { describeIf } from '../utils/skip';
import dex from '../utils/dex';
import address from '../utils/address';

const context = require('../utils/testContext');
let page, browser;
let dexReady = false;
let token = '';

describeIf(dex.isStaticUser(), 'Console basic tests', () => {
  beforeAll(async () => {
    dexReady = await context.isDexReady();
    const data = await common.beforeAll(dexReady);
    browser = data.browser;
    page = data.page;
    logOnEvents(page, t => (token = t));
  });

  afterAll(async () => {
    await kymaConsole.clearData(token, config.testEnv);
    await browser.close();
  });

  test('Login', async () => {
    //the code looks strange.. but it uneasy to stop test execution as a result of a check in  'beforeAll'
    // https://github.com/facebook/jest/issues/2713

    await common.testLogin(dexReady, page);
  });

  test('Check if envs exist', async () => {
    common.validateTestEnvironment(dexReady);
    const dropdownButton = '.fd-button--shell';
    const dropdownMenu = '.fd-popover__body';
    await page.reload({ waitUntil: 'networkidle0' });
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
    common.validateTestEnvironment(dexReady);
    await kymaConsole.createEnvironment(page, config.testEnv);
    await page.goto(address.console.getEnvironmentsAddress(), {
      waitUntil: 'networkidle0'
    });
    const environmentNames = await kymaConsole.getEnvironmentNamesFromEnvironmentsPage(
      page
    );
    expect(environmentNames).toContain(config.testEnv);
  });

  test('Delete env', async () => {
    common.validateTestEnvironment(dexReady);
    const existingEnvironmentNames = await kymaConsole.getEnvironmentNamesFromEnvironmentsPage(
      page
    );
    await kymaConsole.deleteEnvironment(page, config.testEnv);
    const environmentNamesAfterDelete = await kymaConsole.getEnvironmentNamesFromEnvironmentsPage(
      page
    );
    //assert
    expect(existingEnvironmentNames).toContain(config.testEnv);
    expect(environmentNamesAfterDelete).not.toContain(config.testEnv);
  });

  test('Check if Application exist', async () => {
    common.validateTestEnvironment(dexReady);
    const remoteEnvironmentsUrl = address.console.getRemoteEnvironments();
    await page.goto(remoteEnvironmentsUrl, { waitUntil: 'networkidle0' });
    const remoteEnvironments = await kymaConsole.getRemoteEnvironmentNames(
      page
    );
    console.log('Check if application exists', remoteEnvironments);
    expect(remoteEnvironments).not.toContain(config.testEnv);
  });

  test('Create Application', async () => {
    common.validateTestEnvironment(dexReady);
    await kymaConsole.createRemoteEnvironment(page, config.testEnv);
    await page.reload({ waitUntil: 'networkidle0' });
    const remoteEnvironments = await kymaConsole.getRemoteEnvironmentNames(
      page
    );
    expect(remoteEnvironments).toContain(config.testEnv);
  });

  test('Go to details and back', async () => {
    common.validateTestEnvironment(dexReady);
    const frame = await kymaConsole.getFrame(page);
    await kymaConsole.openLinkOnFrame(
      page,
      'div.remoteenv-name',
      config.testEnv
    );
    frame.waitForXPath(`//div[contains(string(), "${config.testEnv}")]`);
    frame.waitForXPath(`//h2[contains(string(), "General Information")]`);
    await kymaConsole.openLinkOnFrame(page, 'a', 'Applications');
    frame.waitForXPath(
      `//div[contains(@class, 'remoteenv-name') and contains(string(), "${
        config.testEnv
      }")]`
    );
  });

  test('Delete Application', async () => {
    common.validateTestEnvironment(dexReady);
    await kymaConsole.deleteRemoteEnvironment(page, config.testEnv);

    const initialRemoteEnvironments = await kymaConsole.getRemoteEnvironmentNames(
      page
    );
    const remoteEnvironments = await common.retry(
      page,
      async () =>
        await kymaConsole.getRemoteEnvironmentsAfterDelete(
          page,
          initialRemoteEnvironments
        )
    );
    expect(remoteEnvironments).not.toContain(config.testEnv);
  });
});
