import { createPublicKey } from 'crypto';

describe('MetadataDefinitionsDetails', () => {
  it(`Renders "Loading name..." when there's no GQL response`, () =>
    cy
      .getIframeAtURL('/tenant/A/metadata-definitions/details/nonexisting')
      .then(ifrBody =>
        cy.wrap(ifrBody).contains('.fd-action-bar__header', 'Loading name...'),
      ));
  it(`Renders the name`, () =>
    cy
      .getIframeAtURL('/tenant/A/metadata-definitions/details/noschemalabel')
      .then(ifrBody =>
        cy.wrap(ifrBody).contains('.fd-action-bar__header', 'noschemalabel'),
      ));

  describe('Schema is provided', () => {
    it(`Renders Panel with toggle set to ON`, () =>
      cy
        .getIframeAtURL(
          '/tenant/A/metadata-definitions/details/labelWithValidSchema',
        )
        .then(ifrBody =>
          cy
            .wrap(ifrBody)
            .find('.fd-panel .fd-toggle input')
            .invoke('attr', 'checked')
            .should('exist'),
        ));

    it(`Renders JSONeditor`, () =>
      cy
        .getIframeAtURL(
          '/tenant/A/metadata-definitions/details/labelWithValidSchema',
        )
        .then(ifrBody =>
          cy
            .wrap(ifrBody)
            .find('.jsoneditor')
            .should('be.visible'),
        ));

    it(`"Save" button is enabled by default`, () =>
      cy
        .getIframeAtURL(
          '/tenant/A/metadata-definitions/details/labelWithValidSchema',
        )
        .then(ifrBody =>
          cy
            .wrap(ifrBody)
            .find('.fd-button--emphasized')
            .invoke('attr', 'disabled')
            .should('not.exist'),
        ));
  });

  describe('Schema is not provided', () => {
    it(`Renders Panel with toggle set to OFF`, () =>
      cy
        .getIframeAtURL('/tenant/A/metadata-definitions/details/noschemalabel')
        .then(ifrBody =>
          cy
            .wrap(ifrBody)
            .find('.fd-panel .fd-toggle input')
            .invoke('attr', 'checked')
            .should('not.exist'),
        ));

    it(`Does not render JSONeditor`, () =>
      cy
        .getIframeAtURL('/tenant/A/metadata-definitions/details/noschemalabel')
        .then(ifrBody =>
          cy
            .wrap(ifrBody)
            .find('.jsoneditor')
            .should('not.be.visible'),
        ));

    it(`"Save" button is enabled by default`, () =>
      cy
        .getIframeAtURL('/tenant/A/metadata-definitions/details/noschemalabel')
        .then(ifrBody =>
          cy
            .wrap(ifrBody)
            .find('.fd-button--emphasized')
            .invoke('attr', 'disabled')
            .should('not.exist'),
        ));
  });
});
