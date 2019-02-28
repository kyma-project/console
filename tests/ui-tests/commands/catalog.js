import config from '../config';
import kymaConsole from '../commands/console';

module.exports = {
  createInstance: async (
    page,
    instancePlan,
    instanceTitle,
    instanceLabel,
    instanceAdditionalData,
    instancePlanName
  ) => {
    try {
      const addToEnvButton = `[${config.catalogTestingAtribute}="add-to-env"]`;
      const modal = '.fd-modal';
      const nameServiceInstancesInput = `[name="nameServiceInstances"]`;
      const labels = `[name="nameServiceBindingUsage"]`;
      const plan = `[name="selectedKind"]`;
      const additionalData = '#root_additionalData';
      const planName = '#root_planName';
      const modalCreate = `[${
        config.catalogTestingAtribute
      }="modal-confirmation-button"]`;

      const frame = await kymaConsole.getFrame(page);
      await frame.click(addToEnvButton);
      await frame.waitForSelector(modal, { visible: true });

      await select(frame, plan, instancePlan);

      if (instanceTitle) {
        const classTitle = await frame.$(nameServiceInstancesInput);

        await classTitle.focus();
        await classTitle.click({ clickCount: 3 });
        await classTitle.type(instanceTitle);
      }

      if (instanceLabel) {
        const classLabel = await frame.$(labels);

        await classLabel.focus();
        await classLabel.click({ clickCount: 3 });
        await classLabel.type(instanceLabel);
      }
      if (instanceAdditionalData) {
        const classData = await frame.$(additionalData);

        await classData.focus();
        await classData.type(instanceAdditionalData);
      }
      if (instancePlanName) {
        const classPlanName = await frame.$(planName);

        await classPlanName.focus();
        await classPlanName.type(instancePlanName);
      }
      const create = await frame.waitForSelector(modalCreate);
      await create.click();
    } catch (e) {
      console.log('Create instance failed');
      throw e;
    }
  },
  createCredentials: async (page, additionalData) => {
    try {
      const createCredentialsButton = `[${
        config.catalogTestingAtribute
      }="create-credentials"]`;
      const modal = '.fd-modal';
      const additionalDataInput = '#root_exampleField';
      const modalCreate = `[${
        config.catalogTestingAtribute
      }="modal-confirmation-button"]`;

      const frame = await kymaConsole.getFrame(page);
      await frame.click(createCredentialsButton);
      await frame.waitForSelector(modal, { visible: true });

      if (additionalData) {
        const additionalDataField = await frame.$(additionalDataInput);
        await additionalDataField.focus();
        await additionalDataField.type(additionalData);
      }

      const create = await frame.waitForSelector(modalCreate);
      await create.click();
    } catch (e) {
      console.log('Create credentials failed');
      throw e;
    }
  },
  bindApplication: async (page, resource, prefix, additionalData) => {
    try {
      const bindAplicationButton = `[${
        config.catalogTestingAtribute
      }="create-service-binding"]`;
      const modal = '.fd-modal';
      const resourcesInput = `[name="selectedResource"]`;
      const prefixInput = `[name="prefixEnvironmentValue"]`;
      const existingBindingInput = `[name="selectedExistingBinding"]`;
      const additionalDataInput = '#root_exampleField';

      const setPrefixButton = `[${config.catalogTestingAtribute}="set-prefix"]`;
      const selectExistingCredButton = `[${
        config.catalogTestingAtribute
      }="select-existing-cred"]`;

      const modalCreate = `[${
        config.catalogTestingAtribute
      }="modal-confirmation-button"]`;

      const frame = await kymaConsole.getFrame(page);
      await frame.click(bindAplicationButton);
      await frame.waitForSelector(modal, { visible: true });

      await select(frame, resourcesInput, resource, true);

      if (prefix) {
        const prefixButton = await frame.$(setPrefixButton);
        await prefixButton.click();

        const bindingPrefix = await frame.$(prefixInput);
        await bindingPrefix.focus();
        await bindingPrefix.type(prefix);
      }

      if (additionalData) {
        const dataButton = await frame.$(additionalDataInput);
        await dataButton.focus();
        await dataButton.type(additionalData);
      } else {
        const selectButton = await frame.$(selectExistingCredButton);
        await selectButton.click();

        await select(frame, existingBindingInput, '-', true);
      }

      const create = await frame.waitForSelector(modalCreate);
      await create.click();
    } catch (e) {
      console.log('Bind application failed');
      throw e;
    }
  },
  deleteBinding: async page => await confirmModal(page),
  deleteCredentials: async page => await confirmModal(page),
  feelInInput: async (frame, searchByText, searchId) => {
    try {
      const searchSelector = `[${config.catalogTestingAtribute}=${searchId}]`;
      const searchInput = await frame.$(searchSelector);
      await searchInput.focus();
      await searchInput.click({ clickCount: 3 });
      await searchInput.press('Backspace');
      await searchInput.type(searchByText);
    } catch (e) {
      console.log(document.documentElement.innerHTML);
      throw e;
    }
  },
  getInstances: async page => await getElements(page, 'instance-name'),
  getServices: async page => await getElements(page, 'card-title'),
  getFilters: async page => await getElements(page, 'filter-item'),
  getLabels: async page => await getElements(page, 'service-label'),
  getActiveFilters: async page => await getElements(page, 'active-filter'),
  getCredentials: async page => await getElements(page, 'credential-name'),
  getBindings: async page => await getElements(page, 'binding-name'),
  getCredentialsStatus: async page =>
    await getElements(page, 'status-service-binding'),
  getBindingsStatus: async page =>
    await getElements(page, 'status-service-binding-usage'),
  getNumberOfInstancesStatus: async page =>
    await getElements(page, 'instances-provisioned-testing-bundle'),
  prepareSelector: name => `[${config.catalogTestingAtribute}="${name}"]`
};
async function confirmModal(page) {
  try {
    const deleteBindingButton = `[${
      config.catalogTestingAtribute
    }="delete-button"]`;
    const modal = '.fd-modal';

    const modalDelete = `[${
      config.catalogTestingAtribute
    }="modal-confirmation-button"]`;

    const frame = await kymaConsole.getFrame(page);
    await frame.click(deleteBindingButton);
    await frame.waitForSelector(modal, { visible: true });

    const doDelete = await frame.waitForSelector(modalDelete);
    await doDelete.click();
  } catch (e) {
    console.log('Confirm modal function failed');
    throw e;
  }
}
async function getElements(page, e2eIdName) {
  try {
    return await page.evaluate(
      (config, e2eIdName) => {
        const elementArraySelector = `[${
          config.catalogTestingAtribute
        }=${e2eIdName}]`;
        const elements = Array.from(
          document.querySelectorAll(elementArraySelector)
        );
        return elements.map(item => item.textContent);
      },
      config,
      e2eIdName
    );
  } catch (e) {
    console.log(document.documentElement.innerHTML);
    throw e;
  }
}

async function select(page, selectorName, itemName, notEqualMode) {
  const selector = await page.$(selectorName);
  const properties = await selector.getProperties();
  for (const property of properties.values()) {
    const element = property.asElement();
    if (!element) {
      continue;
    }
    const text = await element.getProperty('text');
    const textJson = await text.jsonValue();
    if (
      (!notEqualMode && textJson !== itemName) ||
      (notEqualMode && textJson.indexOf(itemName) === -1)
    ) {
      continue;
    }
    const value = await element.getProperty('value');
    const valueJson = await value.jsonValue();
    await page.select(selectorName, valueJson);
  }
}
