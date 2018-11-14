import config from '../config';
import kymaConsole from '../commands/console';

module.exports = {
  createInstance: async (page, instanceTitle, instanceLabel) => {
    try {
      const addToEnvButton = `[${config.catalogTestingAtribute}="add-to-env"]`;
      const modal = '.ReactModal__Content--after-open';
      const nameServiceInstancesInput = `[name="nameServiceInstances"]`;
      const labels = `[name="nameServiceBindingUsage"]`;
      const plan = `[name="selectedKind"]`;
      const planName = 'Micro';
      const modalCreate = `[${config.catalogTestingAtribute}="modal-create"]`;

      const frame = await kymaConsole.getFrame(page);
      await frame.click(addToEnvButton);
      await frame.waitForSelector(modal, { visible: true });

      const classTitle = await frame.$(nameServiceInstancesInput);

      await classTitle.focus();
      await classTitle.click({ clickCount: 3 });
      await classTitle.type(instanceTitle);

      await select(frame, plan, planName);

      const classLabel = await frame.$(labels);

      await classLabel.focus();
      await classLabel.click({ clickCount: 3 });
      await classLabel.type(instanceLabel);

      const create = await frame.waitForSelector(modalCreate);
      await create.click();
    } catch (e) {
      console.log(document.documentElement.innerHTML);
      throw e;
    }
  },
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
  getActiveFilters: async page => await getElements(page, 'active-filter'),
  prepareSelector: name => `[${config.catalogTestingAtribute}="${name}"]`
};

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

async function select(page, selectorName, itemName) {
  const selector = await page.$(selectorName);

  const properties = await selector.getProperties();
  for (const property of properties.values()) {
    const element = property.asElement();
    if (element) {
      const hText = await element.getProperty('text');
      const text = await hText.jsonValue();
      if (text === itemName) {
        const hValue = await element.getProperty('value');
        const value = await hValue.jsonValue();
        await page.select(selectorName, value); // or use 58730
        console.log(`Selected ${text} which is value ${value}.`);
      }
    }
  }
}
