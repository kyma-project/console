import React from 'react';
import { render, wait } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';

import BoundNamespacesList from '../BoundNamespacesList';
import {
  exampleBoundNamespaces,
  exampleAppName,
  mockShowConfirmationModal,
} from './mocks';

jest.mock('@kyma-project/luigi-client', () => ({
  getContext: () => ({
    namespaceId: 'test-namespace',
  }),
  uxManager: () => ({
    showConfirmationModal: mockShowConfirmationModal,
    addBackdrop: () => {},
    removeBackdrop: () => {},
  }),
}));

describe('ApplicationList', () => {
  it('renders empty list', async () => {
    const { queryByRole, queryByText } = render(
      <MockedProvider>
        <BoundNamespacesList data={[]} appName={exampleAppName} />
      </MockedProvider>,
    );
    await wait(() => {
      const table = queryByRole('table');
      expect(table).toBeInTheDocument();
      expect(queryByText('No entries found')).toBeInTheDocument();
    });
  });

  it('renders namespaces list', async () => {
    const { queryByRole, queryByText } = render(
      <MockedProvider>
        <BoundNamespacesList
          data={exampleBoundNamespaces}
          appName={exampleAppName}
        />
      </MockedProvider>,
    );

    await wait(() => {
      const table = queryByRole('table');
      expect(table).toBeInTheDocument();
      expect(queryByText(exampleBoundNamespaces[0])).toBeInTheDocument();
      expect(queryByText(exampleBoundNamespaces[1])).toBeInTheDocument();
    });
  });

  it('`unbind` shows confirmation modal', async () => {
    const { getAllByText } = render(
      <MockedProvider addTypename={false}>
        <BoundNamespacesList
          data={exampleBoundNamespaces}
          appName={exampleAppName}
        />
      </MockedProvider>,
    );

    await wait(async () => {
      getAllByText('Unbind')[0].click();
      expect(mockShowConfirmationModal).toHaveBeenCalled();
    });
  });
});
