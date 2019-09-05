import request from 'request';
import address from '../utils/address';
import config from '../config';
import { taggedTemplateExpression } from '@babel/types';

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
      waitUntil: ['domcontentloaded', 'networkidle0'],
    });
    await page.waitForSelector('#login');
    await page.type('#login', config.login);
    await page.waitForSelector('#password');
    await page.type('#password', config.password);
    await page.waitForSelector(loginButtonSelector);
    return Promise.all([
      page.click(loginButtonSelector),
      page.waitForNavigation({
        waitUntil: ['domcontentloaded', 'networkidle0'],
      }),
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
      () => document.querySelector('#login-error').textContent,
    );
    throw new Error(
      `Page returned following error message: ${loginError.trim()}`,
    );
  }
}

async function getFrame(page) {
  return page.frames().find(frame => frame.parentFrame() !== null);
}


const getFrameForApp = (page, appUrl) => {
  return page.frames().find(frame => {
    const frameUrl = frame.url();
    const targetFrameFound = frame.parentFrame() !== null && !frame.isDetached() && frameUrl.indexOf(appUrl) !== -1;
    if(!targetFrameFound){
      console.log(`Target frame for ${appUrl} not found !!!`)
    }
    return targetFrameFound;
  });
};

const waitForAppFrameLoaded = async (page, appUrl) => {

  const timeoutMs = 3000;

  const checkIfAppFrameLoaded = new Promise((resolve, reject) => {
    
  });

  let timeout = new Promise((resolve, reject) => {
    let timeoutId = setTimeout(() => {
      clearTimeout(timeoutId);
      reject(`Waiting for ${appUrl} frame timed out after ${timeoutMs} ms.'`)
    }, timeoutMs)
  });

  return Promise.race([
    checkIfAppFrameLoaded,
    timeout
  ]);

};

async function openLinkOnFrame(page, element, name) {
  const frame = await getFrame(page);
  return frame.$$eval(
    element,
    (item, name) => {
      item.find(text => text.innerText.includes(name)).click();
    },
    name,
  );
}

async function openLink(page, element, name) {
  return Promise.all([
    page.$$eval(
      element,
      (item, name) => {
        item.find(text => text.innerText.includes(name)).click();
      },
      name,
    ),
  ]);
}

function clearData(token, namespace) {
  const req = {
    url: address.api.getNamespace(namespace),
    method: 'DELETE',
    headers: { Authorization: token },
    // TODO: Analyze problem with UNABLE_TO_VERIFY_LEAF_SIGNATURE
    rejectUnauthorized: false,
  };

  return new Promise((resolve, reject) => {
    request(req, (error, response) => {
      if (error) {
        reject(error);
      }

      if (response) {
        console.log(`Removing ${namespace} namespace`);
        resolve(response);
      }
    });
  });
}

async function getNamespacesFromContextSwitcher(page) {
  return await page.evaluate(() => {
    const menuListContainer = document.querySelector('ul#context_menu_middle');
    const namespacesArraySelector = 'li > a';
    const namespaces = Array.from(
      menuListContainer.querySelectorAll(namespacesArraySelector),
    );
    return namespaces.map(namespace => namespace.textContent);
  });
}

async function getNamespaceNamesFromNamespacesPage(page) {
  return await getTextContentOnPageBySelector(
    page,
    '[data-e2e-id=namespace-name]',
  );
}

async function getApplicationNames(page) {
  return await getTextContentOnPageBySelector(
    page,
    '[data-e2e-id=application-name]',
  );
}

async function getTextContentOnPageBySelector(page, nameSelector) {
  const frame = await getFrame(page);
  return await frame.$$eval(nameSelector, nameComponents => {
    const namespaces = Array.from(nameComponents);
    return namespaces.map(namespace => namespace.textContent);
  });
}

async function applyTextSearchFilter(page, searchText) {
  const searchIconSelector = '.sap-icon--search';
  const frame = await getFrame(page);
  await frame.click(searchIconSelector);
  return frame.type('input[type=search]', searchText);
}

async function createNamespace(page, name) {
  const frame = await getFrame(page);
  const createNamespaceModal = '[data-e2e-id=create-namespace-form]';
  const createBtn = '.namespace-create-btn';
  const namespaceNameInput = 'input[name=namespaceName]';
  const createButtonSelector = '.open-create-namespace-modal';

  await frame.waitForSelector(createButtonSelector);
  await frame.click(createButtonSelector);
  await frame.waitFor(createNamespaceModal);
  await frame.focus(namespaceNameInput);
  await frame.type(namespaceNameInput, name);
  await frame.click(createBtn);
  return frame.waitForSelector(createNamespaceModal, { hidden: true });
}

async function deleteNamespace(page, namespaceName) {
  const frame = await getFrame(page);
  const deleteConfirmButton = `[data-e2e-id=confirmation-modal-button-ok]`;
  const dropDownCard = `button[aria-controls=${namespaceName}]`;
  await frame.click(dropDownCard);
  await frame.click(`#${namespaceName} li > a[name=Delete]`);
  await frame.waitFor(deleteConfirmButton);
  await frame.click(deleteConfirmButton);
  return frame.waitForSelector(deleteConfirmButton, { hidden: true });
}

async function createApplication(page, name) {
  const frame = await getFrame(page);
  // consts
  const createNamespaceBtn = '.open-create-namespace-modal';
  const createNamespaceModal = '.fd-modal';
  const nameInput = 'input[name=applicationName]';
  const descriptionInput = 'input[name=applicationDescription]';
  const labelsInput = 'input[name=labelsInput]';
  const createButton = '[data-e2e-id=create-button]';

  await frame.click(createNamespaceBtn);
  await frame.waitFor(createNamespaceModal);
  await frame.focus(nameInput);
  await frame.type(nameInput, name);
  await frame.focus(descriptionInput);
  await frame.type(descriptionInput, 'This is the Application for testing');
  await frame.focus(labelsInput);
  await frame.type(labelsInput, 'testKey=testValue');
  await frame.click(createButton);
  await frame.waitForSelector(createNamespaceModal, { hidden: true });
  return frame.waitForXPath(
    `//a[contains(@data-e2e-id, 'application-name') and contains(string(), "${name}")]`,
  );
}

async function deleteApplication(page, name) {
  const frame = await getFrame(page);
  const applicationsSelector = 'tr';

  await frame.waitForSelector(applicationsSelector);
  const actionsSelector = `button[aria-controls=${name}]`;
  const deleteActionSelector = `#${name} li > a[name=Delete]`;
  await frame.waitForSelector(actionsSelector);
  await frame.click(actionsSelector);
  await frame.waitForSelector(deleteActionSelector);
  await frame.click(deleteActionSelector);

  const deleteButton = '[data-e2e-id=confirmation-modal-button-ok]';
  await frame.waitFor(deleteButton);
  await frame.click(deleteButton);
  await frame.waitForSelector(deleteButton, { hidden: true });

  const appsEmptyPage = '[data-e2e="empty-list-placeholder"]';
  await frame.waitForSelector(appsEmptyPage);

  console.log(`Application ${name} deleted!`);
}

module.exports = {
  login,
  testLogin,
  getFrame,
  getFrameForApp,
  openLink,
  openLinkOnFrame,
  clearData,
  getNamespacesFromContextSwitcher,
  createNamespace,
  createApplication,
  deleteApplication,
  getNamespaceNamesFromNamespacesPage,
  deleteNamespace,
  getApplicationNames,
  getTextContentOnPageBySelector,
  applyTextSearchFilter,
};
