Cypress.Commands.overwrite('log', (_, message) => cy.task('log', message));

Cypress.Commands.add('clearSessionStorage', () =>
  cy.window().then(win => win.sessionStorage.clear()),
);

Cypress.Commands.add('chooseLoginMethod', $elem => {
  const loginButtonn = Cypress.$('#login');
  if (loginButtonn.length === 0) {
    cy.log('Multiple login methods detected, choosing the email method...');
    return cy
      .wrap($elem)
      .contains('Log in with Email')
      .click()
      .get('body');
  } else {
    cy.log('One login method detected, trying to login using email...');
    return cy.wrap($elem).get('body');
  }
});

Cypress.Commands.add('handleInvalidLoginData', $elem => {
  const loginErrorAlert = Cypress.$('#login-error');
  if (loginErrorAlert.length !== 0) {
    throw Error(`Login failed with message: ${loginErrorAlert.text()}`);
  }
  return cy.wrap($elem);
});
