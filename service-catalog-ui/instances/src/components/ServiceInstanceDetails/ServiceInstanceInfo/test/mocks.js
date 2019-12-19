export const instanceAllAttributes = {
  name: 'sth-motherly-deposit',
  namespace: 'default',
  planSpec: { imagePullPolicy: 'IfNotPresent' },
  labels: ['tets', 'sth'],
  bindable: true,
  status: {
    type: 'RUNNING',
    message: 'The instance was provisioned successfully',
    __typename: 'ServiceInstanceStatus',
  },
  serviceClass: null,
  clusterServiceClass: {
    name: 'a2257daa-0e26-4c61-a68d-8a7453c1b767',
    displayName: 'Sth.',
    externalName: 'redsthis',
    description:
      '[Experimental] Redis by Helm Broker. This is an example add-on. It is not recommended for production scenarios.',
    documentationUrl: 'https://example.com/docs',
    supportUrl: 'https://example.com/support',
    labels: { experimental: 'true', local: 'true' },
    clusterAssetGroup: {
      name: 'a2257daa-0e26-4c61-a68d-8a7453c1b767',
      groupName: '',
      displayName: 'Documentation for sth',
      description: 'Overall documentation',
      assets: [
        {
          name:
            'a2257daa-0e26-4c61-a68d-8a7453c1b767-markdown-files-markdown-1bh3139cq9rss',
          metadata: {},
          type: 'markdown',
          files: [
            {
              url: 'https://example.com/docs.yaml',
              metadata: null,
              __typename: 'File',
            },
          ],
          __typename: 'ClusterAsset',
        },
      ],
      __typename: 'ClusterAssetGroup',
    },
    __typename: 'ClusterServiceClass',
  },
  servicePlan: null,
  clusterServicePlan: {
    name: 'a6078798-70a1-4674-af90-aba364dd6a56',
    displayName: 'Enterprise',
    externalName: 'enterprise',
    description: 'Enterprise plan',
    instanceCreateParameterSchema: {
      $schema: 'http://json-schema.org/draft-04/schema#',
      properties: {
        imagePullPolicy: {
          default: 'IfNotPresent',
          enum: ['Always', 'IfNotPresent', 'Never'],
          title: 'Image pull policy',
          type: 'string',
        },
      },
      type: 'object',
    },
    bindingCreateParameterSchema: null,
    relatedClusterServiceClassName: 'a2257daa-0e26-4c61-a68d-8a7453c1b767',
    __typename: 'ClusterServicePlan',
  },
  serviceBindings: {
    items: [],
    stats: {
      ready: 0,
      failed: 0,
      pending: 0,
      unknown: 0,
      __typename: 'ServiceBindingsStats',
    },
    __typename: 'ServiceBindings',
  },
  serviceBindingUsages: [],
  __typename: 'ServiceInstance',
};
