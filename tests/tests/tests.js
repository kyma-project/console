import { Selector } from 'testcafe';

import {
  testIf,
  findActiveFrame,
  adminUser,
  toBoolean,
  leftNavLinkSelector,
} from '../helpers';
import config from '../config';

fixture`Console UI Smoke tests`;

test('Luigi navigation is rendered', async t => {
  //GIVEN
  await t.useRole(adminUser);
  const namespacesLink = await leftNavLinkSelector('Namespaces');
  //THEN
  t.expect(namespacesLink.exists).ok();
});

test('Namespaces view is rendered', async t => {
  //GIVEN
  await t.useRole(adminUser);

  //THEN
  await findActiveFrame(t);
  await t
    .expect(Selector('.fd-button').withText('Add new namespace').exists)
    .ok()
    .expect(Selector('.fd-panel__title').withText('default').exists)
    .ok();
});

testIf(
  !toBoolean(config.apiPackagesEnabled),
  'Applications view is rendered',
  async t => {
    //GIVEN
    const applicationLink = await leftNavLinkSelector('Applications');
    await t
      .useRole(adminUser)

      //WHEN
      .click(applicationLink);

    //THEN
    await findActiveFrame(t);

    await t
      .expect(Selector('button').withText(/.*create application.*/i).exists)
      .ok();
  },
);

testIf(
  toBoolean(config.serviceCatalogEnabled),
  'Catalog view is rendered',
  async t => {
    //GIVEN
    await t.useRole(adminUser);
    const catalogLink = await leftNavLinkSelector('Catalog');

    //WHEN
    await findActiveFrame(t);

    await t
      .click(Selector('.fd-panel__title').withText('default'))
      .switchToMainWindow()
      .click(catalogLink);

    //THEN
    await findActiveFrame(t);

    await t
      .expect(
        Selector('.fd-action-bar__title').withText('Service Catalog').exists,
      )
      .ok();
  },
);
