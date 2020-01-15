import React from 'react';
import {
  render,
  waitForDomChange,
  wait,
  queryByText,
  queryAllByRole,
} from '@testing-library/react';

import { MockedProvider } from '@apollo/react-testing';
import { GET_APPLICATIONS } from 'gql/queries';
import { DELETE_API_RULE } from 'gql/mutations';
import ApplicationList from '../ApplicationList';

const mockNamespace = 'nsp';
const mockNavigate = jest.fn();
const mockShowConfirmationModal = jest.fn(() => Promise.resolve());

const gqlCompassApplicationsRequest = applications => ({
  request: {
    query: GET_APPLICATIONS,
  },
  result: {
    data: {
      applications: { data: applications },
    },
  },
});

const gqlDeleteRequest = name => ({
  request: {
    query: DELETE_API_RULE,
    variables: { namespace: mockNamespace, name },
  },
  result: jest.fn(() => ({
    data: {
      deleteAPIRule: {
        name,
      },
    },
  })),
});

const generateApp = id => ({
  id,
  name: 'tets-app-' + id,
  providerName: 'tets-provider-' + id,
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
      <MockedProvider
        addTypename={false}
        mocks={[gqlCompassApplicationsRequest([])]}
      >
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
      <MockedProvider
        addTypename={false}
        mocks={[gqlCompassApplicationsRequest([])]}
      >
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
    const apps = [generateApp(1), generateApp(2)];
    const { container, queryByRole } = render(
      <MockedProvider
        addTypename={false}
        mocks={[gqlCompassApplicationsRequest(apps)]}
      >
        <ApplicationList />
      </MockedProvider>,
    );

    await wait(() => {
      const table = queryByRole('table');
      expect(table).toBeInTheDocument();
      expect(queryAllByRole(table, 'row')).toHaveLength(3);
      apps.forEach(app => {
        expect(queryByText(table, app.name)).toBeInTheDocument();
      });
    });
  });

  //   it('Clicking on element navigates to its details', async () => {
  //     const apis = [apiRule(1), apiRule(2)];
  //     const { container, getByText } = render(
  //       <MockedProvider addTypename={false} mocks={[gqlApiRulesRequest(apis)]}>
  //         <ApiRules />
  //       </MockedProvider>,
  //     );

  //     await waitForDomChange(container);

  //     getByText(apis[1].name).click();
  //     expect(mockNavigate).toHaveBeenCalledWith(`/details/${apis[1].name}`);
  //   });

  //   it('Clicking on "Create" navigate to creation page', async () => {
  //     const apis = [apiRule(1), apiRule(2)];
  //     const { container, getByText } = render(
  //       <MockedProvider addTypename={false} mocks={[gqlApiRulesRequest(apis)]}>
  //         <ApiRules />
  //       </MockedProvider>,
  //     );

  //     await waitForDomChange(container);

  //     getByText('Add API rule').click();

  //     expect(mockNavigate).toHaveBeenCalledWith('/create');
  //   });

  //   it('Clicking on "Edit" navigate to edit page', async () => {
  //     const apis = [apiRule(1), apiRule(2)];
  //     const { container, queryAllByLabelText } = render(
  //       <MockedProvider addTypename={false} mocks={[gqlApiRulesRequest(apis)]}>
  //         <ApiRules />
  //       </MockedProvider>,
  //     );

  //     await waitForDomChange(container);

  //     const editButtons = queryAllByLabelText('Edit');
  //     expect(editButtons).toHaveLength(2);

  //     editButtons[0].click();

  //     expect(mockNavigate).toHaveBeenCalledWith(`/edit/${apis[0].name}`);
  //   });

  //   it('Clicking on "Delete" deletes element', async () => {
  //     const apis = [apiRule(1), apiRule(2)];
  //     const deleteApi1 = gqlDeleteRequest(apis[1].name);
  //     const { container, getAllByLabelText, queryByText } = render(
  //       <MockedProvider
  //         addTypename={false}
  //         mocks={[
  //           gqlApiRulesRequest(apis),
  //           deleteApi1,
  //           gqlApiRulesRequest([apis[0]]),
  //         ]}
  //       >
  //         <ApiRules />
  //       </MockedProvider>,
  //     );

  //     await waitForDomChange(container);

  //     getAllByLabelText('Delete')[1].click();

  //     await waitForDomChange(container);

  //     expect(mockShowConfirmationModal).toHaveBeenCalled();
  //     expect(deleteApi1.result).toHaveBeenCalled();
  //     expect(queryByText(apis[1].name)).not.toBeInTheDocument();
  //   });
});
