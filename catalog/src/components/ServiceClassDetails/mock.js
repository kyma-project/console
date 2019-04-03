export const Mock = {
  __typename: 'clusterDocsTopic',
  name: 'kyma',
  groupName: 'root',
  displayName: 'Kyma',
  description: 'Overall documentation for Kyma',
  assets: [
    {
      __typename: 'clusterAsset',
      name: 'asset1',
      type: 'markdown',
      files: [
        {
          __typename: 'file',
          url:
            'https://raw.githubusercontent.com/kyma-project/kyma/master/docs/kyma/docs/01-01-in-a-nutshell.md',
          metadata: {
            __typename: 'fileMetadata',
            title: 'In a nutshell',
            type: 'Overview',
          },
        },
        {
          __typename: 'file',
          url:
            'https://raw.githubusercontent.com/kyma-project/kyma/master/docs/kyma/docs/04-01-overview.md',
          metadata: {
            __typename: 'fileMetadata',
            title: 'Overview',
            type: 'Installation',
          },
        },
        {
          __typename: 'file',
          url:
            'https://raw.githubusercontent.com/kyma-project/kyma/master/docs/kyma/docs/04-03-cluster-installation.md',
          metadata: {
            __typename: 'fileMetadata',
            // title: 'Install Kyma on a cluster',
            type: 'Installation',
          },
        },
        {
          __typename: 'file',
          url:
            'https://raw.githubusercontent.com/kyma-project/kyma/master/docs/kyma/docs/12-01-try-out-kyma.md',
          metadata: {
            __typename: 'fileMetadata',
            type: 'Examples',
            title: 'Try out Kyma',
          },
        },
      ],
    },
  ],
};
