import {
  CREATE_LIMIT_RANGE,
  CREATE_NAMESPACE,
  CREATE_RESOURCE_QUOTA,
} from '../../../gql/mutations';

const createLimitRangeSuccessfulMock = () => ({
  request: {
    query: CREATE_LIMIT_RANGE,
    variables: {
      limitRange: {
        max: {
          memory: '1Gi',
        },
        default: {
          memory: '512Mi',
        },
        defaultRequest: {
          memory: '32Mi',
        },
        type: 'Container',
      },
      namespace: '',
      name: '',
    },
  },
  result: jest.fn().mockReturnValue({ data: {} }),
});

const createResourceQuotaSuccessfulMock = () => ({
  request: {
    query: CREATE_RESOURCE_QUOTA,
    variables: {
      resourceQuota: {
        limits: {
          memory: '3Gi',
        },
        requests: {
          memory: '2.8Gi',
        },
      },
      name: '',
      namespace: '',
    },
  },
  result: jest.fn().mockReturnValue({ data: {} }),
});

const createNamespaceSuccessfulMock = () => ({
  request: {
    query: CREATE_NAMESPACE,
    variables: { name: '', labels: {} },
  },
  result: jest.fn().mockReturnValue({ data: {} }),
});

const createNamespaceErrorMock = () => ({
  request: {
    query: CREATE_NAMESPACE,
    variables: { name: '', labels: {} },
  },
  error: new Error(':('),
});

const createResourceQuotaErrorMock = () => ({
  request: {
    query: CREATE_RESOURCE_QUOTA,
    variables: {
      resourceQuota: {
        limits: {
          memory: '3Gi',
        },
        requests: {
          memory: '2.8Gi',
        },
      },
      name: '',
      namespace: '',
    },
  },
  error: new Error(':('),
});

export {
  createLimitRangeSuccessfulMock,
  createResourceQuotaSuccessfulMock,
  createNamespaceSuccessfulMock,
  createNamespaceErrorMock,
  createResourceQuotaErrorMock,
};
