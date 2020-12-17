/// <reference types="cypress" />
import config from '../config';

const ADDRESS = config.localDev
  ? `http://console-dev.${config.domain}:4200`
  : `https://console.${config.domain}`;

context('Console Smoke Tests', () => {
  before(() => {
    cy.clearSessionStorage().clearLocalStorage();

    cy.visit(ADDRESS)
      .wait(5000) // wait for redirect, as chooseLoginMethod is synchronous
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
    cy.wait(1000)
      .visit(ADDRESS + '/home/workspace')
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
      .contains('Workloads')
      .click()
      .get('body')
      .contains('Deployments')
      .click()
      .getIframeBody()
      .contains('Deployments')
      .should('exist');
  });

  /*
    investigate failing test
    either addons or cluster addons test fails regulary on minikube (but they pass on gke)
    a same situation was happening with Testcafe
  */
  // it('Renders cluster addons', () => {
  //   cy.contains('Integration')
  //     .click()
  //     .get('body')
  //     .contains('Cluster Addons')
  //     .click()
  //     .getIframeBody()
  //     .contains('Cluster Addons Configuration')
  //     .should('exist');
  // });

  /*
    This is (probably) caused by Angular. Disabled until we rewrite this component to React.
  */
  // if (!config.disableLegacyConnectivity || true) {
  //   it('Renders applications', () => {
  //     cy.contains('Integration')
  //       .click()
  //       .get('body')
  //       .contains('Applications/Systems')
  //       .click()
  //       .getIframeBody()
  //       .contains('Applications/Systems')
  //       .should('exist');
  //   });
  // }

  if (config.serviceCatalogEnabled) {
    it('Renders service catalog', () => {
      cy.getIframeBody()
        .contains(config.DEFAULT_NAMESPACE_NAME)
        .click()
        .get('body')
        .contains('Service Management')
        .click()
        // catalog
        .get('body')
        .contains('Catalog')
        .click()
        .getIframeBody()
        .contains('Service Catalog')
        .should('exist')
        // instances
        .get('body')
        .contains('Instances')
        .click()
        .getIframeBody()
        .contains('Service Instances')
        // brokers
        .get('body')
        .contains('Brokers')
        .click()
        .getIframeBody()
        .contains('Service Brokers');
    });
  }

  if (config.functionsEnabled) {
    it('Renders functions', () => {
      cy.getIframeBody()
        .contains(config.DEFAULT_NAMESPACE_NAME)
        .click()
        .get('body')
        .contains('Workloads')
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
