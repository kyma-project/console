import config from '../config';
import {
  configExampleServiceClassName,
  configExampleServiceClassNameAndProvider,
  configExampleServiceClassButton,
  configInstanceTitle,
  configInstanceTitle2,
  configInstanceLabel,
  configInstancePlan,
  configInstancePlan2,
  configAdditionalData,
  configPlanName,
  configBindingResource,
  configBindingPrefix,
  configBindingAdditionalData,
  configCatalogExpectedHeader,
  configInstancesExpectedHeader,
} from '../utils/catalogConfig';
import kymaConsole from '../commands/console';
import catalog from '../commands/catalog';
import common from '../commands/common';
import address from '../utils/address';
import { describeIf } from '../utils/skip';
import dex from '../utils/dex';

import { TestBundleInstaller } from '../setup/test-bundle-installer';
import { retry } from '../utils/retry';
import {
  testPluggable,
  isModuleEnabled,
  logModuleDisabled,
} from '../setup/test-pluggable';

const TEST_NAMESPACE = 'service-catalog-ui-test';
const REQUIRED_MODULE = 'servicecatalog';
const REQUIRED_BINDING_MODULE = 'servicecatalogaddons';

const testBundleInstaller = new TestBundleInstaller(TEST_NAMESPACE);

let page, browser;

