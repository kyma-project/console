import kymaConsole from '../commands/console';
import catalog from '../commands/catalog';
import common from '../commands/common';
import address from '../utils/address';
import { describeIf } from '../utils/skip';
import dex from '../utils/dex';
import { retry } from '../utils/retry';
import {
  testPluggable,
  isModuleEnabled,
  logModuleDisabled,
} from '../setup/test-pluggable';

let page, browser;

const REQUIRED_MODULE = 'cms';

describeIf(dex.isStaticUser(), 'Docs basic tests', () => {
  beforeAll(async () => {
    if (!(await isModuleEnabled(REQUIRED_MODULE))) {
      logModuleDisabled(REQUIRED_MODULE, 'beforeAll');
      return;
    }

    jest.setTimeout(240 * 1000);
    await retry(async () => {
      const data = await common.beforeAll();
      browser = data.browser;
      page = data.page;
    });
  });

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

  testPluggable(REQUIRED_MODULE, 'Go to docs', async () => {
    // Hardcodes for specific page
    const docsUrl = address.console.getDocs();

    // consts
    const docsHeaderSelector = catalog.prepareSelector('go-to-environment');
    const docsExpectedHeader = 'Back to Namespaces';

    await Promise.all([
      page.goto(docsUrl),
      page.waitForNavigation({
        waitUntil: ['domcontentloaded', 'networkidle2'],
      }),
    ]);

    const frame = await kymaConsole.getFrame(page);
    await frame.waitForSelector(docsHeaderSelector);
    const docsHeader = await frame.$eval(
      docsHeaderSelector,
      item => item.innerHTML,
    );
    expect(docsHeader).toContain(docsExpectedHeader);
  });

  testPluggable(
    REQUIRED_MODULE,
    'Check if documentation is shown',
    async () => {
      jest.setTimeout(300 * 1000);

      // Hardcodes for specific page
      const articleExpectedHeader = 'Kyma';
      const articleExpectedServiceCatalogHeader = 'Service Catalog';
      const navLink = 'navigation-link';
      const serviceCatalogID = 'components-service-catalog';

      const serviceCatalogLink = catalog.prepareSelector(
        `${navLink}-${serviceCatalogID}`,
      );

      const waitForHeader = async () => {
        frame = await kymaConsole.getFrame(page);
        await frame.waitForSelector(articleHeaderSelector, {
          timeout: 50000,
        });
      };

      // consts
      const articleHeaderSelector = catalog.prepareSelector('toolbar-header');

      let frame;
      await retry(waitForHeader);

      await frame.$$eval(
        articleHeaderSelector,
        (item, articleExpectedHeader) => {
          item.find(text => text.innerText.includes(articleExpectedHeader));
        },
        articleExpectedHeader,
      );

      await frame.click(serviceCatalogLink);
      await retry(waitForHeader);

      await frame.$$eval(
        articleHeaderSelector,
        (item, articleExpectedServiceCatalogHeader) => {
          item.find(text =>
            text.innerText.includes(articleExpectedServiceCatalogHeader),
          );
        },
        articleExpectedServiceCatalogHeader,
      );
    },
  );
});
