import kymaConsole from '../commands/console';
import lambdas from '../commands/lambdas';
import common from '../commands/common';
import { describeIf } from '../utils/skip';
import dex from '../utils/dex';
import config from '../config';
import address from '../utils/address';

import { retry } from '../utils/retry';
import {
  testPluggable,
  isModuleEnabled,
  logModuleDisabled,
} from '../setup/test-pluggable';

const REQUIRED_MODULE = 'kubeless';
const TEST_NAMESPACE = 'lambdatest';
const testLambda = 'testlambda';

let browser, page;
let token = '';

describeIf(dex.isStaticUser(), 'Lambda UI tests', () => {
  beforeAll(async () => {
    if (!(await isModuleEnabled(REQUIRED_MODULE))) {
      logModuleDisabled(REQUIRED_MODULE, 'beforeAll');
      return;
    }

    await retry(async () => {
      const data = await common.beforeAll(t => (token = t), 60);
      browser = data.browser;
      page = data.page;
    });

    await kymaConsole.createNamespace(page, TEST_NAMESPACE);
  });

  afterAll(async () => {
    if (!(await isModuleEnabled(REQUIRED_MODULE))) {
      logModuleDisabled(REQUIRED_MODULE, 'afterAll');
      return;
    }

    await kymaConsole.clearData(token, TEST_NAMESPACE);
    if (browser) {
      await browser.close();
    }
  });

  testPluggable(REQUIRED_MODULE, 'Create Lambda Function', async () => {
    const contentHeader = 'li.fd-side-nav__title';

    await page.waitForSelector(contentHeader);
    const navItem = 'a.fd-side-nav__link';
    await page.$$eval(navItem, item =>
      item.find(text => text.innerText.includes('Lambdas')).click(),
    );

    // given (go to create lambda)
    const frame = await kymaConsole.waitForAppFrameAttached(
      page,
      address.console.getLambdasFrameUrl(),
    );
    const lambdasEmptyPage = '[data-e2e="empty-list-placeholder"]';
    await frame.waitForSelector(lambdasEmptyPage);
    await lambdas.getLambdas(frame);
    const addLambdaButton = '.fd-button.sap-icon--add';
    await frame.$$eval(addLambdaButton, btn =>
      btn.find(text => text.innerText.includes('Add Lambda')).click(),
    );
    // when (fill the input and save)
    const input = '#input-1';
    await frame.waitForSelector(input);
    await frame.type(input, testLambda);
    const createLambdaButton = '.fd-button.fd-button--emphasized';
    await frame.$eval(createLambdaButton, btn => btn.click());

    // then
    const disabledLambdaNameInput = 'input[name=function_name][disabled]';
    await frame.waitForSelector(disabledLambdaNameInput);
  });

  testPluggable(REQUIRED_MODULE, 'Delete Lambda Function', async () => {
    // given

    let frame = await kymaConsole.waitForAppFrameAttached(
      page,
      address.console.getLambdasFrameUrl(),
    );

    const lambdasListBreadcrumbLink = 'a[fd-breadcrumb-link]';
    await frame.click(lambdasListBreadcrumbLink);

    const dropdownButton = `button[aria-controls=${testLambda}]`;
    await frame.waitFor(dropdownButton);
    await frame.click(dropdownButton);

    // given
    const deleteButton = `#${testLambda} li > a[name=Delete]`;
    await frame.waitFor(deleteButton);
    await frame.click(deleteButton);

    //when (deleting lambda)
    const deleteConfirmButton = '[data-e2e-id=confirmation-modal-button-ok]';
    await frame.waitFor(deleteConfirmButton);
    await frame.click(deleteConfirmButton);
    await frame.waitForSelector(deleteConfirmButton, { hidden: true });

    //then
    await retry(async () => {
      await page.reload({ waitUntil: ['domcontentloaded', 'networkidle0'] });
      const frame = await kymaConsole.waitForAppFrameAttached(
        page,
        address.console.getLambdasFrameUrl(),
      );
      const lambdasEmptyPage = '[data-e2e="empty-list-placeholder"]';
      await frame.waitForSelector(lambdasEmptyPage);
    });
  });
});
