import { Selector, Role } from 'testcafe';

import config from '../config';
import { testIfBackendModuleExists } from '../helpers';

const address = `${
  config.localdev ? 'http://console-dev' : 'https://console'
}.${config.domain}`;
const adminUser = Role(
  address,
  async t => {
    await t
      .typeText('#login', config.login)
      .typeText('#password', config.password)
      .click('#submit-login')
      .wait(5000); // check https://github.com/DevExpress/testcafe/issues/2475
  },
  { preserveUrl: true },
);

fixture`Getting Started`;

test('Luigi navigation is rendered', async t => {
  await t
    .useRole(adminUser)
    .expect(Selector('.fd-side-nav__item').withText('Namespaces').exists)
    .ok();
});

test('Namespaces view is rendered', async t => {
  const iframe = await Selector('.iframeContainer')
    .child('iframe')
    .filterVisible();
  await t
    .useRole(adminUser)
    .switchToIframe(iframe)
    .expect(Selector('.fd-button').withText('Add new namespace').exists)
    .ok();
});

testIfBackendModuleExists(
  'Applications view is rendered',
  'Applications',
  async t => {
    await t
      .useRole(adminUser)
      .expect(Selector('.fd-side-nav__link').withText('Applications').exists)
      .ok()
      .navigateTo(`${address}/home/cmf-apps`);

    const iframe = await Selector('.iframeContainer')
      .child('iframe')
      .filterVisible();

    await t
      .switchToIframe(iframe)
      .expect(Selector('.fd-button').withText(/.*create application.*/i).exists)
      .ok();
  },
);
