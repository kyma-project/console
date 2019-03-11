import config from '../config';
import kymaConsole from '../commands/console';
import common from '../commands/common';
import logOnEvents from '../utils/logging';
import { describeIf } from '../utils/skip';
import dex from '../utils/dex';
import logsCommands from '../commands/log-ui';

let browser, page;
let token = '';

describeIf(dex.isStaticUser(), 'Log UI tests', () => {
  beforeAll(async () => {
    const data = await common.beforeAll();
    browser = data.browser;
    page = data.page;
    logOnEvents(page, t => (token = t));
  });

  afterAll(async () => {
    await browser.close();
  });

  test('Check Log UI', async () => {
    const contentHeader = '.fd-side-nav__group';

    // go to Logs view
    await page.waitForSelector(contentHeader);
    const navItem = 'a.fd-side-nav__link';
    await page.$$eval(navItem, item =>
      item.find(text => text.innerText.includes('Logs')).click(),
    );
    await page.reload({ waitUntil: ['domcontentloaded', 'networkidle0'] });

    // check labels available
    const frame = await kymaConsole.getFrame(page);
    const logsUIPanel = '.fd-panel__body';
    await frame.waitForSelector(logsUIPanel);
    const currentLabels = await logsCommands.getLabels(frame);
    expect(currentLabels.length).toBeGreaterThan(2);

    // select label namespace
    const labelSelectBox = '#label';
    await frame.select(labelSelectBox, 'namespace');

    // wait until values for namespace loaded
    const currentLabelValues = await logsCommands.getLabelValues(frame);
    expect(currentLabelValues.length).toBeGreaterThan(1);

    //select namespace kyma-system
    const labelValuesSelectBox = '#labelValue';
    await frame.select(labelValuesSelectBox, 'kyma-system');

    //select from 1d
    const fromSelectBox = '#from';
    await frame.select(fromSelectBox, '7d');

    //select limit to 10
    const limitInput = '#limit';
    await frame.$eval(limitInput, input => (input.value = ''));
    await frame.waitForSelector(limitInput);
    await frame.type(limitInput, '10');

    // search for logs
    const form = await frame.$('.fd-button');
    await form.click();
    await frame.waitFor(2000);

    //check log search result
    const frame2 = await kymaConsole.getFrame(page);
    const resultRows = await logsCommands.getSearchResult(frame2);

    expect(resultRows.length).toBe(10);
  });
});
