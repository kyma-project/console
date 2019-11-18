import {
  getAllServiceInstances,
  getServiceInstanceDetails,
} from '../queries/queries';
import { deleteServiceInstance } from '../queries/mutations';
import { BINDING_CREATE_MUTATION } from '../components/ServiceInstanceDetails/ServiceInstanceBindings/mutations';
import { serviceInstance1, serviceInstance2 } from './instanceMocks';

import builder from '../commons/builder';

export const allServiceInstancesQuery = {
  request: {
    query: getAllServiceInstances,
    variables: {
      namespace: builder.getCurrentEnvironmentId(),
    },
  },
  result: {
    data: {
      serviceInstances: [serviceInstance1, serviceInstance2],
    },
  },
};

export const serviceInstanceQuery = {
  request: {
    query: getServiceInstanceDetails,
    variables: {
      namespace: builder.getCurrentEnvironmentId(),
      name: 'sth-motherly-deposit',
    },
  },
  result: {
    data: {
      serviceInstance: serviceInstance1,
    },
  },
};

export const serviceInstanceDeleteMutation = {
  request: {
    query: deleteServiceInstance,
    variables: {
      namespace: builder.getCurrentEnvironmentId(),
      name: 'sth-motherly-deposit',
    },
  },
  result: jest.fn().mockReturnValue({
    data: {
      deleteServiceInstance: {
        ...serviceInstance1,
      },
    },
  }),
};

export const createBindingMutation = {
  request: {
    query: BINDING_CREATE_MUTATION,
    variables: {
      namespace: builder.getCurrentEnvironmentId(),
      serviceInstanceName: 'sth-motherly-deposit',
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

export function serviceInstancesSubscription(type) {
  return {
    result: {
      data: {
        serviceInstanceEvent: {
          type: type,
          serviceInstance: serviceInstance2,
          __typename: 'ServiceInstanceEvent',
        },
      },
    },
  };
}
