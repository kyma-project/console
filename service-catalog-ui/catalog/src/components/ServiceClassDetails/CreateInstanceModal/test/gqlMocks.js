import { createServiceInstance } from '../mutations';

const instanceVariables = {
  classClusterWide: true,
  externalPlanName: 'micro',
  externalServiceClassName: 'externalServiceClassName',
  labels: ['d'],
  name: 'name',
  namespace: 'default',
  parameterSchema: {
    imagePullPolicy: 'IfNotPresent',
  },
  planClusterWide: true,
};

const instance = {
  namespace: 'default',
  params: {
    name: 'name',
    classRef: {
      externalName: 'externalServiceClassName',
      clusterWide: true,
    },
    planRef: {
      externalName: 'externalServiceClassName',
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
