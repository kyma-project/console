const service1 = {
  name: 'test',
  ports: [
    {
      port: 80,
      __typename: 'ServicePort',
    },
  ],
  __typename: 'Service',
};

const service2 = {
  name: 'another',
  ports: [
    {
      port: 80,
      __typename: 'ServicePort',
    },
    {
      port: 8080,
      __typename: 'ServicePort',
    },
  ],
  __typename: 'Service',
};

export { service1, service2 };
