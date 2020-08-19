/// <reference types="cypress" />
import config from '../../config';

export const ADDRESS = `${
  config.localDev ? 'http://console-dev' : 'https://console'
}.${config.domain}${config.localDev ? ':4200' : ''}`;

context('Console Smoke Tests', () => {
  before(() => {
    cy.window().then(win => win.sessionStorage.clear());
    cy.clearLocalStorage();

    cy.visit(ADDRESS);
    cy.get('#login').type(config.login);
    cy.get('#password').type(config.password);
    cy.get('#submit-login').click();
  });

  beforeEach(() => {
    // return to main view
    cy.visit(ADDRESS);
    // wait until all the pushStates calm down
    cy.wait(1000);
  });

  it('Renders navigation nodes', () => {
    ['Namespaces', 'Integration', 'Administration'].forEach(node => {
      cy.contains(node).should('exist');
    });
  });

  it('Renders namespaces details', () => {
    cy.getIframeBody().then(result => {
      cy.wrap(result)
        .contains(config.DEFAULT_NAMESPACE_NAME)
        .click();
      cy.wrap(result)
        .contains('Connected Applications')
        .should('exist');
    });
  });

  it('Renders deployments', () => {
    cy.getIframeBody().then(result => {
      cy.wrap(result)
        .contains(config.DEFAULT_NAMESPACE_NAME)
        .click();
      cy.contains('Operation').click();
      cy.contains('Deployments').click();

      cy.getIframeBody().then(result => {
        cy.wrap(result)
          .contains('Deployments')
          .should('exist');
      });
    });
  });

  it('Renders cluster addons', () => {
    cy.contains('Integration').click();
    cy.contains('Cluster Addons').click();
    cy.getIframeBody().then(result => {
      cy.wrap(result)
        .contains('Cluster Addons Configuration')
        .should('exist');
    });
  });

  it('Renders logging', () => {
    cy.contains('Diagnostics').click();
    cy.contains('Logs').click();
    cy.getIframeBody().then(result => {
      cy.wrap(result)
        .contains('Logs')
        .should('exist');
    });
  });

  it('Renders catalog', () => {
    cy.getIframeBody().then(result => {
      cy.wrap(result)
        .contains(config.DEFAULT_NAMESPACE_NAME)
        .click();
      cy.contains('Service Management').click();
      cy.contains('Catalog').click();

      cy.getIframeBody().then(result => {
        cy.wrap(result)
          .contains('Service Catalog')
          .should('exist');
      });
    });
  });
});
