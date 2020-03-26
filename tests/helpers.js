import config from './config';
import { Selector, Role, ClientFunction } from 'testcafe';

export const testIfBackendModuleExists = (
  testName,
  backendModuleName,
  testToRun,
) => {
  if (config[backendModuleName]) {
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
    await t
      .typeText('#login', config.login)
      .typeText('#password', config.password)
      .click('#submit-login')
      .wait(5000);
  },
  { preserveUrl: true },
);

export const loginUsingDex = async t => {
  if (Selector('#login').exists) {
    console.log('One login method detected...');
  } else {
    console.log(
      'Multiple login methods detected, choosing the email method...',
    );
    await chooseEmail();
  }
  console.log('Trying to log in using email...');
  await t.useRole(adminUser);
};

const chooseEmail = async t => {
  try {
    await Selector('span')
      .withText('Log in with Email')
      .click();
  } catch (e) {
    console.log("Couldn't choose the email method to login.");
  }
};
