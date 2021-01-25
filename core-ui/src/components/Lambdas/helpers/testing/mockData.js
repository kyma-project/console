export const lambdaMock = {
  name: 'lambda-pico-bello',
  namespace: 'namespace',
  UID: 'pico-bello-123',
  labels: {
    foo: 'bar',
    pico: 'bello',
  },
  source: 'source',
  dependencies: '{dependencies}',
  replicas: {
    min: 1,
    max: 1,
  },
  resources: {
    requests: {
      memory: '512Mi',
      cpu: '100m',
    },
    limits: {
      memory: '512Mi',
      cpu: '100m',
    },
  },
  buildResources: {
    requests: {
      memory: '700Mi',
      cpu: '700m',
    },
    limits: {
      memory: '1100Mi',
      cpu: '1100m',
    },
  },
  runtime: 'nodejs12',
  env: [
    {
      name: 'FOO',
      value: 'bar',
      valueFrom: null,
    },
    {
      name: 'PICO',
      valueFrom: {
        name: 'secret',
        key: 'KEY',
        type: 'Secret',
        optional: false,
      },
    },
    {
      name: 'BAR',
      valueFrom: {
        name: 'cm',
        key: 'KEY',
        type: 'ConfigMap',
        optional: false,
      },
    },
  ],
  status: {
    phase: 'INITIALIZING',
    reason: '',
    message: '',
  },
};

export const gitLambdaMock = {
  ...lambdaMock,
  name: 'lambda-pico-bello',
  namespace: 'namespace',
  UID: 'pico-bello-123',
  labels: {
    foo: 'bar',
    pico: 'bello',
  },
  source: 'repository-name',
  sourceType: 'git',
  reference: 'reference',
  baseDir: 'baseDir',
};

export const repositoryMock = {
  name: 'repository-pico-bello',
  namespace: 'namespace',
  spec: {
    url: 'https://example.git',
    auth: {
      type: 'basic',
      secretName: 'secret-name',
    },
  },
};

export const eventActivationMock = {
  name: 'eventActivation',
  displayName: 'Sample Event Activation',
  sourceId: 'mockApp',
  events: [
    {
      eventType: 'type',
      version: 'v1',
      description: 'Sample description',
      schema: {},
    },
    {
      eventType: 'type',
      version: 'v2',
      description: 'Sample description',
      schema: {},
    },
  ],
};

export const eventTriggerMock = {
  name: 'eventTrigger',
  namespace: 'namespace',
  spec: {
    broker: 'default',
    filter: {
      source: 'mockApp',
      eventtypeversion: 'v1',
      type: 'type',
    },
    port: 80,
    path: '/',
  },
  status: {
    reason: 'reason',
    status: 'status',
  },
};

export const serviceBindingUsageMock = {
  name: 'serviceBindingUsage',
  parameters: {
    envPrefix: {
      name: 'PREFIX_',
    },
  },
  serviceBinding: {
    name: 'serviceBinding',
    serviceInstanceName: 'serviceInstanceName',
    secret: {
      name: 'secret',
      data: {
        FOO: 'foo',
        BAR: 'bar',
      },
    },
  },
};

export const serviceInstanceMock = {
  name: 'serviceInstance',
  bindable: true,
  servicePlan: {
    bindingCreateParameterSchema: {},
  },
  serviceBindings: {
    items: [
      {
        name: 'serviceBinding',
        parameters: '',
        secret: {
          name: 'secret',
          data: {},
        },
      },
    ],
  },
};

export const configMapMock = {
  json: {
    data: {
      key: 'value',
    },
  },
};

export const serviceMock = {
  name: 'name',
};
