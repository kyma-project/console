import config from './config';
import { Selector, Role } from 'testcafe';

export const testIf = (condition, testName, testToRun) => {
  if (condition) {
    test(testName, testToRun);
  } else {
    test.skip(testName, testToRun);
  }
};

export const findActiveFrame = async t => {
  return retry(
    t,
    7,
    async t => {
      const iframe = Selector('iframe', {
        visibilityCheck: true,
      });
      await t.expect(Selector('body').exists).ok();
      await t.switchToIframe(iframe).wait(1000);
    },
    'Switching the iframe',
  );
};

export const leftNavLinkSelector = async text => {
  const link = Selector('nav.fd-side-nav a', {
    visibilityCheck: true,
    timeout: config.navLinksTimeout,
  }).withText(text);

  return link;
};

export const retry = async (t, n, func, goal) => {
  try {
    return await func(t);
  } catch (err) {
    console.log(`${goal}. Retries left: ${n - 1}`);

    if (n === 1) throw err;
    return await retry(t, n - 1, func);
  }
};

export const ADRESS = `${
  config.localDev ? 'http://console-dev' : 'https://console'
}.${config.domain}${config.localDev ? ':4200' : ''}`;

export const adminUser = Role(
  ADRESS,
  async t => {
    await chooseLoginRole(t);
    console.log('Trying to login using email...');
    await t
      .typeText('#login', config.login)
      .typeText('#password', config.password)
      .click('#submit-login');

    await Selector('#app', {
      timeout: 5000,
    })();
  },
  { preserveUrl: true },
);

const chooseLoginRole = async t => {
  try {
    await Selector('#login').visible; // '.exists' doesn't really wait for the selector..
    console.log('One login method detected...');
  } catch (e) {
    console.log(
      'Multiple login methods detected, choosing the email method...',
    );
    await t.click(Selector('.dex-btn-icon--local'));
  }
};

export const toBoolean = value => {
  if (typeof value === 'boolean') {
    return value;
  } else {
    return value === 'true';
  }
};
