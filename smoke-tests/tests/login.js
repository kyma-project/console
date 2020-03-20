import { Selector, Role } from 'testcafe';
import config from '../config';

const address = `${
  config.localdev ? 'http://console-dev' : 'https://console'
}.${config.domain}`;
const regularAccUser = Role(
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

test('1', async t => {
  await t
    .useRole(regularAccUser)
    .expect(Selector('.fd-side-nav__item').withText('Namespaces').exists)
    .ok();
});

test('2', async t => {
  await t
    .useRole(regularAccUser)
    .expect(Selector('.fd-side-nav__link').withText('Applications').exists)
    .ok();
});

test('3', async t => {
  const iframe = await Selector('.iframeContainer').child(0);
  await t
    .useRole(regularAccUser)
    .switchToIframe(iframe)
    .expect(Selector('.fd-button').withText('Add new namespace').exists)
    .ok();
});
