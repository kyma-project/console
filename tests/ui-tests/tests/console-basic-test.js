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
    const dropdownButton = '.tn-dropdown__control';
    const dropdownMenu = '.tn-dropdown.sf-dropdown > .tn-dropdown__menu';
    await page.reload({ waitUntil: 'networkidle0' });
    await page.click(dropdownButton);
    await page.waitForSelector(dropdownMenu, { visible: true });
    const environments = await kymaConsole.getEnvironments(page);
    await page.click(dropdownButton);
    console.log('Check if envs exist', environments);
    expect(environments.length).toBeGreaterThan(1);
  });

  test('Create env', async () => {
    common.validateTestEnvironment(dexReady);
    const navItem = 'a.sf-toolbar__item';
    const dropdownButton = '.tn-dropdown__control';
    const dropdownMenu = '.tn-dropdown.sf-dropdown > .tn-dropdown__menu';
    await kymaConsole.createEnvironment(page, config.testEnv);
    await page.$$eval(navItem, item =>
      item.find(text => text.innerText.includes('Workspace')).click()
    );
    await page.click(dropdownButton);
    await page.waitForSelector(dropdownMenu, { visible: true });
    const environments = await kymaConsole.getEnvironments(page);
    expect(environments).toContain(config.testEnv);
  });

  test('Delete env', async () => {
    common.validateTestEnvironment(dexReady);
    //checking list of environments before delete
    const dropdownButton = '.tn-dropdown__control';
    const dropdownMenu = '.tn-dropdown.sf-dropdown > .tn-dropdown__menu';
    await page.waitForSelector(dropdownButton, { visible: true });
    await page.click(dropdownButton);
    await page.waitForSelector(dropdownMenu, { visible: true });
    const existingEnvironments = await kymaConsole.getEnvironments(page);
    //delete operation
    const deleteConfirmButton =
      '.tn-modal__button-primary.sf-button--primary.tn-button--small';
    const dropDownCard = `button[aria-controls=${config.testEnv}]`;
    await page.click(dropDownCard);
    await page.click(`#${config.testEnv} > li > a[name=Delete]`);
    await page.waitFor(deleteConfirmButton);
    await page.click(deleteConfirmButton);
    await page.waitForSelector(deleteConfirmButton, { hidden: true });
    //checking list of environments after delete
    await page.reload({ waitUntil: 'networkidle0' });
    await page.waitForSelector(dropdownButton, { visible: true });
    await page.click(dropdownButton);
    await page.waitForSelector(dropdownMenu, { visible: true });
    const environments = await kymaConsole.getEnvironments(page);
    //temporary logout for debugging purpose
    console.log('Delete env - exist envs', existingEnvironments);
    console.log('Delete env - envs after deletion', environments);
    //assert
    expect(environments).not.toContain(config.testEnv);
  });

  test('Check if Application exist', async () => {
    common.validateTestEnvironment(dexReady);
    const remoteEnvironmentsUrl = address.console.getRemoteEnvironments();
    await page.goto(remoteEnvironmentsUrl, { waitUntil: 'networkidle0' });
    const remoteEnvironments = await kymaConsole.getRemoteEnvironments(page);
    console.log('Check if Application exists', remoteEnvironments);
    expect(remoteEnvironments).not.toContain(config.testEnv);
  });

  test('Create Application', async () => {
    common.validateTestEnvironment(dexReady);
    await kymaConsole.createRemoteEnvironment(page, config.testEnv);
    await page.reload({ waitUntil: 'networkidle0' });
    const remoteEnvironments = await kymaConsole.getRemoteEnvironments(page);
    console.log('Create new Application, remote envs: ', remoteEnvironments);
    expect(remoteEnvironments).toContain(config.testEnv);
  });

  test('Go to details and back', async () => {
    common.validateTestEnvironment(dexReady);
    await kymaConsole.openLink(page, 'div.remoteenv-name', config.testEnv);
    const detailsText = await page.evaluate(() => document.body.innerText);
    expect(detailsText).toContain(config.testEnv);
    expect(detailsText).toContain('General Information');
    await kymaConsole.openLink(page, 'a', 'Applications');
    const listText = await page.evaluate(() => document.body.innerText);
    expect(listText).toContain(config.testEnv);
    expect(listText).toContain('Search');
  });

  test('Delete Application', async () => {
    common.validateTestEnvironment(dexReady);
    const initialRemoteEnvironments = await kymaConsole.getRemoteEnvironments(
      page
    );
    await kymaConsole.deleteRemoteEnvironment(page, config.testEnv);

    const remoteEnvironments = await common.retry(
      page,
      async () =>
        await kymaConsole.getRemoteEnvironmentsAfterDelete(
          page,
          initialRemoteEnvironments
        )
    );
    console.log(
      'Delete Application, remaining remote envs: ',
      remoteEnvironments
    );
    expect(remoteEnvironments).not.toContain(config.testEnv);
  });
});
