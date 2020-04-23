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

fixture`Console UI Smoke tests`.beforeEach(
  async t => await t.useRole(adminUser),
);

test('Luigi navigation is rendered', async t => {
  //GIVEN
  const namespacesLink = leftNavLinkSelector('Namespaces');

  //THEN
  await retry(t, 3, t => t.expect(namespacesLink.exists).ok());
});

test('Namespaces view is rendered', async t => {
  //GIVEN; THEN
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

  await retry(t, 3, async t => {
    return t
      .expect(Selector('.fd-action-bar__title').withText('Deployments').exists)
      .ok();
  });
});

testIf(
  !toBoolean(config.disableLegacyConnectivity),
  'Applications view is rendered',
  async t => {
    //GIVEN
    const applicationLink = leftNavLinkSelector('Applications');

    //WHEN
    await t.click(applicationLink);

    //THEN
    await retry(t, 3, findActiveFrame);
    await retry(t, 3, t => {
      return t
        .expect(
          Selector('.fd-action-bar__title').withText('Applications').exists,
        )
        .ok();
    });
  },
);

test('Cluster Addons view is rendered', async t => {
  //GIVEN
  const addonsLink = leftNavLinkSelector('Cluster Addons');

  //WHEN
  await t.click(addonsLink);

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

testIf(
  toBoolean(config.functionsEnabled),
  'Functions view is rendered',
  async t => {
    const functionsLink = leftNavLinkSelector('Functions');

    //WHEN
    await retry(t, 3, findActiveFrame);
    await retry(t, 3, t => {
      return t
        .click(Selector('.fd-panel__title').withText('default'))
        .switchToMainWindow()
        .click(functionsLink);
    });

    //THEN
    await retry(t, 3, findActiveFrame);
    await retry(t, 3, t => {
      return t
        .expect(Selector('.fd-panel__title').withText(/Functions/).exists)
        .ok();
    });
  },
);

testIf(toBoolean(config.loggingEnabled), 'Logs view is rendered', async t => {
  //GIVEN
  const logsLink = leftNavLinkSelector('Logs');

  //WHEN
  await t.click(logsLink);

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

    await retry(t, 3, t => {
      return t
        .expect(Selector('.fd-panel__title').withText('Service Brokers').exists)
        .ok();
    });
  },
);

testIf(
  toBoolean(config.serviceCatalogEnabled),
  'Instances view is rendered',
  async t => {
    //GIVEN
    const instancesLink = leftNavLinkSelector('Instances');

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
  //WHEN - click on docs link
  await retry(t, 3, t => t.click(Selector('[data-testid=docs_docs]')));

  //THEN - user should see "Kyma" category
  await retry(t, 3, findActiveFrame);
  await retry(t, 3, t => {
    return t
      .expect(Selector('[data-e2e-id=navigation-link-root-kyma]').exists)
      .ok();
  });
});
