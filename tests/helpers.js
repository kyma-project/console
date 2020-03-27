import config from './config';
import { Selector, Role, ClientFunction } from 'testcafe';
import { setAsyncInterval, clearAsyncInterval } from './asyncInterval';

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

    // await waitForAuth(5000, getPathname(t));
  },
  { preserveUrl: true },
);

export const loginUsingDex = async t => {
  try {
    await Selector('#ldogin').visible; //'exists' doesn't really wait for the selector..
    console.log('One login method detected...');
  } catch (e) {
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
    console.log("Couldn't choose the email method to login");
  }
};

const getPathname = t =>
  ClientFunction(() => window.location.pathname).with({
    boundTestRun: t,
  });

const waitForAuth = async (maxTimeout, getPathnameFn, checkInterval = 100) => {
  const timeoutPromise = new Promise((resolve, reject) =>
    setTimeout(function() {
      reject(new Error('Login response timeout exceeded'));
    }, maxTimeout),
  );
  const keyInStoragePromise = new Promise(async resolve => {
    const i = setAsyncInterval(async () => {
      const pathname = await getPathnameFn();
      if (pathname === '/home/workspace') {
        clearAsyncInterval(i);
        resolve(); // the login process succeded which means the user is redirected to the main view
      }
    }, checkInterval);
  });
  return Promise.race([timeoutPromise, keyInStoragePromise]);
};
