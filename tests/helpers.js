import config from './config';
import { Selector, Role } from 'testcafe';

export const testIf = (condition, testName, testToRun) => {
  if (condition) {
    test(testName, testToRun);
  } else {
    test.skip(testName, testToRun);
  }
};

export const findActiveFrame = t => {
  return t.switchToIframe(
    Selector('iframe', { visibilityCheck: true, timeout: 20000 }),
  );
};

export const leftNavLinkSelector = text => {
  return Selector('nav.fd-side-nav a').withText(text);
};

export const retry = async (t, n, func) => {
  try {
    await func(t);
    return;
  } catch (err) {
    console.log(`Retries left: ${n - 1}`);
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
      .click('#submit-login')
      .wait(10000);
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
