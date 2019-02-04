import config from '../config';
import kymaConsole from '../commands/console';
import lambdas from '../commands/lambdas';
import common from '../commands/common';
import logOnEvents from '../utils/logging';
import { describeIf } from '../utils/skip';
import dex from '../utils/dex';

let browser, page;
let token = '';

describeIf(dex.isStaticUser(), 'Lambda UI tests', () => {
  beforeAll(async () => {
    const data = await common.beforeAll();
    browser = data.browser;
    page = data.page;
    logOnEvents(page, t => (token = t));
  });

  afterAll(async () => {
    await lambdas.clearData(token);
    await browser.close();
  });

  test('Login to console', async () => {
    await kymaConsole.testLogin(page);
  });

  test('Create Lambda Function', async () => {
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
    // given
    const frame = await kymaConsole.getFrame(page);
    const dropdownButton = `button[aria-controls=${config.testLambda}]`;
    await frame.click(dropdownButton);

    // given
    const deleteButton = `#${config.testLambda} li > a[name=Delete]`;
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
