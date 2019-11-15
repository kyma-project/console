const clusterServiceClass1Name = 'testName';

const clusterServiceClass1 = {
  activated: false,
  description:
    '[Experimental] Redis by Helm Broker. This is an example add-on. It is not recommended for production scenarios.',
  displayName: '[Experimental] Redis',
  externalName: 'redis',
  imageUrl: 'https://cdn.auth0.com/blog/logos/redis-icon-logo.png',
  instances: [],
  labels: { experimental: 'true', local: 'true' },
  name: clusterServiceClass1Name,
  providerDisplayName: 'bitnami',
  tags: ['database', 'cache', 'experimental'],
  __typename: 'ClusterServiceClass',
};

const clusterServiceClass2 = {
  activated: false,
  description: 'Enables the integration of Google Cloud Platform services.',
  displayName: 'GCP Service Broker',
  externalName: 'gcp-service-broker',
  imageUrl:
    'https://cloud.google.com/_static/images/cloud/icons/favicons/onecloud/apple-icon.png',
  instances: [],
  labels: { local: 'true', provisionOnlyOnce: 'true' },
  name: 'cbc4ce74-b402-4ff6-b230-2a079cf1706d',
  providerDisplayName: 'Google Cloud Platform',
  tags: ['gcp', 'google', 'broker'],
  __typename: 'ClusterServiceClass',
};

const serviceClass1 = {
  activated: false,
  description: 'Short desc for Orders API',
  displayName: 'Orders',
  externalName: 'orders-48ab05bf',
  imageUrl: '',
  instances: [],
  labels: { 'connected-app': 'ec-prod', provisionOnlyOnce: 'true' },
  name: '48ab05bf-9aa4-4cb7-8999-0d3587265ac3',
  providerDisplayName: 'HakunaMatata',
  tags: [],
  __typename: 'ServiceClass',
};

const clusterServiceClassDetails = {
  activated: false,
  clusterDocsTopic: {
    assets: [
      {
        name:
          clusterServiceClass1Name + '-markdown-files-markdown-1bh3139cq9rss',
        metadata: {},
        type: 'markdown',
        files: [
          {
            url: `https://minio.kyma.local/cms-public-1bh0bsi3h986i-1bh0bsi4uv44e/${clusterServiceClass1Name}-markdown-files-markdown-1bh3139cq9rss/docs/meta.yaml`,
            metadata: null,
            __typename: 'File',
          },
          {
            url: `https://minio.kyma.local/cms-public-1bh0bsi3h986i-1bh0bsi4uv44e/${clusterServiceClass1Name}-markdown-files-markdown-1bh3139cq9rss/docs/overview.md`,
            metadata: { title: 'Overview', type: 'Overview' },
            __typename: 'File',
          },
          {
            url: `https://minio.kyma.local/cms-public-1bh0bsi3h986i-1bh0bsi4uv44e/${clusterServiceClass1Name}-markdown-files-markdown-1bh3139cq9rss/docs/plans-details.md`,
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
    description: 'Overall documentation',
    displayName: 'Documentation for redis',
    groupName: '',
    name: clusterServiceClass1Name,
    __typename: 'ClusterDocsTopic',
  },
  creationTimestamp: 1572525371,
  description:
    '[Experimental] Redis by Helm Broker. This is an example add-on. It is not recommended for production scenarios.',
  displayName: '[Experimental] Redis',
  documentationUrl: 'https://github.com/bitnami/bitnami-docker-redis',
  externalName: 'redis',
  imageUrl: 'https://cdn.auth0.com/blog/logos/redis-icon-logo.png',
  instances: [],
  labels: { experimental: 'true', local: 'true' },
  longDescription:
    '[Experimental] Redis by Helm Broker. This is an example add-on. It is not recommended for production scenarios. Redis is an advanced key-value cache and store.',
  name: clusterServiceClass1Name,
  plans: [
    {
      displayName: 'Enterprise',
      externalName: 'enterprise',
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
      name: 'a6078798-70a1-4674-af90-aba364dd6a56',
      relatedClusterServiceClassName: clusterServiceClass1Name,
      __typename: 'ClusterServicePlan',
    },
  ],
  providerDisplayName: 'bitnami',
  supportUrl: 'https://bitnami.com/support',
  tags: ['database', 'cache', 'experimental'],
  __typename: 'ClusterServiceClass',
};

export {
  clusterServiceClass1,
  clusterServiceClass2,
  serviceClass1,
  clusterServiceClass1Name,
  clusterServiceClassDetails,
};
