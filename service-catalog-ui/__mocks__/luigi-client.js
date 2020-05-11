jest.mock('@kyma-project/luigi-client', () => ({
  getContext: () => ({
    namespaceId: 'testnamespace',
  }),
}));
