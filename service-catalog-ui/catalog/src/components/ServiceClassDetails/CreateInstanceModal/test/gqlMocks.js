import { createServiceInstance } from '../mutations';

const instanceVariables = {
  classClusterWide: true,
  externalPlanName: 'micro',
  externalServiceClassName: 'redis',
  labels: ['d'],
  name: 'redis-known-engineering',
  namespace: 'default',
  parameterSchema: {
    imagePullPolicy: 'IfNotPresent',
  },
  planClusterWide: true,
};

const instance = {
  namespace: 'default',
  params: {
    name: 'redis-known-engineering',
    classRef: {
      externalName: 'redis',
      clusterWide: true,
    },
    planRef: {
      externalName: 'redis',
      clusterWide: true,
    },
    labels: ['d'],
    parameterSchema: {
      imagePullPolicy: 'IfNotPresent',
    },
  },
};

export const createServiceInstanceSuccessfulMock = () => {
  return {
    request: {
      query: createServiceInstance,
      variables: instanceVariables,
    },
    result: jest
      .fn()
      .mockReturnValue({ data: { createServiceInstance: instance } }),
  };
};

export const createServiceInstanceErrorMock = () => ({
  request: {
    query: createServiceInstance,
    variables: instanceVariables,
  },
  error: new Error('Instance already exists'),
});
