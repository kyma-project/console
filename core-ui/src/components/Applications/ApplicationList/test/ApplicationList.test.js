import React from 'react';
import {
  render,
  wait,
  queryByText,
  queryAllByRole,
} from '@testing-library/react';

import { MockedProvider } from '@apollo/react-testing';
import { GET_APPLICATIONS } from 'gql/queries';
import { UNREGISTER_APPLICATION } from 'gql/mutations';
import ApplicationList from '../ApplicationList';

const mockNamespace = 'nsp';
const mockNavigate = jest.fn();
const mockShowConfirmationModal = jest.fn(() => Promise.resolve());

const mockCompassAppsEmpty = {
  request: {
    query: GET_APPLICATIONS,
  },
  result: {
    data: {
      applications: { data: [] },
    },
  },
};
const appList = [
  { id: 1, name: 'tets-app-1', providerName: 'tets-provider-1' },
  { id: 2, name: 'tets-app-2', providerName: 'tets-provider-2' },
];

const mockCompassApps = {
  request: {
    query: GET_APPLICATIONS,
  },
  result: {
    data: {
      applications: {
        data: appList,
      },
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
        name: appList[id - 1].name,
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
    const { queryByRole } = render(
      <MockedProvider addTypename={false} mocks={[mockCompassAppsEmpty]}>
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
    const { queryByRole, queryByLabelText } = render(
      <MockedProvider addTypename={false} mocks={[mockCompassAppsEmpty]}>
        <ApplicationList />
      </MockedProvider>,
    );

    expect(queryByRole('table')).not.toBeInTheDocument();
    expect(queryByLabelText('Loading')).toBeInTheDocument();

    await wait();
  });

  it('Shows error status', async () => {
    const { queryByRole, queryByLabelText, queryByText } = render(
      <MockedProvider addTypename={false} mocks={[]}>
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
    const { queryByRole } = render(
      <MockedProvider addTypename={false} mocks={[mockCompassApps]}>
        <ApplicationList />
      </MockedProvider>,
    );

    await wait(() => {
      const table = queryByRole('table');
      expect(table).toBeInTheDocument();
      expect(queryAllByRole(table, 'row')).toHaveLength(appList.length + 1); //apps + header
      appList.forEach(app => {
        expect(queryByText(table, app.name)).toBeInTheDocument();
      });
    });
  });

  //TODO: uncomment after redirection to details is done

  //   it('Clicking on element navigates to its details', async () => {
  //     const { getByText } = render(
  //       <MockedProvider addTypename={false} mocks={[mockCompassApps]}>
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

    const { getAllByLabelText } = render(
      <MockedProvider
        addTypename={false}
        mocks={[mockCompassApps, deleteAppMutation]}
      >
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
