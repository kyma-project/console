import { getAllServiceClasses } from '../components/catalog/ServiceClassList/queries';
import { getServiceClass } from '../components/catalog/ServiceClassDetails/queries';
import { getServiceClassPlans } from '../components/catalog/ServiceClassPlansList/queries';
import { createServiceInstance } from '../components/catalog/ServiceClassDetails/CreateInstanceModal/mutations';
import {
  mockServiceClass,
  mockPlan,
  planWithImagePullPolicy,
} from './serviceClassesMocks';
import { filterExtensions } from '../variables';
import { DOCUMENTATION_PER_PLAN_LABEL } from '../shared/constants';

export const mockEnvironmentId = 'testnamespace';

const otherRequestParams = {
  externalServiceClassName: mockServiceClass(1).externalName,
  externalPlanName: planWithImagePullPolicy.externalName,
  classClusterWide: false, // is calculated by component
  planClusterWide: false, // is calculated by component
  labels: [],
  parameterSchema: { imagePullPolicy: 'IfNotPresent' },
};

// getAllServiceClasses query
export const allServiceClassesQuery = {
  request: {
    query: getAllServiceClasses,
    variables: {
      namespace: mockEnvironmentId,
    },
  },
  result: {
    data: {
      clusterServiceClasses: [1, 2, 3, 4].map(n => mockServiceClass(n, true)), // all clusterServiceClasses are addons to make testing easier
      serviceClasses: [1, 2, 3].map(n => mockServiceClass(n, false, [], true)), // all serviceClasses are services to make testing easier
    },
  },
};

//getServiceClass query
export const serviceClassWithPlans = {
  request: {
    query: getServiceClass,
    variables: {
      namespace: mockEnvironmentId,
      name: mockServiceClass(1, true).name,
      fileExtensions: filterExtensions,
    },
  },
  result: {
    data: {
      clusterServiceClass: mockServiceClass(1, true, [
        mockPlan(1, true),
        mockPlan(2, true),
      ]),
      serviceClass: null,
    },
  },
};

export const serviceClassAPIruleQuery = plans => ({
  request: {
    query: getServiceClass,
    variables: {
      namespace: mockEnvironmentId,
      name: mockServiceClass(1, false).name,
      fileExtensions: filterExtensions,
    },
  },
  result: {
    data: {
      clusterServiceClass: null,
      serviceClass: {
        ...mockServiceClass(1, false, plans),
        labels: { [DOCUMENTATION_PER_PLAN_LABEL]: 'true' },
      },
    },
  },
});

//getServiceClassPlans query
export const serviceClassPlansQuery = {
  request: {
    query: getServiceClassPlans,
    variables: {
      namespace: mockEnvironmentId,
      name: mockServiceClass(1).name,
    },
  },
  result: {
    data: {
      clusterServiceClass: null,
      serviceClass: mockServiceClass(1, false, [mockPlan(1), mockPlan(2)]),
    },
  },
};

export const serviceClassNoPlansQuery = {
  request: {
    query: getServiceClassPlans,
    variables: {
      namespace: mockEnvironmentId,
      name: mockServiceClass(1).name,
    },
  },
  result: {
    data: {
      clusterServiceClass: null,
      serviceClass: mockServiceClass(1),
    },
  },
};

export const createServiceInstanceSuccessfulMock = name => {
  return {
    request: {
      query: createServiceInstance,
      variables: {
        namespace: mockEnvironmentId,
        name,
        ...otherRequestParams,
      },
    },
    result: jest.fn().mockReturnValue({
      data: {
        createServiceInstance: {
          namespace: mockEnvironmentId,
          name,
          parameters: {},
        },
      },
    }),
  };
};

export const createServiceInstanceNoPlanSpecSuccessfulMock = name => {
  const { parameterSchema, ...params } = otherRequestParams;
  return {
    request: {
      query: createServiceInstance,
      variables: {
        namespace: mockEnvironmentId,
        name,
        parameterSchema: {},
        ...params,
        externalPlanName: mockPlan(1).externalName,
      },
    },
    result: jest.fn().mockReturnValue({
      data: {
        createServiceInstance: {
          namespace: mockEnvironmentId,
          name,
          parameters: {},
        },
      },
    }),
  };
};

export const createServiceInstanceErrorMock = name => ({
  request: {
    query: createServiceInstance,
    variables: {
      namespace: mockEnvironmentId,
      name,
      ...otherRequestParams,
    },
  },
  error: new Error('Instace already exists'),
});
