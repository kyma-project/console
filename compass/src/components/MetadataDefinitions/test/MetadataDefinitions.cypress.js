describe('Cypress', () => {
  it('is working', () => {
    cy.visit('/');
    expect(true).to.equal(true);
  });
});
