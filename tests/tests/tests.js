import { Selector } from 'testcafe';

import {
  testIf,
  switchToActiveFrame,
  adminUser,
  toBoolean,
  retry,
  leftNavLinkSelector,
} from '../helpers';
import config from '../config';

fixture`Console UI Smoke tests`;

test('Luigi navigation is rendered', async t => {
  //GIVEN
  await t.useRole(adminUser);

  //AND
  const namespacesLink = leftNavLinkSelector('Namespaces');

  //THEN
  await t.expect(namespacesLink.exists).ok();
});

test('Namespaces view is rendered', async t => {
  //GIVEN
  await t.useRole(adminUser);

  //THEN
  const testframe = async t => {
    return await t
      .expect(Selector('.fd-button').withText('Add new namespace').exists)
      .ok()
      .expect(Selector('.fd-panel__title').withText('default').exists)
      .ok();
  };
  await retry(t, switchToActiveFrame, 3);
  await retry(t, testframe, 3);
});

testIf(
  !toBoolean(config.apiPackagesEnabled),
  'Applications view is rendered',
  async t => {
    //GIVEN
    const applicationLink = leftNavLinkSelector('Applications');
    await t
      .useRole(adminUser)

      //WHEN
      .click(applicationLink);

    //THEN
    await retry(t, switchToActiveFrame, 3);
    const testframe = async t => {
      return await t
        .expect(Selector('button').withText(/.*create application.*/i).exists)
        .ok();
    };
    await retry(t, testframe, 3);
  },
);

testIf(
  toBoolean(config.serviceCatalogEnabled),
  'Catalog view is rendered',
  async t => {
    //GIVEN
    await t.useRole(adminUser);
    const catalogLink = leftNavLinkSelector('Catalog');

    //WHEN
    await retry(t, switchToActiveFrame, 3);
    await t
      .click(Selector('.fd-panel__title').withText('default'))
      .switchToMainWindow()
      .click(catalogLink);

    //THEN
    await retry(t, switchToActiveFrame, 3);
    const testframe = async t => {
      return await t
        .expect(
          Selector('.fd-action-bar__title').withText('Service Catalog').exists,
        )
        .ok();
    };
    await retry(t, testframe, 6);
  },
);
