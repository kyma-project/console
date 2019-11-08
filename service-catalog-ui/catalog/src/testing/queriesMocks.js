import { getAllServiceClasses } from '../components/ServiceClassList/queries';
import { getServiceClass } from '../components/ServiceClassDetails/queries';
import { serviceInstance } from '../components/ServiceClassDetails/CreateInstanceModal/queries';
import { createServiceInstance } from '../components/ServiceClassDetails/mutations';
import {
  clusterServiceClass1,
  clusterServiceClass2,
  serviceClass1,
  clusterServiceClass1Name,
  clusterServiceClassDetails,
} from './serviceClassesMocks';

import builder from '../commons/builder';

const filterExtensions = ['md', 'xml', 'json', 'yml', 'yaml'];
export const allServiceClassesQuery = {
  request: {
    query: getAllServiceClasses,
    variables: {
      namespace: builder.getCurrentEnvironmentId(),
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
      namespace: builder.getCurrentEnvironmentId(),
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

export const createInstanceMutation = {
  request: {
    query: createServiceInstance,
    variables: {
      namespace: builder.getCurrentEnvironmentId(),
      serviceInstanceName: 'redis-motherly-deposit',
      parameters: {},
    },
  },
  result: jest.fn().mockReturnValue({
    data: {
      createServiceBinding: {
        name: 'mystifying-colden',
      },
    },
  }),
};

export const getInstanceName = {
  request: {
    query: serviceInstance,
    variables: {
      name: '',
      namespace: builder.getCurrentEnvironmentId(),
    },
  },
  result: {
    data: {
      name: '',
    },
  },
};
