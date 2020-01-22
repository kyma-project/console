import { GET_COMPASS_APPLICATIONS, GET_KYMA_APPLICATIONS } from 'gql/queries';
import { UNREGISTER_APPLICATION } from 'gql/mutations';

export const mockNavigate = jest.fn();
export const mockShowConfirmationModal = jest.fn(() => Promise.resolve());

export const mockCompassAppsEmpty = {
  request: {
    query: GET_COMPASS_APPLICATIONS,
  },
  result: {
    data: {
      applications: { data: [] },
    },
  },
};
export const exampleCompassApps = [
  { id: 1, name: 'tets-app-1', providerName: 'tets-provider-1' },
  { id: 2, name: 'tets-app-2', providerName: 'tets-provider-2' },
];

export const exampleKymaApps = [
  {
    name: exampleCompassApps[0].name,
    status: 'status-1',
    enabledInNamespaces: [],
  },
  {
    name: exampleCompassApps[1].name,
    status: 'status-2',
    enabledInNamespaces: [],
  },
];

export const mockCompassApps = {
  request: {
    query: GET_COMPASS_APPLICATIONS,
  },
  result: {
    data: {
      applications: {
        data: exampleCompassApps,
      },
    },
  },
};

export const mockKymaApps = {
  request: {
    query: GET_KYMA_APPLICATIONS,
  },
  result: {
    data: {
      applications: exampleKymaApps,
    },
  },
};
export const mockCompassAppDelete = id => ({
  request: {
    query: UNREGISTER_APPLICATION,
    variables: { id },
  },
  result: jest.fn(() => ({
    data: {
      unregisterApplication: {
        name: exampleCompassApps[id - 1].name,
        id,
      },
    },
  })),
});
