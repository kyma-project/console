import { Selector } from 'testcafe';

import { testIf, getIframe, ADRESS, adminUser, toBoolean } from '../helpers';
import config from '../config';

fixture`Console tests`.page(ADRESS);

test('Luigi navigation is rendered', async t => {
  await t.useRole(adminUser);

  await t
    .expect(Selector('.fd-side-nav__item').withText('Namespaces').exists)
    .ok();
});

test('Namespaces view is rendered', async t => {
  await t.useRole(adminUser);

  const iframe = await getIframe();
  await t
    .switchToIframe(iframe)
    .expect(Selector('.fd-button').withText('Add new namespace').exists)
    .ok();
});

test('Namespace `default` card is on the Namespaces list', async t => {
  await t.useRole(adminUser);

  const iframe = await getIframe();
  await t
    .switchToIframe(iframe)
    .expect(Selector('.fd-panel__title').withText('default').exists)
    .ok();
});

testIf(
  !toBoolean(config.apiPackagesEnabled),
  'Applications view is rendered',
  async t => {
    await t
      .useRole(adminUser)
      .expect(Selector('.fd-side-nav__link').withText('Applications').exists)
      .ok()
      .navigateTo(`${ADRESS}/home/cmf-apps`);

    const iframe = await getIframe();
    await t
      .switchToIframe(iframe)
      .expect(Selector('.fd-button').withText(/.*create application.*/i).exists)
      .ok();
  },
);

testIf(
  toBoolean(config.serviceCatalogEnabled),
  'Catalog view is rendered',
  async t => {
    await t
      .useRole(adminUser)
      .navigateTo(`${ADRESS}/home/namespaces/default/cmf-service-catalog`);

    const iframe = await getIframe();
    await t
      .expect(Selector('.fd-side-nav__link').withText('Catalog').exists)
      .ok()
      .switchToIframe(iframe)
      .expect(
        Selector('.fd-action-bar__title').withText('Service Catalog').exists,
      )
      .ok();
  },
);
