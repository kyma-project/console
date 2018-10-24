import waitForNavigationAndContext from '../utils/waitForNavigationAndContext';
import request from 'request';
import address from '../utils/address';

async function login(page, config) {
  await loginViaDex(page, config);
  return await page.waitForSelector('.sf-header');
}

async function getEnvironments(page) {
  return await page.evaluate(() => {
    const environmentsArraySelector =
      '.sf-dropdown .tn-dropdown__menu .tn-dropdown__item';
    const envs = Array.from(
      document.querySelectorAll(environmentsArraySelector)
    );
    return envs.map(env => env.textContent);
  });
}

async function getRemoteEnvironments(page) {
  return await page.evaluate(() => {
    const remoteEnvironmentsSelector = '.remoteenv-name';
    const envs = Array.from(
      document.querySelectorAll(remoteEnvironmentsSelector)
    );
    return envs.map(env => env.textContent);
  });
}

async function getFrame(page) {
  return await page.frames().find(f => f.name() === 'frame');
}

function clearData(token, env) {
  const req = {
    url: address.api.getNamespace(env),
    method: 'DELETE',
    headers: { Authorization: token },
    // TODO: Analyze problem with UNABLE_TO_VERIFY_LEAF_SIGNATURE
    rejectUnauthorized: false
  };

  return new Promise((resolve, reject) => {
    request(req, (error, response) => {
      if (error) {
        reject(error);
      }

      if (response) {
        console.log(`Removing ${env} environment`);
        resolve(response);
      }
    });
  });
}

async function createEnvironment(page, name) {
  // consts
  const dropdownButton = '.tn-dropdown__control';
  const dropdownMenu = '.tn-dropdown.sf-dropdown > .tn-dropdown__menu';
  const createEnvBtn = '.open-create-env-modal';
  const createEnvModal = '.sf-modal.sf-modal--min';
  const createBtn = '.env-create-btn';
  const envNameInput = 'input[name=environmentName].tn-form__control';

  await page.waitForSelector(dropdownButton);
  await page.click(dropdownButton);
  await page.waitForSelector(dropdownMenu, { visible: true });
  await page.click(dropdownButton);
  await page.click(createEnvBtn);
  await page.waitFor(createEnvModal);
  await page.focus(envNameInput);
  await page.type(envNameInput, name);
  await page.click(createBtn);
  await page.waitForSelector(createEnvModal, { hidden: true });
  await page.reload({ waitUntil: 'networkidle0' });
  await waitForNavigationAndContext(page);

  const environments = await getEnvironments(page);
  expect(environments).toContain(name);
}

async function createRemoteEnvironment(page, name) {
  // consts
  const createEnvBtn = '.open-create-env-modal';
  const createEnvModal = '.sf-modal.sf-modal--min';
  const nameInput = 'input[name=remoteEnvName]';
  const descriptionInput = 'input[name=remoteEnvDescription]';
  const labelsInput = 'input[name=labelsInput]';
  const createButton = '.tn-modal__button-primary';

  await page.click(createEnvBtn);
  await page.waitFor(createEnvModal);
  await page.focus(nameInput);
  await page.type(nameInput, name);
  await page.focus(descriptionInput);
  await page.type(descriptionInput, name);
  await page.focus(labelsInput);
  await page.type(labelsInput, '1:1');
  await page.click(createButton);
  await page.waitForSelector(createEnvModal, { hidden: true });
}

async function deleteRemoteEnvironment(page, name) {
  const remoteEnvironmentsSelector = '.row.sf-list__body';
  const deleteActionSelector = `.tn-dropdown__item[name=Delete]`;
  const modalSelector = '.sf-modal';
  await page.$$eval(
    remoteEnvironmentsSelector,
    (item, name) => {
      const testRemoteEnvironment = item.find(row =>
        row.textContent.includes(name)
      );
      const actionsSelector = '.tn-icon';
      testRemoteEnvironment.querySelector(actionsSelector).click();
    },
    name
  );
  await page.waitForSelector(deleteActionSelector);
  await page.evaluate(() => {
    const deleteActionSelector = `.tn-dropdown__item[name=Delete]`;
    document.querySelector(deleteActionSelector).click();
  });
  await page.waitForSelector(modalSelector);
}

async function openLink(page, name) {
  const navItem = 'a.sf-toolbar__item';

  await page.$$eval(
    navItem,
    (item, name) => {
      item.find(text => text.innerText.includes(name)).click();
    },
    name
  );

  await page.reload({ waitUntil: 'networkidle0' });
  await waitForNavigationAndContext(page);
}

async function goTo(page, element, link) {
  const linkHandlers = await page.$x(
    `//${element}[contains(text(), '${link}')]`
  );
  if (linkHandlers.length > 0) {
    await linkHandlers[0].click();
  } else {
    throw new Error(`Link not found`);
  }
}

async function loginViaDex(page, config) {
  const loginButtonSelector = '.dex-btn';
  console.log(`Trying to log in ${config.login} via dex`);
  await page.reload({ waitUntil: 'networkidle0' });
  await page.type('#login', config.login);
  await page.type('#password', config.password);
  return await page.click(loginButtonSelector);
}

module.exports = {
  login,
  getEnvironments,
  getRemoteEnvironments,
  getFrame,
  clearData,
  createEnvironment,
  createRemoteEnvironment,
  deleteRemoteEnvironment,
  openLink,
  goTo
};
