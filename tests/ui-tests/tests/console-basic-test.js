import config from '../config';
import kymaConsole from '../commands/console';
import { create } from 'domain';
import logOnEvents from '../utils/logging';
import waitForNavigationAndContext from '../utils/waitForNavigationAndContext';

const context = require('../utils/testContext');
let page, browser;
let dexReady = false;
const consoleUrl = `https://console.${config.domain}/`;
let token = '';

describe('Console basic tests', () => {
  beforeAll(async () => {
    browser = await context.getBrowser();
    page = await browser.newPage();
    dexReady = await context.isDexReady(page);
    if (dexReady) {
      let width = config.viewportWidth;
      let height = config.viewportHeight;
      await page.setViewport({ width, height });
      console.log(`Starting navigation to ${consoleUrl}`);
      await page.goto(consoleUrl, { waitUntil: 'networkidle0' });
      console.log(`Navigation to ${consoleUrl} finished!`);
      await waitForNavigationAndContext(page);
      console.log(`document ready!`);
      logOnEvents(page, t => (token = t));
    } else {
      fail('Test environment wasnt ready');
    }
  });

  afterAll(async () => {
    await kymaConsole.clearData(token, config.testEnv);
    browser.close();
  });

  test('Login', async () => {
    //the code looks strange.. but it uneasy to stop test execution as a result of a check in  'beforeAll'
    // https://github.com/facebook/jest/issues/2713
    if (dexReady) {
      await kymaConsole.login(page, config);
      const title = await page.title();
      expect(title).toBe('Kyma');
    }
  });

  test('Check if envs exist', async () => {
    if (dexReady) {
      const dropdownButton = '.tn-dropdown__control';
      const dropdownMenu = '.tn-dropdown.sf-dropdown > .tn-dropdown__menu';
      await page.reload({ waitUntil: 'networkidle0' });
      await page.click(dropdownButton);
      await page.waitForSelector(dropdownMenu, { visible: true });
      const environments = await kymaConsole.getEnvironments(page);
      await page.click(dropdownButton);
      console.log('Check if envs exist', environments);
      expect(environments.length).toBeGreaterThan(1);
    }
  });

  test('Create env', async () => {
    if (dexReady) {
      const dropdownButton = '.tn-dropdown__control';
      const dropdownMenu = '.tn-dropdown.sf-dropdown > .tn-dropdown__menu';
      const createEnvBtn = '.open-create-env-modal';
      const createEnvModal = '.sf-modal.sf-modal--min';
      const createBtn = '.env-create-btn';
      const envNameInput = 'input[name=environmentName].tn-form__control';
      const navItem = 'a.sf-toolbar__item';
      // const workspaceBtn =   'a[ng-reflect-router-link=workspace]';
      await page.click(dropdownButton);
      await page.waitForSelector(dropdownMenu, { visible: true });
      const existingEnvironments = await kymaConsole.getEnvironments(page);
      await page.click(dropdownButton);
      await page.click(createEnvBtn);
      await page.waitFor(createEnvModal);
      await page.focus(envNameInput);
      await page.type(envNameInput, config.testEnv);
      await page.click(createBtn);
      await page.waitForSelector(createEnvModal, { hidden: true });
      await page.reload({ waitUntil: 'networkidle0' });
      // await page.click(workspaceBtn);
      await page.$$eval(navItem, item =>
        item.find(text => text.innerText.includes('Workspace')).click()
      );
      await page.click(dropdownButton);
      await page.waitForSelector(dropdownMenu, { visible: true });
      const environments = await kymaConsole.getEnvironments(page);
      await page.click(dropdownButton);
      expect(environments).toContain(config.testEnv);
    }
  });

  test('Delete env', async () => {
    if (dexReady) {
      //checking list of environments before delete
      const dropdownButton = '.tn-dropdown__control';
      const dropdownMenu = '.tn-dropdown.sf-dropdown > .tn-dropdown__menu';
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
      await page.click(dropdownButton);
      await page.waitForSelector(dropdownMenu, { visible: true });
      const environments = await kymaConsole.getEnvironments(page);
      //temporary logout for debugging purpose
      console.log('Delete env - exist envs', existingEnvironments);
      console.log('Delete env - envs after deletion', environments);
      //assert
      expect(environments).not.toContain(config.testEnv);
    }
  });
});
