import React from 'react';
import {
  render,
  wait,
  queryByText,
  queryAllByRole,
} from '@testing-library/react';
import { MockedProvider, MockSubscriptionLink } from '@apollo/react-testing';
import { GET_COMPASS_APPLICATIONS, GET_KYMA_APPLICATIONS } from 'gql/queries';
import { UNREGISTER_APPLICATION } from 'gql/mutations';
import { APPLICATIONS_EVENT_SUBSCRIPTION } from 'gql/subscriptions';
import ApplicationList from '../ApplicationList';

import { createMockLink } from 'react-shared';
// import * as mockedReactShared from 'react-shared';
// const realReactShared = jest.requireActual('react-shared');

const mockNavigate = jest.fn();
const mockShowConfirmationModal = jest.fn(() => Promise.resolve());

const mockCompassAppsEmpty = {
  request: {
    query: GET_COMPASS_APPLICATIONS,
  },
  result: {
    data: {
      applications: { data: [] },
    },
  },
};
const exampleCompassApps = [
  { id: 1, name: 'tets-app-1', providerName: 'tets-provider-1' },
  { id: 2, name: 'tets-app-2', providerName: 'tets-provider-2' },
];

const exampleKymaApps = [
  {
    name: exampleCompassApps[0].name,
    status: 'status-2',
    enabledInNamespaces: [],
  },
  {
    name: exampleCompassApps[1].name,
    status: 'status-2',
    enabledInNamespaces: [],
  },
];

const mockCompassApps = {
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

const mockKymaApps = {
  request: {
    query: GET_KYMA_APPLICATIONS,
  },
  result: {
    data: {
      applications: exampleKymaApps,
    },
  },
};

const mockCompassAppDelete = id => ({
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

jest.mock('@kyma-project/luigi-client', () => ({
  getContext: () => ({
    namespaceId: mockNamespace,
  }),
  linkManager: () => ({
    fromClosestContext: () => ({
      navigate: mockNavigate,
    }),
  }),
  uxManager: () => ({
    showConfirmationModal: mockShowConfirmationModal,
    showAlert: jest.fn(),
  }),
}));
// jest.mock('react-shared', () => jest.fn());
// mockedReactShared.mockImplementation(() => ({
//   ...realReactShared,
//   handleDelete: () => Promise.resolve(),
// }));

jest.mock('index', () => {
  return {
    CompassGqlContext: {},
  };
});

describe('ApplicationList', () => {
  afterEach(() => {
    mockNavigate.mockReset();
  });

  it('Renders empty list', async () => {
    const { link } = createMockLink([mockCompassAppsEmpty]);
    const { queryByRole } = render(
      <MockedProvider link={link} addTypename={false}>
        <ApplicationList />
      </MockedProvider>,
    );

    await wait(() => {
      const table = queryByRole('table');
      expect(table).toBeInTheDocument();
      expect(queryAllByRole(table, 'row')).toHaveLength(2);
      expect(queryByText(table, 'No entries found')).toBeInTheDocument();
    });
  });

  it('Shows loading status', async () => {
    const { link } = createMockLink([]);
    const { queryByRole, queryByLabelText } = render(
      <MockedProvider link={link} addTypename={false}>
        <ApplicationList />
      </MockedProvider>,
    );

    expect(queryByRole('table')).not.toBeInTheDocument();
    expect(queryByLabelText('Loading')).toBeInTheDocument();

    await wait();
  });

  it('Shows error status', async () => {
    const { link } = createMockLink([]);
    const { queryByRole, queryByLabelText, queryByText } = render(
      <MockedProvider link={link} addTypename={false}>
        <ApplicationList />
      </MockedProvider>,
    );

    await wait(() => {
      expect(queryByRole('table')).not.toBeInTheDocument();
      expect(queryByLabelText('Loading')).not.toBeInTheDocument();
      expect(queryByText(/^Error!/)).toBeInTheDocument();
    });
  });

  it('Renders some elements', async () => {
    const { link } = createMockLink([mockCompassApps]);
    const { queryByRole } = render(
      <MockedProvider link={link} addTypename={false}>
        <ApplicationList />
      </MockedProvider>,
    );

    await wait(() => {
      const table = queryByRole('table');
      expect(table).toBeInTheDocument();
      expect(queryAllByRole(table, 'row')).toHaveLength(
        exampleCompassApps.length + 1,
      ); //apps + header
      exampleCompassApps.forEach(app => {
        expect(queryByText(table, app.name)).toBeInTheDocument();
      });
    });
  });

  //TODO: uncomment after redirection to details is done

  //   it('Clicking on element navigates to its details', async () => {
  //     const { getByText } = render(
  //       <MockedProvider link={link} addTypename={false} mocks={[mockCompassApps]}>
  //         <ApplicationList />
  //       </MockedProvider>,
  //     );

  //     await wait(() => {
  //       getByText(appList[1].name).click();
  //       expect(mockNavigate).toHaveBeenCalledWith(`/details/${appList[1].name}`);
  //     });
  //   });

  it('Clicking on "Delete" deletes element', async () => {
    const deleteAppMutation = mockCompassAppDelete(2);
    const { link } = createMockLink([mockCompassApps, deleteAppMutation]);

    const { getAllByLabelText } = render(
      <MockedProvider link={link} addTypename={false}>
        <ApplicationList />
      </MockedProvider>,
    );

    await wait(() => {
      getAllByLabelText('Delete')[1].click();
      expect(mockShowConfirmationModal).toHaveBeenCalled();
      expect(deleteAppMutation.result).toHaveBeenCalled();
    });
  });
});
