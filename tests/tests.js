import { Selector } from 'testcafe';

import {
  testIf,
  findActiveFrame,
  adminUser,
  toBoolean,
  leftNavLinkSelector,
  clearExpandedCategories,
} from './helpers';
import config from './config';

fixture`Console UI Smoke tests`.beforeEach(async t => {
  clearExpandedCategories();
  await t.useRole(adminUser);
});

test('Luigi navigation is rendered', async t => {
  //GIVEN
  const namespacesLink = await leftNavLinkSelector('Namespaces');

  //THEN
  await t.expect(namespacesLink.exists).ok();
});

test('Namespaces view is rendered', async t => {
  //GIVEN; THEN
  await findActiveFrame(t);
  await t
    .expect(Selector('[aria-label="title"]').withText('Namespaces').exists)
    .ok()
    .expect(
      Selector(
        `[aria-label="go to namespace ${config.DEFAULT_NAMESPACE_NAME} link"]`,
      ).withText(config.DEFAULT_NAMESPACE_NAME).exists,
    )
    .ok();
});

test.skip('Deployments view is rendered', async t => {
  //GIVEN
  const deploymentsLink = await leftNavLinkSelector('Deployments');
  //WHEN
  await findActiveFrame(t);

  await t
    .click(
      Selector(
        `[aria-label="go to namespace ${config.DEFAULT_NAMESPACE_NAME} link"]`,
      ).withText(config.DEFAULT_NAMESPACE_NAME),
    )
    .switchToMainWindow()
    .click(deploymentsLink);

  //THEN
  await findActiveFrame(t);

  await t
    .expect(Selector('[aria-label="title"]').withText('Deployments').exists)
    .ok();
});

testIf(
  !toBoolean(config.disableLegacyConnectivity),
  'Applications view is rendered',
  async t => {
    //GIVEN
    const integrationCategoryLink = await leftNavLinkSelector('Integration');
    await t.click(integrationCategoryLink);

    //WHEN
    const applicationLink = await leftNavLinkSelector('Applications');
    await t.click(applicationLink);

    //THEN
    await findActiveFrame(t);

    await t
      .expect(Selector('[aria-label="title"]').withText('Applications').exists)
      .ok();
  },
);

// TODO investigate failing test
// test('Cluster Addons view is rendered', async t => {
//   //GIVEN
//   const addonsLink = await leftNavLinkSelector('Cluster Addons');

//   //WHEN
//   await t.click(addonsLink);

//   //THEN
//   await findActiveFrame(t);
//   await t
//     .expect(
//       Selector('.fd-action-bar__title').withText(/Cluster Addons/i).exists,
//     )
//     .ok();
// });

testIf(
  toBoolean(config.functionsEnabled),
  'Functions view is rendered',
  async t => {
    const developmentCategoryLink = await leftNavLinkSelector('Development');

    //WHEN
    await findActiveFrame(t);
    await t
      .click(
        Selector(
          `[aria-label="go to namespace ${config.DEFAULT_NAMESPACE_NAME} link"]`,
        ).withText(config.DEFAULT_NAMESPACE_NAME),
      )
      .switchToMainWindow()
      .click(developmentCategoryLink);

    const functionsLink = await leftNavLinkSelector('Functions');
    await t.click(functionsLink);

    //THEN
    await findActiveFrame(t);
    await t
      .expect(Selector('[aria-label="title"]').withText(/Functions/).exists)
      .ok();
  },
);

testIf(toBoolean(config.loggingEnabled), 'Logs view is rendered', async t => {
  const diagnosticsCategoryLink = await leftNavLinkSelector('Diagnostics');
  await t.click(diagnosticsCategoryLink);

  //GIVEN
  const logsLink = await leftNavLinkSelector('Logs');

  //WHEN
  await t.click(logsLink);

  //THEN
  await findActiveFrame(t);
  // check title
  await t
    .expect(Selector('[aria-label="title"]').withText(/Logs/i).exists)
    .ok();

  // check loading log sources
  await t.click(
    Selector('input').withAttribute('placeholder', /Select Label/i),
  );
  await t.click(Selector('[aria-label="link"]').withText(/namespace/i));
  await t
    .expect(
      Selector('[aria-label="sublink"]').withText(config.DEFAULT_NAMESPACE_NAME)
        .exists,
    )
    .ok();
});

testIf(
  toBoolean(config.serviceCatalogEnabled),
  'Catalog view is rendered',
  async t => {
    //GIVEN
    const serviceManagementCategoryLink = await leftNavLinkSelector(
      'Service Management',
    );

    //WHEN
    await findActiveFrame(t);

    await t
      .click(
        Selector(
          `[aria-label="go to namespace ${config.DEFAULT_NAMESPACE_NAME} link"]`,
        ).withText(config.DEFAULT_NAMESPACE_NAME),
      )
      .switchToMainWindow()
      .click(serviceManagementCategoryLink);

    const catalogLink = await leftNavLinkSelector('Catalog');
    await t.click(catalogLink);

    //THEN
    await findActiveFrame(t);

    await t
      .expect(
        Selector('[aria-label="title"]').withText('Service Catalog').exists,
      )
      .ok();
  },
);

testIf(
  toBoolean(config.serviceCatalogEnabled),
  'Service Brokers view is rendered',
  async t => {
    //GIVEN
    const serviceManagementCategoryLink = await leftNavLinkSelector(
      'Service Management',
    );

    //WHEN
    await findActiveFrame(t);
    await t
      .click(
        Selector(
          `[aria-label="go to namespace ${config.DEFAULT_NAMESPACE_NAME} link"]`,
        ).withText(config.DEFAULT_NAMESPACE_NAME),
      )
      .switchToMainWindow()
      .click(serviceManagementCategoryLink);

    const brokersLink = await leftNavLinkSelector('Brokers');
    await t.click(brokersLink);

    //THEN
    await findActiveFrame(t);

    await t
      .expect(
        Selector('[aria-label="title"]').withText('Service Brokers').exists,
      )
      .ok();
  },
);

testIf(
  toBoolean(config.serviceCatalogEnabled),
  'Instances view is rendered',
  async t => {
    //GIVEN
    const serviceManagementCategoryLink = await leftNavLinkSelector(
      'Service Management',
    );

    //WHEN
    await findActiveFrame(t);
    await t
      .click(
        Selector(
          `[aria-label="go to namespace ${config.DEFAULT_NAMESPACE_NAME} link"]`,
        ).withText(config.DEFAULT_NAMESPACE_NAME),
      )
      .switchToMainWindow()
      .click(serviceManagementCategoryLink);

    const instancesLink = await leftNavLinkSelector('Instances');
    await t.click(instancesLink);

    //THEN
    await findActiveFrame(t);
    await t
      .expect(
        Selector('[aria-label="title"]').withText('Service Instances').exists,
      )
      .ok();
  },
);

test('Docs view is rendered', async t => {
  //GIVEN
  const docsLink = Selector('[data-testid=docs_docs]');
  const kymaCategoryHeader = Selector(
    '[data-e2e-id=navigation-link-root-kyma]',
  );

  //WHEN
  await t.click(docsLink);

  //THEN - user should see "Kyma" category
  await findActiveFrame(t);
  await t.expect(kymaCategoryHeader.exists).ok();
});
