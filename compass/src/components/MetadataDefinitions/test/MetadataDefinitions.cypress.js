describe('MetadataDefinitions', () => {
  it(`opens "Add definition" modal`, () =>
    cy.getIframeAtURL('/tenant/A/metadata-definitions').then(ifrBody => {
      cy.wrap(ifrBody)
        .find('[test-id="create-label-modal-button"]')
        .click();

      return cy
        .wrap(ifrBody)
        .find('[test-id="create-label-modal"]')
        .should('be.visible');
    }));
  it('renders GenericList component', () =>
    cy.getIframeAtURL('/tenant/A/metadata-definitions').then(ifrBody =>
      cy
        .wrap(ifrBody)
        .find('[test-id="generic-list"]')
        .first()
        .should('be.visible'),
    ));
});