describeIf(dex.isStaticUser(), 'Catalog basic tests', () => {
  beforeAll(async () => {
    if (!(await isModuleEnabled(REQUIRED_MODULE))) {
      logModuleDisabled(REQUIRED_MODULE, 'beforeAll');
      return;
    }

    jest.setTimeout(240 * 1000);
    try {
      await testBundleInstaller.install();
    } catch (err) {
      await testBundleInstaller.cleanup();
      throw new Error('Failed to install test bundle:', err);
    }

    await retry(async () => {
      const data = await common.beforeAll();
      browser = data.browser;
      page = data.page;
    });
  });

  afterAll(async () => {
    if (!(await isModuleEnabled(REQUIRED_MODULE))) {
      logModuleDisabled(REQUIRED_MODULE, 'afterAll');
      return;
    }

    await testBundleInstaller.cleanup();
    if (browser) {
      await browser.close();
    }
  });

  testPluggable(
    REQUIRED_MODULE,
    'Check if `Testing bundle` is on the list and has details',
    async () => {
      // Hardcodes for specific test
      const exampleServiceClassNameAndProvider = configExampleServiceClassNameAndProvider;
      const exampleServiceClassButton = configExampleServiceClassButton;
      const catalogExpectedHeader = configCatalogExpectedHeader;

      // consts
      const catalogHeaderSelector = catalog.prepareSelector('toolbar-header');
      const filterDropdownButton = catalog.prepareSelector('toggle-filter');
      const activeFiltersWrapper = catalog.prepareSelector(
        'active-filters-wrapper',
      );
      const clearAllFiltersButton = catalog.prepareSelector(
        'clear-all-filters',
      );

      const localButton = catalog.prepareSelector('filter-item-basic-local');
      const localButtonName = 'local';
      const exampleServiceClassTitleAndProvider = catalog.prepareSelector(
        'service-title-and-provider',
      );
      const exampleServiceClassDescription = catalog.prepareSelector(
        'service-description',
      );
      const exampleServiceClassLastUpdate = catalog.prepareSelector(
        'service-last-update',
      );

      console.log('Check if `Testing bundle` is on the list');
      await Promise.all([
        page.goto(address.console.getCatalog(TEST_NAMESPACE)),
        page.waitForNavigation({
          waitUntil: ['domcontentloaded', 'networkidle0'],
        }),
      ]);
      const frame = await kymaConsole.getFrame(page);
      await frame.waitForSelector(catalogHeaderSelector);
      const catalogHeader = await frame.$eval(
        catalogHeaderSelector,
        item => item.innerHTML,
      );
      expect(catalogHeader).toContain(catalogExpectedHeader);

      const currentServices = await catalog.getServices(frame);
      expect(currentServices).toContain(exampleServiceClassNameAndProvider);

      // Check if `Testing bundle` is on the list after applying basic `local` filter and make sure information about what filters are applied are visible
      await frame.click(filterDropdownButton);

      await frame.click(localButton);
      await frame.waitFor(activeFiltersWrapper);
      const currectActiveFilters = await catalog.getActiveFilters(frame);
      expect(currectActiveFilters).toContain(localButtonName);
      expect(currectActiveFilters.length).toEqual(1);

      const searchedLocalServices = await catalog.getServices(frame);
      expect(searchedLocalServices).toContain(
        exampleServiceClassNameAndProvider,
      );
      await frame.click(clearAllFiltersButton);
      const currectActiveFiltersAfterClear = await catalog.getActiveFilters(
        frame,
      );
      expect(currectActiveFiltersAfterClear.length).toEqual(0);

      // See details of the class and confirm all necessary fields  are there
      const testingBundle = await frame.$(exampleServiceClassButton);
      await Promise.all([
        testingBundle.click(),
        frame.waitForNavigation({
          waitUntil: ['domcontentloaded', 'networkidle0'],
        }),
      ]);
      const frame2 = await kymaConsole.getFrame(page);
      await frame2.waitForSelector(exampleServiceClassTitleAndProvider);
      const titleAndProvider = await frame2.$(
        exampleServiceClassTitleAndProvider,
      );
      const description = await frame2.$(exampleServiceClassDescription);
      const lastUpdate = await frame2.$(exampleServiceClassLastUpdate);
      const labels = await catalog.getLabels(frame);
      expect(titleAndProvider.toString()).not.toBeNull();
      expect(description.toString()).not.toBeNull();
      expect(lastUpdate.toString()).not.toBeNull();
      expect(labels).toContain(localButtonName);
    },
  );

  testPluggable(
    REQUIRED_MODULE,
    'Provision `Testing bundle` with `Minimal` plan and check confirmation link',
    async () => {
      // Hardcodes for specific test
      const instancePlan = configInstancePlan;
      const instanceTitle = configInstanceTitle;
      const exampleServiceClassName = configExampleServiceClassName;
      const catalogExpectedHeader = configCatalogExpectedHeader;

      // consts
      const notificationLink = `a[${
        config.catalogTestingAtribute
      }="notification-success"]`;
      const exampleInstanceServiceClass = catalog.prepareSelector(
        'instance-service-class',
      );
      const addInstanceButton = catalog.prepareSelector('add-instance');
      const instancesUrl = address.console.getInstancesList(TEST_NAMESPACE);
      const catalogHeaderSelector = catalog.prepareSelector('toolbar-header');

      console.log('Provision `Testing bundle` with `Minimal` plan');
      await retry(async () => {
        await page.reload({ waitUntil: ['domcontentloaded', 'networkidle0'] });
        await catalog.createInstance(page, instancePlan, instanceTitle);
      });

      const frame = await kymaConsole.getFrame(page);

      console.log(
        'Click on the provision confirmation link and confirm you were redirected to instance details page directly',
      );
      const notification = await frame.waitForSelector(notificationLink, {
        visible: true,
      });
      await Promise.all([
        notification.click(),
        page.waitForNavigation({
          waitUntil: ['domcontentloaded', 'networkidle0'],
        }),
      ]);
      let frame2, serviceClass;
      await retry(async () => {
        await page.reload({ waitUntil: ['domcontentloaded', 'networkidle0'] });
        frame2 = await kymaConsole.getFrame(page);
        serviceClass = await frame2.$eval(
          exampleInstanceServiceClass,
          item => item.innerHTML,
        );
      });

      expect(serviceClass).toContain(exampleServiceClassName);

      console.log(
        'Go to main Instances list view and click `Add Instance` link and confirm you went to catalog',
      );
      await Promise.all([
        page.goto(instancesUrl),
        page.waitForNavigation({
          waitUntil: ['domcontentloaded', 'networkidle0'],
        }),
      ]);

      const frame3 = await kymaConsole.getFrame(page);
      const goToCatalog = await frame3.waitForSelector(addInstanceButton);
      await Promise.all([
        goToCatalog.click(),
        page.waitForNavigation({
          waitUntil: ['domcontentloaded', 'networkidle0'],
        }),
      ]);

      let frame4, catalogHeader;
      await retry(async () => {
        try {
          await page.reload({
            waitUntil: ['domcontentloaded', 'networkidle0'],
          });
          frame4 = await kymaConsole.getFrame(page);
          catalogHeader = await frame4.$eval(
            catalogHeaderSelector,
            item => item.innerHTML,
          );
        } catch (e) {
          console.log(document.documentElement.innerHTML);
          throw e;
        }
      });

      expect(catalogHeader).toContain(catalogExpectedHeader);

      console.log('Confirm that indicator of provisioned instances shows 1');
      const numberOfInstances = await catalog.getNumberOfInstancesStatus(
        frame4,
      );
      expect(numberOfInstances).toContain('1');
    },
  );

  testPluggable(
    REQUIRED_MODULE,
    'Provision `Testing bundle` with `Full` plan and check confirmation link',
    async () => {
      // Hardcodes for specific test
      const exampleServiceClassButton = configExampleServiceClassButton;
      const instancesExpectedHeader = configInstancesExpectedHeader;
      const instancePlan = configInstancePlan2;
      const instanceTitle = configInstanceTitle2;
      const instanceLabel = configInstanceLabel;
      const additionalData = configAdditionalData;
      const planName = configPlanName;

      // consts
      const instancesUrl = address.console.getInstancesList(TEST_NAMESPACE);

      const labelButton = catalog.prepareSelector(`filter-${instanceLabel}`);
      const exampleServiceClassTitleAndProvider = catalog.prepareSelector(
        'service-title-and-provider',
      );
      const instancesHeaderSelector = catalog.prepareSelector('toolbar-header');
      const filterDropdownButton = catalog.prepareSelector('toggle-filter');
      const servicePlanButton = catalog.prepareSelector('service-plan');
      const servicePlanContentSelector = catalog.prepareSelector(
        'service-plan-content',
      );
      const closeModalSelector = '.fd-modal__close';

      const frame = await kymaConsole.getFrame(page);
      const testingBundle = await frame.$(exampleServiceClassButton);
      await Promise.all([
        testingBundle.click(),
        frame.waitForNavigation({
          waitUntil: ['domcontentloaded', 'networkidle0'],
        }),
      ]);
      const frame2 = await kymaConsole.getFrame(page);
      await frame2.waitForSelector(exampleServiceClassTitleAndProvider);

      console.log('Provision `Testing bundle` with `Full` plan');
      await retry(async () => {
        await page.reload({ waitUntil: ['domcontentloaded', 'networkidle0'] });
        await catalog.createInstance(
          page,
          instancePlan,
          instanceTitle,
          instanceLabel,
          additionalData,
          planName,
        );
      });

      console.log('Navigate manually to instances list');
      await Promise.all([
        page.goto(instancesUrl),
        page.waitForNavigation({
          waitUntil: ['domcontentloaded', 'networkidle0'],
        }),
      ]);

      let frame3, instancesHeader;
      await retry(async () => {
        try {
          await page.reload({
            waitUntil: ['domcontentloaded', 'networkidle0'],
          });
          frame3 = await kymaConsole.getFrame(page);
          instancesHeader = await frame3.$eval(
            instancesHeaderSelector,
            item => item.innerHTML,
          );
        } catch (e) {
          console.log(document.documentElement.innerHTML);
          throw e;
        }
      });

      expect(instancesHeader).toContain(instancesExpectedHeader);

      console.log('Validate instances list');
      const allInstances = await catalog.getInstances(frame3);
      expect(allInstances.length).toEqual(2);

      await frame3.click(filterDropdownButton);
      await frame3.click(labelButton);

      const filteredInstances = await catalog.getInstances(frame3);
      expect(filteredInstances.length).toEqual(1);

      await frame3.click(servicePlanButton);
      const servicePlanContent = await frame3.$eval(
        servicePlanContentSelector,
        item => item.innerHTML,
      );

      expect(servicePlanContent).toContain(additionalData);
      expect(servicePlanContent).toContain(planName);

      const closeModalButton = await frame3.$(closeModalSelector);
      await closeModalButton.click();
    },
  );

  testPluggable(REQUIRED_MODULE, 'Check `minimal` plan details', async () => {
    // Hardcodes for specific test
    const instanceTitle = configInstanceTitle;
    const exampleInstanceLink = catalog.prepareSelector(
      `instance-name-${instanceTitle}`,
    );

    // consts
    const exampleInstanceServiceClass = catalog.prepareSelector(
      'instance-service-class',
    );
    const exampleInstanceServicePlan = catalog.prepareSelector(
      'instance-service-plan',
    );
    const exampleInstanceStatusType = catalog.prepareSelector(
      'instance-status-type',
    );

    console.log('Go to details of instance created with `minimal` plan');
    let frame, minimalPlanInstance;
    await retry(async () => {
      try {
        await Promise.all([
          await page.reload({
            waitUntil: ['domcontentloaded', 'networkidle0'],
          }),
          (frame = await kymaConsole.getFrame(page)),
          (minimalPlanInstance = await frame.waitForSelector(
            exampleInstanceLink,
            {
              visible: true,
            },
          )),
          minimalPlanInstance.click(),
          frame.waitForNavigation({
            waitUntil: ['domcontentloaded', 'networkidle0'],
          }),
        ]);
      } catch (e) {
        console.log(document.documentElement.innerHTML);
        throw e;
      }
    });

    console.log('Confirm all necessary fields');
    await frame.waitForSelector(exampleInstanceServiceClass);
    const serviceClass = await frame.$(exampleInstanceServiceClass);
    const servicePlan = await frame.$(exampleInstanceServicePlan);
    const statusType = await frame.$(exampleInstanceStatusType);

    expect(serviceClass.toString()).not.toBeNull();
    expect(servicePlan.toString()).not.toBeNull();
    expect(statusType.toString()).not.toBeNull();
  });

  testPluggable(REQUIRED_MODULE, 'Check `full` plan details', async () => {
    // Hardcodes for specific test
    const instanceTitle = configInstanceTitle2;
    const exampleInstanceLink = catalog.prepareSelector(
      `instance-name-${instanceTitle}`,
    );
    const instanceLabel = configInstanceLabel;

    const instancesUrl = address.console.getInstancesList(TEST_NAMESPACE);

    // consts
    const exampleInstanceServiceClass = catalog.prepareSelector(
      'instance-service-class',
    );
    const exampleInstanceServicePlan = catalog.prepareSelector(
      'instance-service-plan',
    );
    const exampleInstanceStatusType = catalog.prepareSelector(
      'instance-status-type',
    );

    console.log('Go to details of instance created with `full` plan');
    await Promise.all([
      page.goto(instancesUrl),
      page.waitForNavigation({
        waitUntil: ['domcontentloaded', 'networkidle0'],
      }),
    ]);
    let frame, fullPlanInstance;
    await retry(async () => {
      try {
        await Promise.all([
          await page.reload({
            waitUntil: ['domcontentloaded', 'networkidle0'],
          }),
          (frame = await kymaConsole.getFrame(page)),
          (fullPlanInstance = await frame.waitForSelector(exampleInstanceLink, {
            visible: true,
          })),
          fullPlanInstance.click(),
          frame.waitForNavigation({
            waitUntil: ['domcontentloaded', 'networkidle0'],
          }),
        ]);
      } catch (e) {
        console.log(document.documentElement.innerHTML);
        throw e;
      }
    });

    console.log('Confirm all necessary fields');
    await frame.waitForSelector(exampleInstanceServiceClass);
    const serviceClass = await frame.$(exampleInstanceServiceClass);
    const servicePlan = await frame.$(exampleInstanceServicePlan);
    const statusType = await frame.$(exampleInstanceStatusType);
    const labels = await catalog.getLabels(frame);

    expect(serviceClass.toString()).not.toBeNull();
    expect(servicePlan.toString()).not.toBeNull();
    expect(statusType.toString()).not.toBeNull();

    expect(labels).toContain(instanceLabel);
  });

  testPluggable(REQUIRED_BINDING_MODULE, 'Check credentials', async () => {
    // Hardcodes for specific test
    const additionalData = configBindingAdditionalData;

    // consts
    const serviceBindingCredentialsTab = catalog.prepareSelector(
      'service-binding-tab',
    );
    const serviceBindingTab = catalog.prepareSelector(
      'service-binding-usage-tab',
    );

    const credentialName = catalog.prepareSelector('credential-name');
    const credentialStatus = catalog.prepareSelector('status-service-binding');

    const secretSelector = catalog.prepareSelector('secret-button');
    const secretEncodedSelector = catalog.prepareSelector('secret-encoded');
    const secretDecodedSelector = catalog.prepareSelector('secret-decoded');
    const decodeButton = catalog.prepareSelector('button-decode');
    const parametersSelector = catalog.prepareSelector('parameters-button');
    const parametersContentSelector = catalog.prepareSelector(
      'parameters-content',
    );

    const closeModalSelector = '.fd-modal__close';

    console.log(
      'Go to Credentials tab and create credentials and fill in the schema form',
    );
    const frame = await kymaConsole.getFrame(page);
    await frame.waitForSelector(serviceBindingCredentialsTab);
    await frame.click(serviceBindingCredentialsTab);

    await catalog.createCredentials(page, additionalData);

    await frame.waitForSelector(credentialName);
    const allCredentials = await catalog.getCredentials(frame);
    expect(allCredentials.length).toEqual(1);

    await frame.waitForSelector(secretSelector);
    await frame.click(secretSelector);

    await frame.waitForSelector(secretEncodedSelector);
    const secretEncodedContent = await frame.$eval(
      secretEncodedSelector,
      item => item.innerHTML,
    );

    expect(secretEncodedContent).toContain('***');

    await frame.click(decodeButton);
    const secretDecodedContent = await frame.$eval(
      secretDecodedSelector,
      item => item.innerHTML,
    );

    expect(secretDecodedContent).not.toContain('***');

    const closeSecretCredModalButton = await frame.$(closeModalSelector);
    await closeSecretCredModalButton.click();

    await frame.waitForSelector(parametersSelector);
    await frame.click(parametersSelector);
    const parametersContent = await frame.$eval(
      parametersContentSelector,
      item => item.innerHTML,
    );

    expect(parametersContent).toContain(additionalData);

    const closeParametersModalButton = await frame.$(closeModalSelector);
    await closeParametersModalButton.click();

    console.log(
      'Go to Bound Applications tab and confirm that in Credentials tab you see (1)',
    );
    await frame.waitForSelector(serviceBindingTab);
    await frame.click(serviceBindingTab);

    await frame.waitForSelector(credentialStatus);
    const credentialsStatuses = await catalog.getCredentialsStatus(frame);
    expect(credentialsStatuses).toContain('1');
  });

  testPluggable(
    REQUIRED_BINDING_MODULE,
    'Check bindings with `full` plan',
    async () => {
      // Hardcodes for specific test
      const resource = configBindingResource;
      const prefix = configBindingPrefix;

      // consts
      const bindingName = catalog.prepareSelector('binding-name');

      const secretSelector = catalog.prepareSelector('secret-button');
      const secretEncodedSelector = catalog.prepareSelector('secret-encoded');
      const secretDecodedSelector = catalog.prepareSelector('secret-decoded');
      const secretPrefixSelector = catalog.prepareSelector('secret-prefix');
      const decodeButton = catalog.prepareSelector('button-decode');

      const closeModalSelector = '.fd-modal__close';

      const frame = await kymaConsole.getFrame(page);
      await catalog.bindApplication(page, resource, prefix);

      await frame.waitForSelector(bindingName);
      const allBindings = await catalog.getBindings(frame);
      expect(allBindings.length).toEqual(1);

      await frame.waitForSelector(secretSelector);
      await frame.click(secretSelector);

      await frame.waitForSelector(secretEncodedSelector);
      const secretBindingEncodedContent = await frame.$eval(
        secretEncodedSelector,
        item => item.innerHTML,
      );

      expect(secretBindingEncodedContent).toContain('***');

      await frame.click(decodeButton);
      const secretBindingDecodedContent = await frame.$eval(
        secretDecodedSelector,
        item => item.innerHTML,
      );

      expect(secretBindingDecodedContent).not.toContain('***');

      const secretPrefixContent = await frame.$eval(
        secretPrefixSelector,
        item => item.innerHTML,
      );

      expect(secretPrefixContent).toContain(prefix);

      const closeSecretModalButton = await frame.$(closeModalSelector);
      await closeSecretModalButton.click();

      await catalog.deleteBinding(page);
    },
  );

  testPluggable(
    REQUIRED_BINDING_MODULE,
    'Check bindings with `minimal` plan',
    async () => {
      // Hardcodes for specific test
      const additionalData = configBindingAdditionalData;
      const resource = configBindingResource;

      // consts
      const bindingName = catalog.prepareSelector('binding-name');
      const credentialStatus = catalog.prepareSelector(
        'status-service-binding',
      );

      const frame = await kymaConsole.getFrame(page);

      await catalog.bindApplication(page, resource, null, additionalData);

      await frame.waitForSelector(bindingName);
      const newBindings = await catalog.getBindings(frame);
      expect(newBindings.length).toEqual(1);

      await frame.waitForSelector(credentialStatus);
      const credentialsNewStatuses = await catalog.getCredentialsStatus(frame);
      expect(credentialsNewStatuses).toContain('2');
    },
  );

  testPluggable(REQUIRED_BINDING_MODULE, 'Delete bindings', async () => {
    const serviceBindingCredentialsTab = catalog.prepareSelector(
      'service-binding-tab',
    );

    const frame = await kymaConsole.getFrame(page);
    await frame.waitForSelector(serviceBindingCredentialsTab);
    await frame.click(serviceBindingCredentialsTab);

    await catalog.deleteCredentials(page);
    await catalog.deleteCredentials(page);
  });
});
