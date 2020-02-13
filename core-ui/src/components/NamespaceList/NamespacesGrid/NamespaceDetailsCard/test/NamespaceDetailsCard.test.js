import React from 'react';
import {
  render,
  fireEvent,
  waitForDomChange,
  wait,
} from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';

import NamespaceDetailsCard from './../NamespaceDetailsCard';
import { mockNavigate, deleteNamespaceMock } from './mocks';

jest.mock('@kyma-project/luigi-client', () => ({
  linkManager: () => ({
    navigate: mockNavigate,
  }),
  uxManager: () => ({
    addBackdrop: jest.fn(),
    removeBackdrop: jest.fn(),
    showConfirmationModal: () => Promise.resolve(),
  }),
}));

describe('NamespaceDetailsCard', () => {
  it('Displays basic namespace data', () => {
    const { queryByText } = render(
      <NamespaceDetailsCard
        namespaceName={'test-namespace-name'}
        allPodsCount={10}
        healthyPodsCount={9}
        status={'Active'}
        isSystemNamespace={false}
        applicationsCount={0}
      />,
    );
    expect(queryByText('9/10')).toBeInTheDocument();
    expect(queryByText('test-namespace-name')).toBeInTheDocument();
    expect(queryByText('System')).not.toBeInTheDocument();
  });

  it('Displays "SYSTEM" badge on system namespace', () => {
    const { queryByText } = render(
      <NamespaceDetailsCard
        namespaceName={'test'}
        allPodsCount={10}
        healthyPodsCount={10}
        status={'Active'}
        isSystemNamespace={true}
        applicationsCount={0}
      />,
    );

    expect(queryByText('System')).toBeInTheDocument();
  });

  it('Navigates to details on card click', async () => {
    const { getByRole } = render(
      <NamespaceDetailsCard
        namespaceName={'test'}
        allPodsCount={10}
        healthyPodsCount={10}
        status={'Active'}
        isSystemNamespace={true}
        applicationsCount={0}
      />,
    );

    fireEvent.click(getByRole('gridcell'));

    await wait(() =>
      expect(mockNavigate).toHaveBeenCalledWith(
        '/home/namespaces/test/details',
      ),
    );
  });

  it('Triggers mutation on "Delete" click', async () => {
    //for Popovers's Warning: `NaN` is an invalid value for the `left` css style property.
    console.error = jest.fn();

    const { getByLabelText, getByText } = render(
      <MockedProvider mocks={[deleteNamespaceMock]} addTypename={false}>
        <NamespaceDetailsCard
          namespaceName={'test'}
          allPodsCount={10}
          healthyPodsCount={10}
          status={'Active'}
          isSystemNamespace={true}
          applicationsCount={0}
        />
      </MockedProvider>,
    );

    // open popover
    fireEvent.click(getByLabelText('namespace-actions'));

    // delete namespace
    fireEvent.click(getByText('Delete'));

    await wait(() => expect(deleteNamespaceMock.result).toHaveBeenCalled());
  });
});
