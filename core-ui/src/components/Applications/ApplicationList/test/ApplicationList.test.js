import React from 'react';
import {
  render,
  wait,
  queryByText,
  queryAllByRole,
} from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';

import ApplicationList from '../ApplicationList';
import { createMockLink } from 'react-shared';
import {
  mockNavigate,
  mockShowConfirmationModal,
  mockCompassAppsEmpty,
  exampleCompassApps,
  exampleKymaApps,
  mockCompassApps,
  mockKymaApps,
  mockCompassAppDelete,
} from './mocks';

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
    addBackdrop: () => {},
    removeBackdrop: () => {},
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

  xit('Clicking on "Delete" deletes element', async () => {
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

  it('Renders information from Compass and Kyma', async () => {
    const { link } = createMockLink([mockCompassApps, mockKymaApps]);
    const { queryByText } = render(
      <MockedProvider link={link} addTypename={false}>
        <ApplicationList />
      </MockedProvider>,
    );

    await wait(() => {
      [0, 1].forEach(i => {
        expect(queryByText(exampleCompassApps[i].name)).toBeInTheDocument();
        expect(
          queryByText(exampleCompassApps[i].providerName),
        ).toBeInTheDocument();
        expect(
          queryByText(exampleCompassApps[i].packages.totalCount.toString()),
        ).toBeInTheDocument();
      });
    });
  });
});
