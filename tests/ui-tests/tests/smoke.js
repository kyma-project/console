import kymaConsole from '../commands/console';
import common from '../commands/common';
import address from '../utils/address';

import { retry } from '../utils/retry';

let browser, page;
let token = '';

describe('Smoke tests', () => {
  beforeAll(async () => {
    await retry(async () => {
      const data = await common.beforeAll(t => (token = t), 60);
      browser = data.browser;
      page = data.page;
    });
  });

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

  test('Namespaces', async () => {
    const navLinkSelector =
      'a.fd-side-nav__link[data-testid="workspace_namespaces"]';

    await page.waitForSelector(navLinkSelector);
    await page.click(navLinkSelector);

    const frame = await kymaConsole.waitForAppFrameAttached(
      page,
      address.console.getCoreUIFrameUrl(),
    );

    const namespaceCard = `.namespace-details-card`;
    await frame.waitForSelector(namespaceCard);
  });
});
