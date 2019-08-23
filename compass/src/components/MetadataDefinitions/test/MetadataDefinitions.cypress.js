describe('Cypress', () => {
  beforeEach(() => {
    cy.log(process.env.MOCK_GQL_ENDPOINT);
    cy.readFile(
      '/Users/i354699/Sites/kyma-incubator/compass/components/director/pkg/graphql/schema.graphql',
      'utf8',
    ).then(schema => {
      cy.server();
      cy.route({
        method: 'POST', // Route all GET requests
        url: '/abc', // that have a URL that matches '/users/*'
        response: [{ a: 123 }], // and force the response to be: []
      });
      // cy.mockGraphql({
      //   schema,

      //   endpoint: `http://localhost:8888/abc`,
      //   operations: {
      //     runtimes: {
      //       data: [{ name: 'mocked', description: 'desc' }],
      //     },
      //   },
      // });
    });
  });
  it('is working', () => {
    // cy.server().route({
    //   url: 'https://compass-gateway.kyma.local/director/graphql',
    //   method: 'POST',
    //   response: {
    //     data: {
    //       labelDefinitions: [{ key: 'teskey', schema: null }],
    //     },
    //   },
    // // });
    // cy.server();
    // cy.route({
    //   method: 'POST', // Route all GET requests
    //   url: '/abc', // that have a URL that matches '/users/*'
    //   response: [{ a: 123 }], // and force the response to be: []
    // });
    cy.mockGraphQl(({ operationName, variables }) => {
      return { data: { a: 123 } };
    });

    cy.visit('/tenant/A/runtimes', {});

    expect(true).to.equal(true);
  });
});
