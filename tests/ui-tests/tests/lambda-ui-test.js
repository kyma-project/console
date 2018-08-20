import config from '../config';
import kymaConsole from '../commands/console';
import lambdas from '../commands/lambdas';
import common from '../commands/common';
import logOnEvents from '../utils/logging';
import waitForNavigationAndContext from '../utils/waitForNavigationAndContext';
const context = require('../utils/testContext');

let browser, page;
let dexReady = false;
let token = '';

describe('Lambda UI tests', () => {
  beforeAll(async () => {
    dexReady = await context.isDexReady();
    const data = await common.beforeAll(dexReady);
    browser = data.browser;
    page = data.page;
    logOnEvents(page, t => (token = t));
  });

  afterAll(async () => {
    await lambdas.clearData(token);
    await browser.close();
  });

  test('Login to console', async () => {
    await common.testLogin(dexReady, page);
  });

  test('Create Lambda Function', async () => {
    common.validateDex(dexReady);
    const contentHeader = '.sf-toolbar__header';

    // given (go to Lambdas view)
    const cardHeader = '.tn-card__header';
    await page.waitForSelector(cardHeader);
    await page.$$eval(cardHeader, header =>
      header.find(text => text.innerText.includes('qa')).click()
    );
    await page.waitForSelector(contentHeader);
    const navItem = 'a.sf-toolbar__item';
    await page.$$eval(navItem, item =>
      item.find(text => text.innerText.includes('Lambdas')).click()
    );
    await page.reload({ waitUntil: 'networkidle0' });
    await waitForNavigationAndContext(page);

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
    await frame2.type(input, config.testLambda);
    const createLambdaButton = '.tn-button.tn-button--small.sf-button--primary';
    await frame2.$eval(createLambdaButton, btn => btn.click());

    // workaround -> sometimes navigate to lambdas list after successful create doesn't work
    // so we force it
    await page.$$eval(navItem, item =>
      item.find(text => text.innerText.includes('Lambdas')).click()
    );

    // then
    const frame3 = await kymaConsole.getFrame(page);
    const lambdasEntry = '.sf-list__body';
    await frame3.waitForSelector(lambdasEntry);
    const expectedLambdas = await lambdas.getLambdas(frame3);

    const previousNumberOfLambdas = currentLambdas.length;
    const expectedNumberOfLambdas = expectedLambdas.length;

    expect(expectedNumberOfLambdas).toBe(previousNumberOfLambdas + 1);
  });

  test('Delete Lambda Function', async () => {
    common.validateDex(dexReady);
    // given
    const frame = await kymaConsole.getFrame(page);
    const dropdownButton = '.tn-button.tn-button--icon.tn-button--text';
    await frame.click(dropdownButton);

    // given
    const deleteButton = 'a.tn-dropdown__item';
    await frame.waitFor(deleteButton);
    await frame.click(deleteButton);

    //when (deleting lambda)
    const deleteConfirmButton =
      '.tn-modal__button-primary.sf-button--primary.tn-button--small';
    await frame.waitFor(deleteConfirmButton);
    await frame.click(deleteConfirmButton);
    await frame.waitForSelector(deleteConfirmButton, { hidden: true });
    await page.reload({ waitUntil: 'networkidle0' });

    // then
    const frame2 = await kymaConsole.getFrame(page);
    const lambdasEmptyPage = '.sf-section__empty-teaser';
    await frame2.waitForSelector(lambdasEmptyPage);
    const expectedLambdas = await lambdas.getLambdas(frame2);

    const expectedNumberOfLambdas = expectedLambdas.length;

    expect(expectedNumberOfLambdas).toBe(0);
  });
});
