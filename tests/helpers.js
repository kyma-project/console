import config from './config';
import { Selector, Role, ClientFunction } from 'testcafe';
import chalk from 'chalk';

const getLocation = ClientFunction(() => window.location.pathname);
export const reloadPage = ClientFunction(() => window.location.reload(true));

export async function expectPathnameToBe(t, pathname) {
  return await retry(
    t,
    3,
    async t => await t.expect(getLocation()).eql(pathname),
    'Checking pathname',
  );
}

export const testIf = (condition, testName, testToRun) => {
  if (condition) {
    test(testName, testToRun);
  } else {
    test.skip(testName, testToRun);
  }
};

const retry = async (t, retries, func, message, waitAfterFail = 10000) => {
  try {
    reloadPage();
    return await func(t);
  } catch (err) {
    console.log(
      `${message ? message : 'Testing iframe'} failed. Retries left: ${retries -
        1}`,
    );
    if (retries === 1) throw err;
    await new Promise(res => setTimeout(res, waitAfterFail));
    return await retry(t, retries - 1, func, message, waitAfterFail);
  }
};

export const findActiveFrame = async t => {
  return await retry(
    t,
    12,
    async t => {
      await t.expect(Selector('#luigi-app-loading-indicator').exists).notOk();
      const iframe = Selector('iframe').filterVisible();
      await t.switchToIframe(iframe);
      await t.expect(Selector('body')()).ok();
    },
    'Switching the iframe',
  );
};

export const leftNavLinkSelector = async text => {
  return Selector('nav.fd-side-nav a').withText(text);
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

    Selector('#login-error')()
      .then(element => {
        console.error(
          chalk.redBright.bgHex('#bfff00')(
            `Login failed with message: ${chalk.bold(element.innerText)}`,
          ),
        );
        process.exit(1);
      })
      .catch(() => {});

    await Selector('#app')();
  },
  { preserveUrl: true },
);

const chooseLoginRole = async t => {
  const oneMethodDetected = await Selector('#login')();
  console.log(
    oneMethodDetected
      ? 'One login method detected...'
      : 'Multiple login methods detected, choosing the email method...',
  );
  if (!oneMethodDetected) {
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
