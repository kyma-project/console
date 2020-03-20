import { Selector, Role } from 'testcafe';

const regularAccUser = Role(
  'https://console.pijany.hasselhoff.ga',
  async t => {
    await t
      .typeText('#login', 'admin@kyma.cx')
      .typeText('#password', 'baywatch')
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
    .expect(Selector('.fd-panel').withText('Namespaces').exists)
    .ok();
});
