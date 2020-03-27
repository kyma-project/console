import config from './config';
import { Selector, Role } from 'testcafe';

export const testIf = (condition, testName, testToRun) => {
  if (condition) {
    test(testName, testToRun);
  } else {
    test.skip(testName, testToRun);
  }
};

export const getIframe = async () => {
  return Selector('.iframeContainer')
    .child('iframe')
    .filterVisible();
};

export const ADRESS = `${
  config.localDev ? 'http://console-dev' : 'https://console'
}.${config.domain}`;

export const adminUser = Role(
  ADRESS,
  async t => {
    await chooseLoginRole(t);
    console.log('Trying to login using email...');
    await t
      .typeText('#login', config.login)
      .typeText('#password', config.password)
      .click('#submit-login')
      .wait(5000);
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
