import request from 'request';
import config from '../config';
import kymaConsole from '../commands/console';
import common from '../commands/common';
import { describeIf } from '../utils/skip';
import dex from '../utils/dex';
import address from '../utils/address';
import { retry, retryInterval } from '../utils/retry';
import { testPluggable } from '../setup/test-pluggable';
import { NamespaceManager } from '../setup/namespace-manager';
import { k8sApiDeployment, k8sApiService } from './../setup/k8s-api';

let page, browser, namespace;
let token = ''; // eslint-disable-line no-unused-vars

// TODO: Move application tests to a separate file
const REQUIRED_MODULE = 'application';
const namespaceUnderTest = 'test-expose-api';
const namespaceInstaller = new NamespaceManager(namespaceUnderTest);

describeIf(dex.isStaticUser(), 'Console basic tests', () => {
  beforeAll(async () => {
    try {
      await namespaceInstaller.createIfDoesntExist();
    } catch (err) {
      await namespaceInstaller.deleteIfExists();
      throw new Error('Failed to create a namespace:', err);
    }

    await retry(async () => {
      const data = await common.beforeAll(t => (token = t));
      browser = data.browser;
      page = data.page;
    });
  });

  afterAll(async () => {
    await namespaceInstaller.deleteIfExists();
    if (browser) {
      await browser.close();
    }
  });

  test('Expose API for Service', async () => {
    const apiName = 'ui-test-exposed-api';
    let frame, exposedApiCellTexts, serviceUrl, service;

    function callExposedAPI({ expectedStatusCode }) {
      const req = {
        url: `https://${apiName}.${config.domain}`,
        method: 'GET',
        // TODO: Analyze problem with UNABLE_TO_VERIFY_LEAF_SIGNATURE
        rejectUnauthorized: false,
      };

      return new Promise((resolve, reject) => {
        request(req, (error, response) => {
          if (error) {
            reject(error);
          }
          if (!response) {
            resolve('request returned no response');
          }
          if (response.statusCode !== expectedStatusCode) {
            resolve(
              `expected status code ${expectedStatusCode}, received ${response.statusCode}`,
            );
          }
          resolve(true);
        });
      });
    }

    async function getCellsText() {
      await frame.waitForSelector('[data-e2e-id=exposed-api-name]');
      return {
        name: (await kymaConsole.getTextContentOnPageBySelector(
          page,
          '[data-e2e-id=exposed-api-name]',
        ))[0],
        secured: (await kymaConsole.getTextContentOnPageBySelector(
          page,
          '[data-e2e-id=exposed-api-secured]',
        ))[0],
        idp: (await kymaConsole.getTextContentOnPageBySelector(
          page,
          '[data-e2e-id=exposed-api-idp]',
        ))[0],
      };
    }

    // Create k8s resources
    const deploymentApi = await new k8sApiDeployment(namespaceUnderTest);
    service = await new k8sApiService(namespaceUnderTest);
    await deploymentApi.waitUntilCreated(40000);

    serviceUrl = address.console.getService(
      namespaceUnderTest,
      service.definition.metadata.name,
    );

    await Promise.all([
      page.goto(serviceUrl),
      page.waitForNavigation({
        waitUntil: ['domcontentloaded', 'networkidle0'],
      }),
      (frame = await kymaConsole.waitForConsoleCoreFrame(page, true)),
    ]);

    // Before exposing API
    console.log('Exposed API should retrieve 404 (does not exist)');
    await callExposedAPI(404);

    // Expose API (not secured)
    await frame.click('[data-e2e-id=open-expose-api]');
    await frame.waitForSelector('#host-input');
    await frame.type('#host-input', apiName);
    await frame.click('[data-e2e-id=save-expose-api]');

    exposedApiCellTexts = await getCellsText();
    expect(exposedApiCellTexts.name).toEqual(` http-db-service-${apiName} `);
    expect(exposedApiCellTexts.secured).toEqual(`No`);
    expect(exposedApiCellTexts.idp).toEqual('-');

    console.log('Exposed API should retrieve 200 (not secured)');
    await retryInterval(
      () => callExposedAPI({ expectedStatusCode: 200 }),
      1000,
      60,
    );

    // Expose API (secured)
    await kymaConsole.openLinkOnFrame(
      page,
      '[data-e2e-id=exposed-api-name]',
      `http-db-service-${apiName}`,
    );
    await frame.waitForSelector('[data-e2e-id=secure-api-checkbox]');
    await frame.click('[data-e2e-id=secure-api-checkbox]');
    await frame.click('[data-e2e-id=save-expose-api]');

    exposedApiCellTexts = await getCellsText();
    expect(exposedApiCellTexts.name).toEqual(` http-db-service-${apiName} `);
    expect(exposedApiCellTexts.secured).toEqual(`Yes`);
    expect(exposedApiCellTexts.idp).toEqual('DEX');

    console.log('Exposed API should retrieve 401 (secured)');
    await retryInterval(() =>
      callExposedAPI({ expectedStatusCode: 401 }, 1000, 60),
    );
  });

  test('Check if Application exist', async () => {
    const applicationsUrl = address.console.getApplications();
    await Promise.all([
      page.goto(applicationsUrl),
      page.waitForNavigation({
        waitUntil: ['domcontentloaded', 'networkidle0'],
      }),
    ]);
    const applications = await kymaConsole.getApplicationNames(page);
    console.log('Check if application exists', applications);
    expect(applications).not.toContain(config.testApp);
  });

  testPluggable(REQUIRED_MODULE, 'Create Application', async () => {
    await kymaConsole.createApplication(page, config.testApp);
    const applications = await kymaConsole.getApplicationNames(page);
    expect(applications).toContain(config.testApp);
  });

  testPluggable(REQUIRED_MODULE, 'Go to details and back', async () => {
    const frame = await kymaConsole.waitForConsoleCoreFrame(page);
    await frame.waitForXPath(
      `//a[contains(@data-e2e-id, 'application-name') and contains(string(), "${config.testApp}")]`,
    );
    await kymaConsole.openLinkOnFrame(
      page,
      '[data-e2e-id=application-name]',
      config.testApp,
    );
    frame.waitForXPath(`//td[contains(string(), "${config.testApp}")]`);
    frame.waitForXPath(`//h1[contains(string(), "General Information")]`);

    frame.waitForSelector('.fd-breadcrumb__link');
    frame.click('.fd-breadcrumb__link');
  });

  testPluggable(REQUIRED_MODULE, 'Delete Application', async () => {
    const frame = await kymaConsole.waitForConsoleCoreFrame(page);
    await frame.waitForXPath(
      `//a[contains(@data-e2e-id, 'application-name') and contains(string(), "${config.testApp}")]`,
    );
    const initialApplications = await kymaConsole.getApplicationNames(page);
    await kymaConsole.deleteApplication(page, config.testApp);
    const applications = await retry(async () => {
      const applicationsAfterRemoval = await kymaConsole.getApplicationNames(
        page,
      );
      if (initialApplications <= applicationsAfterRemoval) {
        throw new Error(`Application ${config.testApp} was not yet removed`);
      }
      return applicationsAfterRemoval;
    }, 5);
    expect(applications).not.toContain(config.testApp);
  });
});
