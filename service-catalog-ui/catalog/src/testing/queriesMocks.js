import { getAllServiceClasses } from '../components/ServiceClassList/queries';
import { getServiceClass } from '../components/ServiceClassDetails/queries';
import { checkInstanceExist } from '../components/ServiceClassDetails/CreateInstanceModal/queries';
import { createServiceInstance } from '../components/ServiceClassDetails/CreateInstanceModal/mutations';
import {
  clusterServiceClass1,
  clusterServiceClass2,
  serviceClass1,
  clusterServiceClass1Name,
  clusterServiceClassDetails,
} from './serviceClassesMocks';

import builder from '../commons/builder';

export const mockEnvironmentId = 'testnamespace';

const filterExtensions = ['md', 'xml', 'json', 'yml', 'yaml'];
const otherParams = {
  externalServiceClassName: clusterServiceClassDetails.externalName,
  externalPlanName: clusterServiceClassDetails.plans[0].externalName,
  classClusterWide: true, //
  planClusterWide: true,
  labels: [],
  parameterSchema: { imagePullPolicy: 'IfNotPresent' },
};

export const allServiceClassesQuery = {
  request: {
    query: getAllServiceClasses,
    variables: {
      namespace: mockEnvironmentId,
    },
  },
  result: {
    data: {
      clusterServiceClasses: [clusterServiceClass1, clusterServiceClass2],
      serviceClasses: [serviceClass1],
    },
  },
};

export const serviceClassQuery = {
  request: {
    query: getServiceClass,
    variables: {
      namespace: mockEnvironmentId,
      name: clusterServiceClass1Name,
      fileExtensions: filterExtensions,
    },
  },
  result: {
    data: {
      clusterServiceClass: clusterServiceClassDetails,
      serviceClass: null,
    },
  },
};

export const createServiceInstanceSuccessfulMock = () => {
  return {
    request: {
      query: createServiceInstance,
      variables: {
        namespace: mockEnvironmentId,
        name: clusterServiceClass1Name,
        ...otherParams,
      },
    },
    result: jest.fn().mockReturnValue({
      data: {
        createServiceInstance: {
          namespace: mockEnvironmentId,
          name: clusterServiceClass1Name,
          parameters: {},
        },
      },
    }),
  };
};

export const createServiceInstanceErrorMock = () => ({
  request: {
    query: createServiceInstance,
    variables: {
      namespace: mockEnvironmentId,
      name: clusterServiceClass1Name,
      ...otherParams,
    },
  },
  error: new Error('Instace already exists'),
});
