import { Selector } from 'testcafe';

import {
  testIf,
  switchToFrame,
  ADRESS,
  adminUser,
  toBoolean,
  retry,
} from '../helpers';
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

  const testframe = async t => {
    return await t
      .expect(Selector('.fd-button').withText('Add new namespace').exists)
      .ok();
  };

  await retry(t, switchToFrame, 6);
  await retry(t, testframe, 6);
});

test('Namespace `default` card is on the Namespaces list', async t => {
  await t.useRole(adminUser);

  const testframe = async t => {
    return await t
      .expect(Selector('.fd-panel__title').withText('default').exists)
      .ok();
  };

  await retry(t, switchToFrame, 6);
  await retry(t, testframe, 6);
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

    const testframe = async t => {
      return await t
        .expect(
          Selector('.fd-button').withText(/.*create application.*/i).exists,
        )
        .ok();
    };

    await retry(t, switchToFrame, 6);
    await retry(t, testframe, 6);
  },
);

testIf(
  toBoolean(config.serviceCatalogEnabled),
  'Catalog view is rendered',
  async t => {
    await t
      .useRole(adminUser)
      .navigateTo(`${ADRESS}/home/namespaces/default/cmf-service-catalog`)
      .expect(Selector('.fd-side-nav__link').withText('Catalog').exists)
      .ok();

    const testframe = async t => {
      return await t
        .expect(
          Selector('.fd-action-bar__title').withText('Service Catalog').exists,
        )
        .ok();
    };

    await retry(t, switchToFrame, 6);
    await retry(t, testframe, 6);
  },
);
