import { BROKERS_QUERY } from '../queries';

export const namespace = 'test-namespace';

export const fixBrokersQuery = serviceBrokers => ({
  request: {
    query: BROKERS_QUERY,
    variables: { namespace: namespace },
  },
  result: { data: { serviceBrokers } },
});

export const broker = {
  name: 'test-name',
  namespace,
  labels: {},
  url: 'test-url',
  creationTimestamp: '',
  status: {
    ready: true,
    reason: '',
    message: '',
  },
};
