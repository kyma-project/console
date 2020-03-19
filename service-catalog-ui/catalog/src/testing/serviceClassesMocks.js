export const mockServiceClass = (
  id,
  isCluster = false,
  plans = [],
  isLocal = false,
) => ({
  activated: false,
  description: 'Test description ' + id,
  displayName: 'cluster displayName' + id,
  externalName: 'cluster-service-class-name-' + id,
  imageUrl: 'https://sth.co/sth.png',
  instances: [],
  plans,
  labels: { local: isLocal.toString(), provisionOnlyOnce: 'true' },
  name: (isCluster ? 'cluster' : 'nonCluster') + '_' + id,
  providerDisplayName:
    (isCluster ? 'cluster' : 'nonCluster') + '_provider' + id,
  tags: ['tag1', 'tag2', 'tag3'],
  creationTimestamp: 123,
  __typename: isCluster ? 'ClusterServiceClass' : 'ServiceClass',
});

export const mockPlan = (id, isCluster = false) => ({
  displayName: 'Plan' + id,
  externalName: 'plan' + id,
  name: 'test-plan' + id,
  __typename: isCluster ? 'ClusterServicePlan' : 'ServicePlan',
});

export const planWithImagePullPolicy = {
  displayName: 'Plan123',
  externalName: 'plan123',
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

  __typename: 'ClusterServicePlan',
};

export const assetOfType = (type, name) => ({
  name,
  parameters: {},
  type,
  files: [
    {
      url: 'https://sth.co/sth.yaml',
      metadata: null,
    },
    {
      url: 'https://sth.co/sth.yaml',
      metadata: { title: 'Overview', type: 'Overview' },
    },
    {
      url: 'https://sth.co/sth.yaml',
      metadata: {
        title: 'Services and Plans',
        type: 'Details',
      },
    },
  ],
});

export const assetGroupWithManyAssets = {
  description: 'this assetgroup has many different assets',
  displayName: 'assetGroupWithManyAssets',
  groupName: '',
  name: 'assetGroupWithManyAssets',
  assets: [
    assetOfType('openapi', 'openapi1'),
    assetOfType('openapi', 'openapi2'),
    assetOfType('openapi', 'openapi3'),
    assetOfType('asyncapi', 'asyncapi1'),
    assetOfType('asyncapi', 'asyncapi2'),
    assetOfType('odata', 'odata1'),
  ],
};
