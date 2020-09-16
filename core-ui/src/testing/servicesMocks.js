const service1 = {
  name: 'test',
  clusterIP: '10.10.100.100',
  creationTimestamp: '1599733727',
  labels: {
    label: 'test-1',
  },
  ports: [
    {
      port: 80,
      serviceProtocol: 'TCP',
      __typename: 'ServicePort',
    },
  ],
  __typename: 'Service',
};

const service2 = {
  name: 'another',
  clusterIP: '11.11.111.111',
  creationTimestamp: '1599733727',
  labels: {
    label: 'test-2',
  },
  ports: [
    {
      port: 80,
      serviceProtocol: 'TCP',
      __typename: 'ServicePort',
    },
    {
      port: 8080,
      serviceProtocol: 'TCP',
      __typename: 'ServicePort',
    },
  ],
  __typename: 'Service',
};

export { service1, service2 };
