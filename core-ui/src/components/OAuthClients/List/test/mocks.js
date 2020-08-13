import { GET_OAUTH_CLIENTS } from 'gql/queries';
import { OAUTH_CLIENT_EVENT_SUBSCRIPTION } from 'gql/subscriptions';

export const namespace = 'namespace';

export const clients = [
  {
    name: 'client-1',
    error: null,
    spec: { secretName: 'secret-name-1' },
  },
  {
    name: 'client-2',
    error: null,
    spec: { secretName: 'secret-name-2' },
  },
];

const queryMock = {
  request: {
    query: GET_OAUTH_CLIENTS,
    variables: { namespace },
  },
  result: {
    data: {
      oAuth2Clients: clients,
    },
  },
};

const subscriptionMock = {
  request: {
    query: OAUTH_CLIENT_EVENT_SUBSCRIPTION,
    variables: { namespace },
  },
  result: { data: null },
};

export const requestMocks = [queryMock, subscriptionMock];
