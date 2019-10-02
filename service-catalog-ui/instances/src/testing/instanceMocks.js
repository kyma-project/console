const serviceInstance1 = {
  name: 'redis-motherly-deposit',
  namespace: 'default',
  planSpec: { imagePullPolicy: 'IfNotPresent' },
  labels: [],
  bindable: true,
  status: {
    type: 'RUNNING',
    message: 'The instance was provisioned successfully',
    __typename: 'ServiceInstanceStatus',
  },
  serviceClass: null,
  clusterServiceClass: {
    name: 'a2257daa-0e26-4c61-a68d-8a7453c1b767',
    displayName: '[Experimental] Redis',
    externalName: 'redis',
    description:
      '[Experimental] Redis by Helm Broker. This is an example add-on. It is not recommended for production scenarios.',
    documentationUrl: 'https://github.com/bitnami/bitnami-docker-redis',
    supportUrl: 'https://bitnami.com/support',
    labels: { experimental: 'true', local: 'true' },
    clusterDocsTopic: {
      name: 'a2257daa-0e26-4c61-a68d-8a7453c1b767',
      groupName: '',
      displayName: 'Documentation for redis',
      description: 'Overall documentation',
      assets: [
        {
          name:
            'a2257daa-0e26-4c61-a68d-8a7453c1b767-markdown-files-markdown-1bh3139cq9rss',
          metadata: {},
          type: 'markdown',
          files: [
            {
              url:
                'https://minio.kyma.local/cms-public-1bh0bsi3h986i-1bh0bsi4uv44e/a2257daa-0e26-4c61-a68d-8a7453c1b767-markdown-files-markdown-1bh3139cq9rss/docs/meta.yaml',
              metadata: null,
              __typename: 'File',
            },
            {
              url:
                'https://minio.kyma.local/cms-public-1bh0bsi3h986i-1bh0bsi4uv44e/a2257daa-0e26-4c61-a68d-8a7453c1b767-markdown-files-markdown-1bh3139cq9rss/docs/overview.md',
              metadata: { title: 'Overview', type: 'Overview' },
              __typename: 'File',
            },
            {
              url:
                'https://minio.kyma.local/cms-public-1bh0bsi3h986i-1bh0bsi4uv44e/a2257daa-0e26-4c61-a68d-8a7453c1b767-markdown-files-markdown-1bh3139cq9rss/docs/plans-details.md',
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
      __typename: 'ClusterDocsTopic',
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
    items: [
      {
        name: 'eloquent-visvesvaraya',
        namespace: 'default',
        parameters: {},
        secret: {
          name: 'eloquent-visvesvaraya',
          data: {
            HOST:
              'hb-redis-enterprise-c6ca8420-d71f-11e9-9df2-b636baf2f-redis.default.svc.cluster.local',
            PORT: '6379',
            REDIS_PASSWORD: 'JdZVEax5Hr',
          },
          namespace: 'default',
          __typename: 'Secret',
        },
        serviceInstanceName: 'redis-motherly-deposit',
        status: {
          type: 'READY',
          reason: 'InjectedBindResult',
          message: 'Injected bind result',
          __typename: 'ServiceBindingStatus',
        },
        __typename: 'ServiceBinding',
      },
    ],
    stats: {
      ready: 1,
      failed: 0,
      pending: 0,
      unknown: 0,
      __typename: 'ServiceBindingsStats',
    },
    __typename: 'ServiceBindings',
  },
  serviceBindingUsages: [
    {
      name: 'nifty-ramanujan',
      namespace: 'default',
      serviceBinding: {
        name: 'eloquent-visvesvaraya',
        serviceInstanceName: 'redis-motherly-deposit',
        secret: {
          name: 'eloquent-visvesvaraya',
          data: {
            HOST:
              'hb-redis-enterprise-c6ca8420-d71f-11e9-9df2-b636baf2f-redis.default.svc.cluster.local',
            PORT: '6379',
            REDIS_PASSWORD: 'JdZVEax5Hr',
          },
          __typename: 'Secret',
        },
        __typename: 'ServiceBinding',
      },
      status: {
        type: 'READY',
        reason: '',
        message: '',
        __typename: 'ServiceBindingUsageStatus',
      },
      usedBy: {
        name: 'hb-redis-enterprise-c6ca8420-d71f-11e9-9df2-b636baf2f-redis',
        kind: 'deployment',
        __typename: 'LocalObjectReference',
      },
      parameters: {
        envPrefix: { name: '', __typename: 'EnvPrefix' },
        __typename: 'ServiceBindingUsageParameters',
      },
      __typename: 'ServiceBindingUsage',
    },
  ],
  __typename: 'ServiceInstance',
};

const serviceInstance2 = {
  name: 'testing-curly-tax',
  namespace: 'default',
  planSpec: {},
  labels: [],
  bindable: false,
  status: {
    type: 'RUNNING',
    message: 'The instance was provisioned successfully',
    __typename: 'ServiceInstanceStatus',
  },
  serviceClass: null,
  clusterServiceClass: {
    name: 'faebbe18-0a84-11e9-ab14-d663bd873d94',
    displayName: 'Testing addon',
    externalName: 'testing',
    description:
      'A simple addon which contains a ConfigMap and a Deployment. Binding returns one value with the ConfigMap name.',
    documentationUrl: '',
    supportUrl: '',
    labels: { local: 'true', showcase: 'true' },
    clusterDocsTopic: {
      name: 'faebbe18-0a84-11e9-ab14-d663bd873d94',
      groupName: '',
      displayName: 'Documentation for testing-0.0.1',
      description: 'Overall documentation',
      assets: [
        {
          name:
            'faebbe18-0a84-11e9-ab14-d663bd873d94-asyncapi-asyncapi-1bh3139eumhm1',
          metadata: {},
          type: 'asyncapi',
          files: [
            {
              url:
                'https://minio.kyma.local/cms-public-1bh0bsi3h986i-1bh0bsi4uv44e/faebbe18-0a84-11e9-ab14-d663bd873d94-asyncapi-asyncapi-1bh3139eumhm1/docs/streetlights.yml',
              metadata: null,
              __typename: 'File',
            },
          ],
          __typename: 'ClusterAsset',
        },
        {
          name:
            'faebbe18-0a84-11e9-ab14-d663bd873d94-docs-markdown-1bh3139elqg75',
          metadata: {},
          type: 'markdown',
          files: [
            {
              url:
                'https://minio.kyma.local/cms-public-1bh0bsi3h986i-1bh0bsi4uv44e/faebbe18-0a84-11e9-ab14-d663bd873d94-docs-markdown-1bh3139elqg75/docs/assets/hodor.png',
              metadata: null,
              __typename: 'File',
            },
            {
              url:
                'https://minio.kyma.local/cms-public-1bh0bsi3h986i-1bh0bsi4uv44e/faebbe18-0a84-11e9-ab14-d663bd873d94-docs-markdown-1bh3139elqg75/docs/configuration.md',
              metadata: { title: 'Configuration' },
              __typename: 'File',
            },
            {
              url:
                'https://minio.kyma.local/cms-public-1bh0bsi3h986i-1bh0bsi4uv44e/faebbe18-0a84-11e9-ab14-d663bd873d94-docs-markdown-1bh3139elqg75/docs/overview.md',
              metadata: { title: 'Overview' },
              __typename: 'File',
            },
            {
              url:
                'https://minio.kyma.local/cms-public-1bh0bsi3h986i-1bh0bsi4uv44e/faebbe18-0a84-11e9-ab14-d663bd873d94-docs-markdown-1bh3139elqg75/docs/plans-details.md',
              metadata: { title: 'Services and Plans' },
              __typename: 'File',
            },
            {
              url:
                'https://minio.kyma.local/cms-public-1bh0bsi3h986i-1bh0bsi4uv44e/faebbe18-0a84-11e9-ab14-d663bd873d94-docs-markdown-1bh3139elqg75/docs/tutorial-deployment.md',
              metadata: {
                title: 'Sample Hodor deployment',
                type: 'Tutorials',
              },
              __typename: 'File',
            },
            {
              url:
                'https://minio.kyma.local/cms-public-1bh0bsi3h986i-1bh0bsi4uv44e/faebbe18-0a84-11e9-ab14-d663bd873d94-docs-markdown-1bh3139elqg75/docs/tutorial-publish.md',
              metadata: {
                title: 'Publish Hodor image',
                type: 'Tutorials',
              },
              __typename: 'File',
            },
            {
              url:
                'https://minio.kyma.local/cms-public-1bh0bsi3h986i-1bh0bsi4uv44e/faebbe18-0a84-11e9-ab14-d663bd873d94-docs-markdown-1bh3139elqg75/docs/tutorial.md',
              metadata: { title: 'Tutorial', type: 'Details' },
              __typename: 'File',
            },
          ],
          __typename: 'ClusterAsset',
        },
        {
          name:
            'faebbe18-0a84-11e9-ab14-d663bd873d94-openapi-openapi-1bh3139gtjqs4',
          metadata: {},
          type: 'openapi',
          files: [
            {
              url:
                'https://minio.kyma.local/cms-public-1bh0bsi3h986i-1bh0bsi4uv44e/faebbe18-0a84-11e9-ab14-d663bd873d94-openapi-openapi-1bh3139gtjqs4/docs/swagger.json',
              metadata: null,
              __typename: 'File',
            },
          ],
          __typename: 'ClusterAsset',
        },
      ],
      __typename: 'ClusterDocsTopic',
    },
    __typename: 'ClusterServiceClass',
  },
  servicePlan: null,
  clusterServicePlan: {
    name: '631dae68-98e1-4e45-b79f-1036ca5b29cb',
    displayName: 'Minimal',
    externalName: 'minimal',
    description: 'Minimal plan which contains only necessary parameters.',
    instanceCreateParameterSchema: null,
    bindingCreateParameterSchema: null,
    relatedClusterServiceClassName: 'faebbe18-0a84-11e9-ab14-d663bd873d94',
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

export { serviceInstance1, serviceInstance2 };
