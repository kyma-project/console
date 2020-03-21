export const lambdaMock = {
  name: 'lambda',
  namespace: 'namespace',
  UID: 'pico-bello-123',
  labels: {
    foo: 'bar',
    pico: 'bello',
  },
  runtime: 'nodejs8',
  size: 'S',
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
  broker: 'default',
  filterAttributes: {
    source: 'mockApp',
    eventtypeversion: 'v1',
    type: 'type',
  },
  status: {
    reason: 'reason',
    status: 'status',
  },
};
