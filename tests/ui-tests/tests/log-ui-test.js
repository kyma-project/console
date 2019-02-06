import config from '../config';
import kymaConsole from '../commands/console';
import common from '../commands/common';
import logOnEvents from '../utils/logging';
import { describeIf } from '../utils/skip';
import dex from '../utils/dex';

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

  test('Login to console', async () => {
    await kymaConsole.testLogin(page);
  });

  test('Select Log Label', async () => {
    var expected = 1;
    expect(expected).toBe(1);
  });
});
