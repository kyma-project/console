import { Selector } from 'testcafe';

import {
  testIfBackendModuleExists,
  getIframe,
  adminUser,
  ADRESS,
} from '../helpers';

fixture`Console tests`;

test('Luigi navigation is rendered', async t => {
  await t
    .useRole(adminUser)
    .expect(Selector('.fd-side-nav__item').withText('Namespaces').exists)
    .ok();
});

test('Test1', async t => {
  await t.useRole(adminUser).navigateTo(`${ADRESS}/home/settings`);

  const iframe = await getIframe();
  await t
    .switchToIframe(iframe)
    .expect(Selector('.fd-section__title').withText('Your Organisation').exists)
    .ok();
});

test('Test2', async t => {
  await t.useRole(adminUser).navigateTo(`${ADRESS}/home/cmf-logs`);

  const iframe = await getIframe();
  await t
    .switchToIframe(iframe)
    .expect(Selector('.fd-has-type-3').withText('Logs').exists)
    .ok();
});

test('Test3', async t => {
  await t
    .useRole(adminUser)
    .navigateTo(`${ADRESS}/home/namespaces/default/cmf-lambdas`);

  const iframe = await getIframe();
  await t
    .switchToIframe(iframe)
    .expect(Selector('.fd-action-bar__title').withText('Lambdas').exists)
    .ok();
});

test.skip('Namespaces view is rendered', async t => {
  await t.useRole(adminUser);

  const iframe = await getIframe();
  await t
    .switchToIframe(iframe)
    .expect(Selector('.fd-button').withText('Add new namespace').exists)
    .ok();
});

test.skip('Namespace `default` card is on the Namespaces list', async t => {
  await t.useRole(adminUser);

  const iframe = await getIframe();
  await t
    .switchToIframe(iframe)
    .expect(Selector('.fd-panel__title').withText('default').exists)
    .ok();
});

test.skip('Applications view is rendered', async t => {
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
});

test.skip('Catalog view is rendered', async t => {
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
});
