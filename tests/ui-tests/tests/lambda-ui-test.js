import kymaConsole from '../commands/console';
import lambdas from '../commands/lambdas';
import common from '../commands/common';
import { describeIf } from '../utils/skip';
import dex from '../utils/dex';

import { retry } from '../utils/retry';
import {
  testPluggable,
  isModuleEnabled,
  logModuleDisabled
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
      const data = await common.beforeAll(t => (token = t));
      browser = data.browser;
      page = data.page;
    });

    await kymaConsole.createEnvironment(page, TEST_NAMESPACE);
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
      item.find(text => text.innerText.includes('Lambdas')).click()
    );
    await page.reload({ waitUntil: ['domcontentloaded', 'networkidle0'] });

    // given (go to create lambda)
    const frame = await kymaConsole.getFrame(page);
    const lambdasEmptyPage = '.sf-section__empty-teaser';
    await frame.waitForSelector(lambdasEmptyPage);
    const currentLambdas = await lambdas.getLambdas(frame);
    const addLambdaButton = '.tn-button.tn-button--small.tn-button--text';
    await frame.$$eval(addLambdaButton, btn =>
      btn.find(text => text.innerText.includes('Add Lambda')).click()
    );
    // when (fill the input and save)
    const frame2 = await kymaConsole.getFrame(page);
    const input = '#input-1';
    await frame2.waitForSelector(input);
    await frame2.type(input, testLambda);
    const createLambdaButton = '.tn-button.tn-button--small.sf-button--primary';
    await frame2.$eval(createLambdaButton, btn => btn.click());

    // then
    const frame3 = await kymaConsole.getFrame(page);
    const lambdasEntry = '.sf-list__body';
    await frame3.waitForSelector(lambdasEntry);
    const expectedLambdas = await lambdas.getLambdas(frame3);
    const previousNumberOfLambdas = currentLambdas.length;
    const expectedNumberOfLambdas = expectedLambdas.length;

    expect(expectedNumberOfLambdas).toBe(previousNumberOfLambdas + 1);
  });

  testPluggable(REQUIRED_MODULE, 'Delete Lambda Function', async () => {
    // given
    const frame = await kymaConsole.getFrame(page);
    const dropdownButton = `button[aria-controls=${testLambda}]`;
    await frame.click(dropdownButton);

    // given
    const deleteButton = `#${testLambda} li > a[name=Delete]`;
    await frame.waitFor(deleteButton);
    await frame.click(deleteButton);

    //when (deleting lambda)
    const deleteConfirmButton =
      '.tn-modal__button-primary.sf-button--primary.tn-button--small';
    await frame.waitFor(deleteConfirmButton);
    await frame.click(deleteConfirmButton);
    await frame.waitForSelector(deleteConfirmButton, { hidden: true });

    //then
    await retry(async () => {
      await page.reload({ waitUntil: 'networkidle0' });

      const frame2 = await kymaConsole.getFrame(page);
      const lambdasEmptyPage = '.sf-section__empty-teaser';
      await frame2.waitForSelector(lambdasEmptyPage);
      const expectedLambdas = await lambdas.getLambdas(frame2);

      const expectedNumberOfLambdas = expectedLambdas.length;

      expect(expectedNumberOfLambdas).toBe(0);
    });
  });
});
