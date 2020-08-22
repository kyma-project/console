/// <reference types="cypress" />
import config from '../../config';

const ADDRESS = config.localDev
  ? `https://console.${config.domain}`
  : `http://console-dev.${config.domain}:4200`;

context('Console Smoke Tests', () => {
  before(() => {
    cy.window().then(win => win.sessionStorage.clear());
    cy.clearLocalStorage();

    cy.visit(ADDRESS)
      .chooseLoginMethod()
      .get('#login')
      .type(config.login)
      .get('#password')
      .type(config.password)
      .get('#submit-login')
      .click()
      .handleInvalidLoginData();
  });

  beforeEach(() => {
    // return to main view
    cy.visit(ADDRESS + '/home/workspace')
      // wait for all pushStates to calm down
      .wait(3000);
  });

  it('Renders navigation nodes', () => {
    ['Namespaces', 'Integration', 'Administration'].forEach(node => {
      cy.contains(node).should('exist');
    });
  });

  it('Renders namespaces details', () => {
    cy.getIframeBody()
      .contains(config.DEFAULT_NAMESPACE_NAME)
      .click()
      .get('body')
      .contains('Namespaces')
      .should('exist');
  });

  it('Renders deployments', () => {
    cy.getIframeBody()
      .contains(config.DEFAULT_NAMESPACE_NAME)
      .click()
      .get('body')
      .contains('Operation')
      .click()
      .get('body')
      .contains('Deployments')
      .click()
      .getIframeBody()
      .contains('Deployments')
      .should('exist');
  });

  it('Renders cluster addons', () => {
    cy.contains('Integration')
      .click()
      .get('body')
      .contains('Cluster Addons')
      .click()
      .getIframeBody()
      .contains('Cluster Addons Configuration')
      .should('exist');
  });

  if (config.loggingEnabled) {
    it('Renders logging', () => {
      cy.contains('Diagnostics')
        .click()
        .get('body')
        .contains('Logs')
        .click()
        .getIframeBody()
        .contains('Logs')
        .should('exist');
    });
  }

  if (config.serviceCatalogEnabled) {
    it('Renders catalog', () => {
      cy.getIframeBody()
        .contains(config.DEFAULT_NAMESPACE_NAME)
        .click()
        .get('body')
        .contains('Service Management')
        .click()
        .get('body')
        .contains('Catalog')
        .click()
        .getIframeBody()
        .contains('Service Catalog')
        .should('exist');
    });
  }

  if (config.functionsEnabled) {
    it('Renders functions', () => {
      cy.getIframeBody()
        .contains(config.DEFAULT_NAMESPACE_NAME)
        .click()
        .get('body')
        .contains('Development')
        .click()
        .get('body')
        .contains('Functions')
        .click()
        .getIframeBody()
        .contains('Functions')
        .should('exist');
    });
  }
});
