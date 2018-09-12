import config from '../config';
import kymaConsole from '../commands/console';
import request from 'request';

module.exports = {
  createInstance: async (page, instanceTitle, instanceLabel) => {
    try {
      const addToEnvButton = `[${config.catalogTestingAtribute}="add-to-env"]`;
      const modal = '.ReactModal__Content--after-open';
      const nameServiceInstancesInput = `[name="nameServiceInstances"]`;
      const labels = `[name="nameServiceBindingUsage"]`;
      const modalCreate = `[${config.catalogTestingAtribute}="modal-create"]`;

      const frame = await kymaConsole.getFrame(page);
      await frame.click(addToEnvButton);
      await frame.waitForSelector(modal, { visible: true });

      const classTitle = await frame.$(nameServiceInstancesInput);

      await classTitle.focus();
      await classTitle.click({ clickCount: 3 });
      await classTitle.type(instanceTitle);

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
  feelInInput: async (frame, searchByText) => {
    try {
      const searchSelector = `[${config.catalogTestingAtribute}="search"]`;
      const searchInput = await frame.$(searchSelector);

      await searchInput.focus();
      await searchInput.click({ clickCount: 3 });
      await searchInput.type(searchByText);
    } catch (e) {
      console.log(document.documentElement.innerHTML);
      throw e;
    }
  },
  getInstances: async page => {
    try {
      return await page.evaluate(config => {
        const instanceArraySelector = `[${
          config.catalogTestingAtribute
        }="instance-name"]`;
        const instances = Array.from(
          document.querySelectorAll(instanceArraySelector)
        );
        return instances.map(instance => instance.textContent);
      }, config);
    } catch (e) {
      console.log(document.documentElement.innerHTML);
      throw e;
    }
  },
  getServices: async page => {
    try {
      return await page.evaluate(config => {
        const serviceArraySelector = `[${
          config.catalogTestingAtribute
        }="card-title"]`;
        const services = Array.from(
          document.querySelectorAll(serviceArraySelector)
        );
        return services.map(service => service.textContent);
      }, config);
    } catch (e) {
      console.log(document.documentElement.innerHTML);
      throw e;
    }
  },
  prepareSelector: name => `[${config.catalogTestingAtribute}="${name}"]`
};
