/// <reference types="cypress" />
import config from '../../config';

const ADDRESS = `${
  config.localDev ? 'http://console-dev' : 'https://console'
}.${config.domain}${config.localDev ? ':4200' : ''}`;

context('Console Smoke Tests', () => {
  before(() => {
    cy.window().then(win => win.sessionStorage.clear());
    cy.clearLocalStorage();

    cy.visit(ADDRESS)
      .handleLoginMethod()
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
    cy.title().then(cy.log);
    ['Namespaces', 'Integration', 'Administration'].forEach(node => {
      cy.contains(node).should('exist');
    });
  });

  it('Renders namespaces details', () => {
    cy.title().then(cy.log);
    cy.getIframeBody().then(result => {
      cy.wrap(result)
        .contains(config.DEFAULT_NAMESPACE_NAME)
        .click()
        .get('body')
        .contains('Namespaces')
        .should('exist');
    });
  });

  it('Renders deployments', () => {
    cy.title().then(cy.log);
    cy.getIframeBody().then(result => {
      cy.wrap(result)
        .contains(config.DEFAULT_NAMESPACE_NAME)
        .click()
        .get('body')
        .contains('Operation')
        .click()
        .get('body')
        .contains('Deployments')
        .click()
        .getIframeBody()
        .then(result => {
          cy.wrap(result)
            .contains('Deployments')
            .should('exist');
        });
    });
  });

  it('Renders cluster addons', () => {
    cy.title().then(cy.log);
    cy.contains('Integration')
      .click()
      .get('body')
      .contains('Cluster Addons')
      .click()
      .getIframeBody()
      .then(result => {
        cy.wrap(result)
          .contains('Cluster Addons Configuration')
          .should('exist');
      });
  });

  if (config.loggingEnabled) {
    it('Renders logging', () => {
      cy.title().then(cy.log);
      cy.contains('Diagnostics')
        .click()
        .get('body')
        .contains('Logs')
        .click()
        .getIframeBody()
        .then(result => {
          cy.wrap(result)
            .contains('Logs')
            .should('exist');
        });
    });
  }

  if (config.serviceCatalogEnabled) {
    it('Renders catalog', () => {
      cy.title().then(cy.log);
      // todo make awaitable?
      cy.getIframeBody().then(result => {
        cy.wrap(result)
          .contains(config.DEFAULT_NAMESPACE_NAME)
          .click()
          .get('body')
          .contains('Service Management')
          .click()
          .get('body')
          .contains('Catalog')
          .click()
          .getIframeBody()
          .then(result => {
            cy.wrap(result)
              .contains('Service Catalog')
              .should('exist');
          });
      });
    });
  }
});
