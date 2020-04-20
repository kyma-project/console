import { Selector } from 'testcafe';

import {
  testIf,
  findActiveFrame,
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
  const namespacesLink = leftNavLinkSelector('Namespaces');

  //THEN
  await t.expect(namespacesLink.exists).ok();
});

test('Namespaces view is rendered', async t => {
  //GIVEN
  await t.useRole(adminUser);

  //THEN
  await retry(t, 3, findActiveFrame);
  await retry(t, 3, t => {
    return t
      .expect(Selector('.fd-button').withText('Add new namespace').exists)
      .ok()
      .expect(Selector('.fd-panel__title').withText('default').exists)
      .ok();
  });
});

test('Deployments view is rendered', async t => {
  //GIVEN
  await t.useRole(adminUser);
  const deploymentsLink = leftNavLinkSelector('Deployments');
  //WHEN
  await retry(t, 3, findActiveFrame);

  await retry(t, 3, t => {
    return t
      .click(Selector('.fd-panel__title').withText('default'))
      .switchToMainWindow()
      .click(deploymentsLink);
  });

  //THEN
  await retry(t, 3, findActiveFrame);

  await retry(t, 3, t => {
    return t
      .expect(Selector('.fd-action-bar__title').withText('Deployments').exists)
      .ok();
  });
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
    await retry(t, 3, findActiveFrame);
    await retry(t, 3, t => {
      return t
        .expect(Selector('button').withText(/.*create application.*/i).exists)
        .ok();
    });
  },
);

test('Cluster Addons view is rendered', async t => {
  //GIVEN
  const addonsLink = leftNavLinkSelector('Cluster Addons');
  await t
    .useRole(adminUser)
    //WHEN
    .click(addonsLink);

  //THEN
  await retry(t, 3, findActiveFrame);
  await retry(t, 3, t => {
    return t
      .expect(
        Selector('.fd-action-bar__title').withText(/Cluster Addons/i).exists,
      )
      .ok();
  });
});

test('Lambda view is rendered', async t => {
  //GIVEN
  const lambdaLink = leftNavLinkSelector('Lambdas');
  await t.useRole(adminUser);

  await retry(t, 3, findActiveFrame);
  await retry(t, 3, t => {
    return t
      .click(Selector('.fd-panel__title').withText('default'))
      .switchToMainWindow()
      .click(lambdaLink);
  });

  //THEN
  await retry(t, 3, findActiveFrame);
  await retry(t, 3, t => {
    return t
      .expect(Selector('.fd-action-bar__title').withText(/Lambdas/i).exists)
      .ok();
  });
});

test('Logs view is rendered', async t => {
  //GIVEN
  const logsLink = leftNavLinkSelector('Logs');
  await t
    .useRole(adminUser)
    //WHEN
    .click(logsLink);

  //THEN
  await retry(t, 3, findActiveFrame);
  // check title
  await retry(t, 3, t => {
    return t.expect(Selector('h1').withText(/Logs/i).exists).ok();
  });

  // check loading log sources
  await retry(t, 3, async t => {
    await t.click(
      Selector('input').withAttribute('placeholder', /Select Label/i),
    );
    await t.click(Selector('.fd-mega-menu__link').withText(/namespace/i));
    return t
      .expect(Selector('.fd-mega-menu__sublink').withText('default').exists)
      .ok();
  });
});

testIf(
  toBoolean(config.serviceCatalogEnabled),
  'Catalog view is rendered',
  async t => {
    //GIVEN
    await t.useRole(adminUser);
    const catalogLink = leftNavLinkSelector('Catalog');

    //WHEN
    await retry(t, 3, findActiveFrame);
    await retry(t, 3, t => {
      return t
        .click(Selector('.fd-panel__title').withText('default'))
        .switchToMainWindow()
        .click(catalogLink);
    });

    //THEN
    await retry(t, 3, findActiveFrame);
    await retry(t, 3, t => {
      return t
        .expect(
          Selector('.fd-action-bar__title').withText('Service Catalog').exists,
        )
        .ok();
    });
  },
);

testIf(
  toBoolean(config.serviceCatalogEnabled),
  'Service Brokers view is rendered',
  async t => {
    //GIVEN
    await t.useRole(adminUser);
    const brokersLink = leftNavLinkSelector('Brokers');

    //WHEN
    await retry(t, 3, findActiveFrame);
    await retry(t, 3, t => {
      return t
        .click(Selector('.fd-panel__title').withText('default'))
        .switchToMainWindow()
        .click(brokersLink);
    });

    //THEN
    await retry(t, 3, findActiveFrame);

    // check title
    await retry(t, 3, t => {
      return t
        .expect(
          Selector('.fd-action-bar__title').withText('Service Brokers').exists,
        )
        .ok();
    });

    // check loading brokers - helm-broker should be always preset in table
    await retry(t, 3, t => {
      return t.expect(Selector('td').withText('helm-broker').exists).ok();
    });
  },
);

testIf(
  toBoolean(config.serviceCatalogEnabled),
  'Instances view is rendered',
  async t => {
    //GIVEN
    await t.useRole(adminUser);
    const instancesLink = leftNavLinkSelector('Instance');

    //WHEN
    await retry(t, 3, findActiveFrame);
    await retry(t, 3, t => {
      return t
        .click(Selector('.fd-panel__title').withText('default'))
        .switchToMainWindow()
        .click(instancesLink);
    });

    //THEN
    await retry(t, 3, findActiveFrame);
    await retry(t, 3, t => {
      return t
        .expect(
          Selector('.fd-action-bar__title').withText('Service Instance').exists,
        )
        .ok();
    });
  },
);

test('Docs view is rendered', async t => {
  //GIVEN
  await t.useRole(adminUser);
  //WHEN - click on docs link
  await retry(t, 3, t => t.click(Selector('[data-testid=docs_docs]')));

  //THEN - use should see "Kyma" category
  await retry(t, 3, findActiveFrame);
  await retry(t, 3, t => {
    return t
      .expect(Selector('[data-e2e-id=navigation-link-root-kyma]').exists)
      .ok();
  });
});
