import { Selector } from 'testcafe';

import {
  testIfBackendModuleExists,
  getIframe,
  adminUser,
  address,
} from '../helpers';

fixture`Getting Started`;

test('Luigi navigation is rendered', async t => {
  await t
    .useRole(adminUser)
    .expect(Selector('.fd-side-nav__item').withText('Namespaces').exists)
    .ok();
});

test('Namespaces view is rendered', async t => {
  const iframe = await getIframe();
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

    const iframe = await getIframe();

    await t
      .switchToIframe(iframe)
      .expect(Selector('.fd-button').withText(/.*create application.*/i).exists)
      .ok();
  },
);
