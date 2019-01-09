import kymaConsole from '../commands/console';
import catalog from '../commands/catalog';
import common from '../commands/common';
import docs from '../commands/docs';
import address from '../utils/address';
import { describeIf } from '../utils/skip';
import dex from '../utils/dex';

const context = require('../utils/testContext');
let page, browser;
let isEnvironmentReady = false;

describeIf(dex.isStaticUser(), 'Docs basic tests', () => {
  beforeAll(async () => {
    try {
      isEnvironmentReady = await context.isDexReady();
      const data = await common.beforeAll(isEnvironmentReady);
      browser = data.browser;
      page = data.page;
      await common.testLogin(isEnvironmentReady, page);
    } catch (e) {
      isEnvironmentReady = false;
      throw e;
    }
  });

  afterAll(async () => {
    await browser.close();
  });

  test('Go to docs', async () => {
    common.validateTestEnvironment(isEnvironmentReady);

    // Hardcodes for specific page
    const docsUrl = address.console.getDocs();

    // consts
    const docsHeaderSelector = catalog.prepareSelector('toolbar-headline');
    const docsExpectedHeader = 'Docs';

    await page.goto(docsUrl, {
      waitUntil: ['domcontentloaded', 'networkidle0']
    });

    const frame = await kymaConsole.getFrame(page);
    await frame.waitForSelector(docsHeaderSelector);
    const docsHeader = await frame.$eval(
      docsHeaderSelector,
      item => item.innerHTML
    );
    expect(docsHeader).toContain(docsExpectedHeader);
  });

  test('Check if documentation is shown', async () => {
    common.validateTestEnvironment(isEnvironmentReady);
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

    await Promise.all([
      frame.click(serviceCatalogLink),
      frame.waitForNavigation({
        waitUntil: ['domcontentloaded', 'networkidle0']
      })
    ]);
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
