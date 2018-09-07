import config from '../config';
import serviceClassConfig from '../utils/serviceClassConfig';
import kymaConsole from '../commands/console';
import catalog from '../commands/catalog';
import common from '../commands/common';
import logOnEvents from '../utils/logging';
import waitForNavigationAndContext from '../utils/waitForNavigationAndContext';

const context = require('../utils/testContext');
let page, browser;
let dexReady = false;
const consoleUrl = config.localdev ? config.devConsoleUrl : config.consoleUrl;
let token = '';

describe('Catalog basic tests', () => {
  beforeAll(async () => {
    dexReady = await context.isDexReady();
    const data = await common.beforeAll(dexReady);
    browser = data.browser;
    page = data.page;
    logOnEvents(page, t => (token = t));
  });

  afterAll(async () => {
    await kymaConsole.clearData(token, config.catalogTestEnv);
    await browser.close();
  });

  test('Login', async () => {
    //the code looks strange.. but it uneasy to stop test execution as a result of a check in  'beforeAll'
    // https://github.com/facebook/jest/

    await common.testLogin(dexReady, page);
  });

  test('Create catalogTestEnv env', async () => {
    common.validateDex(dexReady);

    // Hardcodes for specific page
    const catalogLinkText = 'Catalog';

    // consts
    const dropdownButton = '.tn-dropdown__control';
    const dropdownMenu = '.tn-dropdown.sf-dropdown > .tn-dropdown__menu';
    const createEnvBtn = '.open-create-env-modal';
    const createEnvModal = '.sf-modal.sf-modal--min';
    const createBtn = '.env-create-btn';
    const envNameInput = 'input[name=environmentName].tn-form__control';
    const navItem = 'a.sf-toolbar__item';

    await page.click(dropdownButton);
    await page.waitForSelector(dropdownMenu, { visible: true });
    const existingEnvironments = await kymaConsole.getEnvironments(page);
    await page.click(dropdownButton);
    await page.click(createEnvBtn);
    await page.waitFor(createEnvModal);
    await page.focus(envNameInput);
    await page.type(envNameInput, config.catalogTestEnv);
    await page.click(createBtn);
    await page.waitForSelector(createEnvModal, { hidden: true });
    await page.reload({ waitUntil: 'networkidle0' });
    await page.$$eval(
      navItem,
      (item, catalogLinkText) => {
        item.find(text => text.innerText.includes(catalogLinkText)).click();
      },
      catalogLinkText
    );

    await page.reload({ waitUntil: 'networkidle0' });
    await waitForNavigationAndContext(page);
  });

  test('Check service list', async () => {
    common.validateDex(dexReady);

    // Hardcodes for specific service class
    const exampleServiceClassName = serviceClassConfig.exampleServiceClassName;

    // consts
    const catalogHeaderSelector = catalog.prepareSelector('toolbar-headline');
    const catalogExpectedHeader = 'Service Catalog';
    const serviceButtonSelector = catalog.prepareSelector('card-button');

    const searchSelector = catalog.prepareSelector('search');
    const searchBySth = 'lololo';

    const frame = await kymaConsole.getFrame(page);
    await frame.waitForSelector(catalogHeaderSelector);
    const catalogHeader = await frame.$eval(
      catalogHeaderSelector,
      item => item.innerHTML
    );
    expect(catalogHeader).toContain(catalogExpectedHeader);

    const currentServices = await catalog.getServices(frame);
    expect(currentServices.length).toBeGreaterThan(0);

    const searchInput = await frame.$(searchSelector);

    await catalog.feelInInput(frame, exampleServiceClassName);
    const searchedServices = await catalog.getServices(frame);
    expect(searchedServices).toContain(exampleServiceClassName);

    await catalog.feelInInput(frame, searchBySth);
    const newSearchedServices = await catalog.getServices(frame);
    expect(newSearchedServices).not.toContain(exampleServiceClassName);

    await searchInput.click({ clickCount: 3 });
    await searchInput.press('Backspace');
  });

  test('Check details', async () => {
    common.validateDex(dexReady);

    // Hardcodes for specific service class
    const exampleServiceClassButton =
      serviceClassConfig.exampleServiceClassButton;

    // consts
    const exampleServiceClassTitle = catalog.prepareSelector('service-title');
    const exampleServiceClassProvider = catalog.prepareSelector(
      'service-provider'
    );
    const exampleServiceClassDescription = catalog.prepareSelector(
      'service-description'
    );

    const frame = await kymaConsole.getFrame(page);
    const redis = await frame.$(exampleServiceClassButton);
    await redis.click();
    await frame.waitForSelector(exampleServiceClassTitle);
    const title = await frame.$(exampleServiceClassTitle);
    const provider = await frame.$(exampleServiceClassProvider);
    const description = await frame.$(exampleServiceClassDescription);
    expect(title.toString()).not.toBeNull();
    expect(provider.toString()).not.toBeNull();
    expect(description.toString()).not.toBeNull();
  });

  test('Check provisioning', async () => {
    common.validateDex(dexReady);

    // Hardcodes for specific service class / page
    const catalogUrl = `${consoleUrl}/home/environments/catalogtestenvironment/service-catalog`;
    const instanceTitle = serviceClassConfig.instanceTitle;
    const instanceTitle2 = serviceClassConfig.instanceTitle2;
    const instanceLabel = serviceClassConfig.instanceLabel;
    const instanceLabel2 = serviceClassConfig.instanceLabel2;
    const exampleServiceClassButton =
      serviceClassConfig.exampleServiceClassButton;

    // consts
    const addToEnvButton = `[${config.catalogTestingAtribute}="add-to-env"]`;

    await catalog.createInstance(page, instanceTitle, instanceLabel);

    await page.goto(catalogUrl, { waitUntil: 'networkidle0' });
    await waitForNavigationAndContext(page);

    const frame = await kymaConsole.getFrame(page);
    const redis = await frame.$(exampleServiceClassButton);
    await redis.click();
    await waitForNavigationAndContext(page);
    await frame.waitForSelector(addToEnvButton, { visible: true });

    await catalog.createInstance(page, instanceTitle2, instanceLabel2);
  });

  test('Check instances list', async () => {
    common.validateDex(dexReady);

    // Hardcodes for specific service class / page
    const exampleInstanceName = serviceClassConfig.instanceTitle;
    const instancesLinkText = 'Instances';
    const instancesUrl = `${consoleUrl}/home/environments/catalogtestenvironment/instances`;
    // consts
    const navItem = 'a.sf-toolbar__item';
    const instancesHeaderSelector = catalog.prepareSelector('toolbar-headline');
    const instancesExpectedHeader = 'Service Instances';
    const serviceButtonSelector = catalog.prepareSelector('card-button');

    const searchSelector = catalog.prepareSelector('search');
    const toggleSearchSelector = catalog.prepareSelector('toggle-search');
    const searchBySth = 'lololo';

    await page.goto(instancesUrl, { waitUntil: 'networkidle0' });
    await waitForNavigationAndContext(page);

    const frame = await kymaConsole.getFrame(page);
    await frame.waitForSelector(instancesHeaderSelector);
    const instancesHeader = await frame.$eval(
      instancesHeaderSelector,
      item => item.innerHTML
    );
    expect(instancesHeader).toContain(instancesExpectedHeader);

    const currentInstances = await catalog.getInstances(frame);
    expect(currentInstances.length).toBeGreaterThan(0);

    const toggleSearch = await frame.$(toggleSearchSelector);
    await toggleSearch.click();
    const searchInput = await frame.$(searchSelector);

    await catalog.feelInInput(frame, exampleInstanceName);
    const searchedInstances = await catalog.getInstances(frame);
    expect(searchedInstances).toContain(exampleInstanceName);

    await catalog.feelInInput(frame, searchBySth);
    const newSearchedInstances = await catalog.getInstances(frame);
    expect(newSearchedInstances).not.toContain(exampleInstanceName);

    await searchInput.click({ clickCount: 3 });
    await searchInput.press('Backspace');
  });

  test('Check details', async () => {
    common.validateDex(dexReady);

    // Hardcodes for specific service class
    const exampleInstanceLink = catalog.prepareSelector(
      `instance-name-${serviceClassConfig.instanceTitle}`
    );
    const instanceExpectedHeader = `Service Instances / ${
      serviceClassConfig.instanceTitle
    }`;

    // consts
    const instancesHeaderSelector = catalog.prepareSelector('toolbar-headline');
    const exampleInstanceServiceClass = catalog.prepareSelector(
      'instance-service-class'
    );
    const exampleInstanceServicePlan = catalog.prepareSelector(
      'instance-service-plan'
    );
    const exampleInstanceStatusType = catalog.prepareSelector(
      'instance-status-type'
    );
    const exampleInstanceStatusMessage = catalog.prepareSelector(
      'instance-status-message'
    );

    const frame = await kymaConsole.getFrame(page);
    const redis = await frame.waitForSelector(exampleInstanceLink, {
      visible: true
    });
    await redis.click();
    // await frame.waitForSelector(instancesHeaderSelector);
    // const instancesHeader = await frame.$eval(
    //   instancesHeaderSelector,
    //   item => item.innerHTML
    // );
    // expect(instancesHeader).toContain(instanceExpectedHeader);

    const serviceClass = await frame.$(exampleInstanceServiceClass);
    const servicePlan = await frame.$(exampleInstanceServicePlan);
    const statusType = await frame.$(exampleInstanceStatusType);
    expect(serviceClass.toString()).not.toBeNull();
    expect(servicePlan.toString()).not.toBeNull();
    expect(statusType.toString()).not.toBeNull();
  });
});
