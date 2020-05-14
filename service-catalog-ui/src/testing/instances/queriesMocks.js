import {
  getAllServiceInstances,
  getServiceInstanceDetails,
} from 'helpers/instancesGQL/queries';
import { deleteServiceInstance } from 'helpers/instancesGQL/mutations';
import { mockTestNamespace } from 'testing';
import { BINDING_CREATE_MUTATION } from 'components/ServiceInstanceDetails/ServiceInstanceBindings/mutations';
import {
  serviceInstance1,
  serviceInstance2,
  serviceInstance3,
} from './instanceMocks';

export const allServiceInstancesQuery = {
  request: {
    query: getAllServiceInstances,
    variables: {
      namespace: mockTestNamespace,
    },
  },
  result: {
    data: {
      serviceInstances: [serviceInstance1, serviceInstance2, serviceInstance3],
    },
  },
};

export const serviceInstanceQuery = {
  request: {
    query: getServiceInstanceDetails,
    variables: {
      namespace: mockTestNamespace,
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
      namespace: mockTestNamespace,
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
      namespace: mockTestNamespace,
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
