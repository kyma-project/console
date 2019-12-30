const clusterServiceClass1Name = 'testName';

const clusterServiceClass1 = {
  activated: false,
  description: 'Test description 1',
  displayName: 'cluster displayName1',
  externalName: 'cluster-service-class-name-1',
  imageUrl: 'https://sth.co/sth.png',
  instances: [],
  labels: { experimental: 'true', local: 'true' },
  name: clusterServiceClass1Name,
  providerDisplayName: 'provider1',
  tags: ['tag1'],
  __typename: 'ClusterServiceClass',
};

const clusterServiceClass2 = {
  activated: false,
  description: 'Test description 2',
  displayName: 'cluster displayName2',
  externalName: 'cluster-service-class-name-2',
  imageUrl: 'https://sth.co/sth.png',
  instances: [],
  labels: { local: 'true', provisionOnlyOnce: 'true' },
  name: '124',
  providerDisplayName: 'provider2',
  tags: ['tag1', 'tag2', 'tag3'],
  __typename: 'ClusterServiceClass',
};

const clusterServiceClass3 = {
  activated: false,
  description: 'Test description 1',
  displayName: 'cluster3 displayName1',
  externalName: 'cluster-service-class-name-3',
  imageUrl: 'https://sth.co/sth.png',
  instances: [],
  labels: { local: 'true', provisionOnlyOnce: 'true' },
  name: '123',
  providerDisplayName: 'provider3',
  tags: ['tag1', 'tag2', 'tag3'],
  __typename: 'ClusterServiceClass',
};

const serviceClass1 = {
  activated: false,
  description: 'Description 1',
  displayName: 'serviceClass displayName1',
  externalName: 'service-class-name-1',
  imageUrl: '',
  instances: [],
  labels: { provisionOnlyOnce: 'true' },
  name: '4123',
  providerDisplayName: 'HakunaMatataprovider1',
  tags: [],
  __typename: 'ServiceClass',
};

const serviceClass2 = {
  activated: false,
  description: 'Description 2',
  displayName: 'serviceClass displayName2',
  externalName: 'service-class-name-1',
  imageUrl: '',
  instances: [],
  labels: { provisionOnlyOnce: 'true' },
  name: '4124',
  providerDisplayName: 'HakunaMatataprovider2',
  tags: [],
  __typename: 'ServiceClass',
};

const clusterServiceClassDetails = {
  activated: false,
  clusterAssetGroup: {
    assets: [
      {
        name:
          clusterServiceClass1Name + '-markdown-files-markdown-1bh3139cq9rss',
        parameters: {},
        type: 'markdown',
        files: [
          {
            url: 'https://sth.co/sth.yaml',
            metadata: null,
            __typename: 'File',
          },
          {
            url: 'https://sth.co/sth.yaml',
            metadata: { title: 'Overview', type: 'Overview' },
            __typename: 'File',
          },
          {
            url: 'https://sth.co/sth.yaml',
            metadata: {
              title: 'Services and Plans',
              type: 'Details',
            },
            __typename: 'File',
          },
        ],
        __typename: 'ClusterAsset',
      },
    ],
    description: 'Description clusterAssetGroup',
    displayName: clusterServiceClass1Name,
    groupName: '',
    name: clusterServiceClass1Name,
    __typename: 'ClusterAssetGroup',
  },
  creationTimestamp: 1572525371,
  description: 'Description',
  displayName: 'displayName',
  documentationUrl: 'https://sth.co',
  externalName: 'cluster-service-class-external-name',
  imageUrl: 'https://sth.co/sth.png',
  instances: [],
  labels: { experimental: 'true', local: 'true' },
  longDescription: 'Long description',
  name: clusterServiceClass1Name,
  plans: [
    {
      displayName: 'Plan1',
      externalName: 'plan1',
      instanceCreateParameterSchema: {
        $schema: 'http://json-schema.org/draft-04/schema#',
        properties: {
          imagePullPolicy: {
            default: 'IfNotPresent',
            enum: ['Always', 'IfNotPresent', 'Never'],
            title: 'Field title',
            type: 'string',
          },
        },
        type: 'object',
      },
      name: '1235456',
      relatedClusterServiceClassName: clusterServiceClass1Name,
      __typename: 'ClusterServicePlan',
    },
  ],
  providerDisplayName: 'provider',
  supportUrl: 'https://sth.com/support',
  tags: ['database', 'cache', 'experimental'],
  __typename: 'ClusterServiceClass',
};

const clusterServiceClassDetailsNoPlanSpec = {
  activated: false,
  clusterAssetGroup: {
    assets: [
      {
        name:
          clusterServiceClass1Name + '-markdown-files-markdown-1bh3139cq9rss',
        parameters: {},
        type: 'markdown',
        files: [
          {
            url: 'https://sth.co/sth.yaml',
            metadata: null,
            __typename: 'File',
          },
          {
            url: 'https://sth.co/sth.yaml',
            metadata: { title: 'Overview', type: 'Overview' },
            __typename: 'File',
          },
          {
            url: 'https://sth.co/sth.yaml',
            metadata: {
              title: 'Services and Plans',
              type: 'Details',
            },
            __typename: 'File',
          },
        ],
        __typename: 'ClusterAsset',
      },
    ],
    description: 'Description clusterAssetGroup',
    displayName: clusterServiceClass1Name,
    groupName: '',
    name: clusterServiceClass1Name,
    __typename: 'ClusterAssetGroup',
  },
  creationTimestamp: 1572525371,
  description: 'Description',
  displayName: 'displayName',
  documentationUrl: 'https://sth.co',
  externalName: 'cluster-service-class-external-name',
  imageUrl: 'https://sth.co/sth.png',
  instances: [],
  labels: { experimental: 'true', local: 'true' },
  longDescription: 'Long description',
  name: clusterServiceClass1Name,
  plans: [
    {
      displayName: 'Plan1',
      externalName: 'plan1',
      instanceCreateParameterSchema: null,
      name: '1235456',
      relatedClusterServiceClassName: clusterServiceClass1Name,
      __typename: 'ClusterServicePlan',
    },
  ],
  providerDisplayName: 'provider',
  supportUrl: 'https://sth.com/support',
  tags: ['database', 'cache', 'experimental'],
  __typename: 'ClusterServiceClass',
};

export {
  clusterServiceClass1,
  clusterServiceClass2,
  clusterServiceClass3,
  serviceClass1,
  serviceClass2,
  clusterServiceClass1Name,
  clusterServiceClassDetails,
  clusterServiceClassDetailsNoPlanSpec,
};
