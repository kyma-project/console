import { getAllServiceClasses } from '../components/ServiceClassList/queries';
import { getServiceClass } from '../components/ServiceClassDetails/queries';
import { getServiceClassPlans } from '../components/ServiceClassPlansList/queries';
import { createServiceInstance } from '../components/ServiceClassDetails/CreateInstanceModal/mutations';
import {
  clusterServiceClass1,
  clusterServiceClass2,
  serviceClass1,
  clusterServiceClass1Name,
  clusterServiceClassDetails,
  clusterServiceClass3,
  serviceClass2,
  serviceClassWithoutPlans,
  serviceClassWithPlans,
  serviceClassWithAPIrule,
} from './serviceClassesMocks';
import { filterExtensions } from '../variables';

export const mockEnvironmentId = 'testnamespace';

const otherParams = {
  externalServiceClassName: clusterServiceClassDetails.externalName,
  externalPlanName: clusterServiceClassDetails.plans[0].externalName,
  classClusterWide: true, // is calculated by component
  planClusterWide: true, // is calculated by component
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

export const moreThanAllServiceClassesQuery = {
  request: {
    query: getAllServiceClasses,
    variables: {
      namespace: mockEnvironmentId,
    },
  },
  result: {
    data: {
      clusterServiceClasses: [
        clusterServiceClass1,
        clusterServiceClass2,
        clusterServiceClass3,
      ],
      serviceClasses: [serviceClass1, serviceClass2],
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

export const serviceClassPlansQuery = {
  request: {
    query: getServiceClassPlans,
    variables: {
      namespace: mockEnvironmentId,
      name: clusterServiceClass1Name,
    },
  },
  result: {
    data: {
      clusterServiceClass: null,
      serviceClass: serviceClassWithPlans,
    },
  },
};

export const serviceClassNoPlansQuery = {
  request: {
    query: getServiceClassPlans,
    variables: {
      namespace: mockEnvironmentId,
      name: clusterServiceClass1Name,
    },
  },
  result: {
    data: {
      clusterServiceClass: null,
      serviceClass: serviceClassWithoutPlans,
    },
  },
};

export const serviceClassAPIruleQuery = {
  request: {
    query: getServiceClass,
    variables: {
      namespace: mockEnvironmentId,
      name: serviceClassWithAPIrule.name,
      fileExtensions: filterExtensions,
    },
  },
  result: {
    data: {
      clusterServiceClass: null,
      serviceClass: serviceClassWithAPIrule,
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

export const createServiceInstanceNoPlanSpecSuccessfulMock = () => {
  const { parameterSchema, ...params } = otherParams;
  return {
    request: {
      query: createServiceInstance,
      variables: {
        namespace: mockEnvironmentId,
        name: clusterServiceClass1Name,
        parameterSchema: {},
        ...params,
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
