import { GET_SECRET_DETAILS } from 'gql/queries';
import { SECRET_EVENT_SUBSCRIPTION_LIST } from 'gql/subscriptions';

export const namespace = 'test-namespace';
export const name = 'test-name';
export const secretName = 'test-secret-name';

export const secretQueryMock = {
  request: {
    query: GET_SECRET_DETAILS,
    variables: { namespace, name },
  },
  result: {
    data: {
      secret: {
        name,
        namespace,
        data: {},
        json: {},
        creationTime: '1599547622',
        annotations: {
          annotation1: 'avalue1',
          annotation2: 'avalue2',
        },
        labels: {
          label1: 'avalue1',
          label2: 'avalue2',
        },
      },
    },
  },
};
