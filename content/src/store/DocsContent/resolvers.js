export default {
  Query: {
    clusterDocsTopics: (_, args, { cache }) => {
      const clusterDocsTopics = {
        root: [
          {
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
                      'https://raw.githubusercontent.com/kyma-project/kyma/master/docs/kyma/docs/12-01-try-out-kyma.md',
                    metadata: {
                      __typename: 'fileMetadata',
                      title: 'Kyma features and concepts in practice',
                      type: 'Examples',
                    },
                  },
                ],
              },
            ],
          },
        ],
        components: [
          {
            __typename: 'clusterDocsTopic',
            name: 'console',
            groupName: 'components',
            displayName: 'Console',
            description: 'Overall documentation for Console',
            assets: [
              {
                __typename: 'clusterAsset',
                name: 'asset1',
                type: 'markdown',
                files: [
                  {
                    __typename: 'file',
                    url:
                      'https://raw.githubusercontent.com/kyma-project/kyma/master/docs/console/docs/01-01-console.md',
                    metadata: {
                      __typename: 'fileMetadata',
                      title: 'Overview',
                      type: 'Overview',
                    },
                  },
                  {
                    __typename: 'file',
                    url:
                      'https://raw.githubusercontent.com/kyma-project/kyma/master/docs/console/docs/03-01-uiextensibility.md',
                    metadata: {
                      __typename: 'fileMetadata',
                      title: 'UI extensibility',
                      type: 'Details',
                    },
                  },
                  {
                    __typename: 'file',
                    url:
                      'https://raw.githubusercontent.com/kyma-project/kyma/master/docs/console/docs/03-02-console-backend-service.md',
                    metadata: {
                      __typename: 'fileMetadata',
                      title: 'Console Backend Service',
                      type: 'Details',
                    },
                  },
                  {
                    __typename: 'file',
                    url:
                      'https://raw.githubusercontent.com/kyma-project/kyma/master/docs/console/docs/03-03-CR-security-guidelines.md',
                    metadata: {
                      __typename: 'fileMetadata',
                      title:
                        'Security guidelines for MicroFrontend and ClusterMicroFrontend CRs',
                      type: 'Details',
                    },
                  },
                  {
                    __typename: 'file',
                    url:
                      'https://raw.githubusercontent.com/kyma-project/kyma/master/docs/console/docs/06-01-microfrontend.md',
                    metadata: {
                      __typename: 'fileMetadata',
                      title: 'MicroFrontend',
                      type: 'Custom Resource',
                    },
                  },
                ],
              },
            ],
          },
          {
            __typename: 'clusterDocsTopic',
            name: 'asset-store',
            groupName: 'components',
            displayName: 'Asset Store',
            description: 'Overall documentation for Asset Store',
            assets: [
              {
                __typename: 'clusterAsset',
                name: 'asset1',
                type: 'markdown',
                files: [
                  {
                    __typename: 'file',
                    url:
                      'https://raw.githubusercontent.com/kyma-project/kyma/master/docs/asset-store/docs/01-01-asset-store.md',
                    metadata: {
                      __typename: 'fileMetadata',
                      title: 'Overview',
                    },
                  },
                  {
                    __typename: 'file',
                    url:
                      'https://raw.githubusercontent.com/kyma-project/kyma/master/docs/asset-store/docs/02-01-asset-store.md',
                    metadata: {
                      __typename: 'fileMetadata',
                      title: 'Architecture',
                    },
                  },
                  {
                    __typename: 'file',
                    url:
                      'https://raw.githubusercontent.com/kyma-project/kyma/master/docs/asset-store/docs/03-01-asset-cr-lifecycle.md',
                    metadata: {
                      __typename: 'fileMetadata',
                      title: 'Asset custom resource lifecycle',
                      type: 'Details',
                    },
                  },
                  {
                    __typename: 'file',
                    url:
                      'https://raw.githubusercontent.com/kyma-project/kyma/master/docs/asset-store/docs/03-02-bucket-cr-lifecycle.md',
                    metadata: {
                      __typename: 'fileMetadata',
                      title: 'Bucket custom resource lifecycle',
                      type: 'Details',
                    },
                  },
                ],
              },
            ],
          },
        ],
      };
      cache.writeData({
        data: {
          clusterDocsTopics: clusterDocsTopics[args.groupName],
        },
      });

      return clusterDocsTopics[args.groupName];
    },
  },
};
