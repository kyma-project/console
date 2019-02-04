import request from 'request';
import address from '../utils/address';
import common from './common';
import config from '../config';

async function testLogin(page) {
  await login(page, config);

  // as title is configurable, test need to check something else
  await page.waitForSelector('.fd-shellbar', { visible: true });
}

async function _loginViaDex(page, config) {
  const loginButtonSelector = '.dex-btn';
  console.log(`Trying to log in ${config.login} via dex`);
  try {
    await page.reload({
      waitUntil: ['domcontentloaded', 'networkidle0']
    });
    await page.waitForSelector('#login');
    await page.type('#login', config.login);
    await page.waitForSelector('#password');
    await page.type('#password', config.password);
    await page.waitForSelector(loginButtonSelector);
    return Promise.all([
      page.click(loginButtonSelector),
      page.waitForNavigation({
        waitUntil: ['domcontentloaded', 'networkidle0']
      })
    ]);
  } catch (err) {
    throw new Error(`Couldn't log in`, err);
  }
}

async function login(page, config) {
  await _loginViaDex(page, config);
  const headerSelector = '.fd-shellbar';
  try {
    await page.waitForSelector(headerSelector);
  } catch (err) {
    console.error(err);
    console.log('Trying to obtain error message');
    await obtainLoginErrorMessage();
  }

  async function obtainLoginErrorMessage() {
    await page.waitForSelector('#login-error');
    const loginError = await page.evaluate(
      () => document.querySelector('#login-error').textContent
    );
    throw new Error(
      `Page returned following error message: ${loginError.trim()}`
    );
  }
}

async function getFrame(page) {
  return page.frames().find(frame => frame.parentFrame() !== null);
}

async function openLinkOnFrame(page, element, name) {
  const frame = await getFrame(page);
  return frame.$$eval(
    element,
    (item, name) => {
      item.find(text => text.innerText.includes(name)).click();
    },
    name
  );
}

async function openLink(page, element, name) {
  return Promise.all([
    page.$$eval(
      element,
      (item, name) => {
        item.find(text => text.innerText.includes(name)).click();
      },
      name
    )
  ]);
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

async function getEnvironmentsFromContextSwitcher(page) {
  return await page.evaluate(() => {
    const menuListContainer = document.querySelector('ul#context_menu_middle');
    const environmentsArraySelector = 'li > a';
    const envs = Array.from(
      menuListContainer.querySelectorAll(environmentsArraySelector)
    );
    return envs.map(env => env.textContent);
  });
}

async function getEnvironmentNamesFromEnvironmentsPage(page) {
  return await getNamesOnCurrentPage(page, '.tn-card__header');
}

async function getRemoteEnvironmentNames(page) {
  return await getNamesOnCurrentPage(page, '.remoteenv-name');
}

async function getNamesOnCurrentPage(page, nameSelector) {
  const frame = await getFrame(page);
  return await frame.$$eval(nameSelector, nameComponents => {
    const envs = Array.from(nameComponents);
    return envs.map(env => env.textContent);
  });
}

async function getTextContentOnFrameBySelector(frame, selector) {
  const text = await frame.$eval(selector, component => {
    return component.textContent;
  });
  return text;
}

async function createEnvironment(page, name) {
  const frame = await getFrame(page);
  const createEnvModal = '.sf-modal.sf-modal--min';
  const createBtn = '.env-create-btn';
  const envNameInput = 'input[name=environmentName].tn-form__control';
  const createButtonSelector = '.open-create-env-modal';

  await frame.waitForSelector(createButtonSelector);
  await frame.click(createButtonSelector);
  await frame.waitFor(createEnvModal);
  await frame.focus(envNameInput);
  await frame.type(envNameInput, name);
  await frame.click(createBtn);
  return frame.waitForSelector(createEnvModal, { hidden: true });
}

async function deleteEnvironment(page, envName) {
  const frame = await getFrame(page);
  const deleteConfirmButton =
    '.tn-modal__button-primary.sf-button--primary.tn-button--small';
  const dropDownCard = `button[aria-controls=${envName}]`;
  await frame.click(dropDownCard);
  await frame.click(`#${envName} li > a[name=Delete]`);
  await frame.waitFor(deleteConfirmButton);
  await frame.click(deleteConfirmButton);
  return frame.waitForSelector(deleteConfirmButton, { hidden: true });
}

async function createRemoteEnvironment(page, name) {
  const frame = await getFrame(page);
  // consts
  const createEnvBtn = '.open-create-env-modal';
  const createEnvModal = '.sf-modal.sf-modal--min';
  const nameInput = 'input[name=remoteEnvName]';
  const descriptionInput = 'input[name=remoteEnvDescription]';
  const labelsInput = 'input[name=labelsInput]';
  const createButton = '.tn-modal__button-primary';

  await frame.click(createEnvBtn);
  await frame.waitFor(createEnvModal);
  await frame.focus(nameInput);
  await frame.type(nameInput, name);
  await frame.focus(descriptionInput);
  await frame.type(descriptionInput, 'This is the Application for testing');
  await frame.focus(labelsInput);
  await frame.type(labelsInput, 'testKey=testValue');
  await frame.click(createButton);
  await frame.waitForSelector(createEnvModal, { hidden: true });
  return frame.waitForXPath(
    `//div[contains(@class, 'remoteenv-name') and contains(string(), "${name}")]`
  );
}

async function deleteRemoteEnvironment(page, name) {
  const frame = await getFrame(page);
  const remoteEnvironmentsSelector = '.row.sf-list__body';
  const modalSelector = '.sf-modal';

  await frame.waitForSelector(remoteEnvironmentsSelector);
  await frame.$$eval(
    remoteEnvironmentsSelector,
    (item, name) => {
      const actionsSelector = `button[aria-controls=${name}]`;
      const deleteActionSelector = `#${name} li > a[name=Delete]`;
      const testRemoteEnvironment = item.find(row =>
        row.textContent.includes(name)
      );
      testRemoteEnvironment.querySelector(actionsSelector).click();
      testRemoteEnvironment.querySelector(deleteActionSelector).click();
    },
    name
  );
  await frame.waitForSelector(modalSelector);
  await frame.evaluate(() => {
    const deleteButton = `.tn-modal__button-primary.sf-button--primary.tn-button--small`;
    document.querySelector(deleteButton).click();
  });
  console.log(`Application ${name} deleted!`);
}

module.exports = {
  login,
  testLogin,
  getFrame,
  openLink,
  openLinkOnFrame,
  clearData,
  getEnvironmentsFromContextSwitcher,
  createEnvironment,
  createRemoteEnvironment,
  deleteRemoteEnvironment,
  getEnvironmentNamesFromEnvironmentsPage,
  deleteEnvironment,
  getRemoteEnvironmentNames,
  getTextContentOnFrameBySelector
};
