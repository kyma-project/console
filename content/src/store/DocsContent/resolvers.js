export default {
  Mutation: {
    setDocsLoadingStatus: (_, args, { cache }) => {
      const docsLoadingStatus = {
        __typename: 'DocsLoadingStatus',
        docsLoadingStatus: args.docsLoadingStatus,
      };
      cache.writeData({ data: docsLoadingStatus });
      return docsLoadingStatus;
    },
  },
};
