import config from '../config';
import kymaConsole from '../commands/console';
import catalog from '../commands/catalog';
import common from '../commands/common';
import docs from '../commands/docs';
import waitForNavigationAndContext from '../utils/waitForNavigationAndContext';

const context = require('../utils/testContext');
let page, browser;
let dexReady = false;
const consoleUrl = config.localdev ? config.devConsoleUrl : config.consoleUrl;

describe('Docs basic tests', () => {
  beforeAll(async () => {
    dexReady = await context.isDexReady();
    const data = await common.beforeAll(dexReady);
    browser = data.browser;
    page = data.page;
  });

  afterAll(async () => {
    await browser.close();
  });

  test('Login', async () => {
    //the code looks strange.. but it uneasy to stop test execution as a result of a check in  'beforeAll'
    // https://github.com/facebook/jest/issues/2713
    await common.testLogin(dexReady, page);
  });

  test('Go to docs', async () => {
    common.validateDex(dexReady);

    // Hardcodes for specific page
    const docsUrl = `${consoleUrl}/home/docs`;

    // consts
    const docsHeaderSelector = catalog.prepareSelector('toolbar-headline');
    const docsExpectedHeader = 'Docs';

    await page.goto(docsUrl, { waitUntil: 'networkidle0' });
    await waitForNavigationAndContext(page);

    const frame = await kymaConsole.getFrame(page);
    await frame.waitForSelector(docsHeaderSelector);
    const docsHeader = await frame.$eval(
      docsHeaderSelector,
      item => item.innerHTML
    );
    expect(docsHeader).toContain(docsExpectedHeader);
  });

  test('Check if documentation is shown', async () => {
    common.validateDex(dexReady);
    // Hardcodes for specific page
    const articleExpectedHeader = 'Kyma';
    const articleExpectedServiceCatalogHeader = 'Service Catalog';
    const navLink = 'navigation-link';
    const navItems = 'navigation-items';
    const navArrow = 'navigation-arrow';
    const kymaID = 'root-kyma';
    const serviceCatalogID = 'components-service-catalog';
    const kymaChildID = 'details';
    const kymaItems = catalog.prepareSelector(`${navItems}-${kymaID}`);
    const kymaDetailsItems = catalog.prepareSelector(
      `${navItems}-${kymaID}-${kymaChildID}`
    );
    const kymaDetailsArrow = catalog.prepareSelector(
      `${navArrow}-${kymaID}-${kymaChildID}`
    );
    const serviceCatalogLink = catalog.prepareSelector(
      `${navLink}-${serviceCatalogID}`
    );
    const expectedCollapsedHeight = '0px';

    // consts
    const articleHeaderSelector = catalog.prepareSelector('toolbar-headline');

    const frame = await kymaConsole.getFrame(page);
    await frame.waitForSelector(articleHeaderSelector);
    await frame.$$eval(
      articleHeaderSelector,
      (item, articleExpectedHeader) => {
        item.find(text => text.innerText.includes(articleExpectedHeader));
      },
      articleExpectedHeader
    );

    await frame.waitForSelector(kymaItems);
    const kymaItemsStyles = await docs.getStyles(frame, kymaItems, 'maxHeight');
    expect(kymaItemsStyles).not.toEqual(expectedCollapsedHeight);
    await frame.waitForSelector(kymaDetailsItems);
    const kymaDetailsItemsStyles = await docs.getStyles(
      frame,
      kymaDetailsItems,
      'maxHeight'
    );
    expect(kymaDetailsItemsStyles).toEqual(expectedCollapsedHeight);

    await frame.click(kymaDetailsArrow);
    await frame.waitForSelector(kymaDetailsItems, { timeout: 10000 });

    const kymaDetailsItemsStylesAfterClick = await docs.getStyles(
      frame,
      kymaDetailsItems,
      'maxHeight'
    );
    expect(kymaDetailsItemsStylesAfterClick).not.toEqual(
      expectedCollapsedHeight
    );

    await frame.click(serviceCatalogLink);
    await waitForNavigationAndContext(frame);
    await frame.$$eval(
      articleHeaderSelector,
      (item, articleExpectedServiceCatalogHeader) => {
        item.find(text =>
          text.innerText.includes(articleExpectedServiceCatalogHeader)
        );
      },
      articleExpectedServiceCatalogHeader
    );
  });
});
