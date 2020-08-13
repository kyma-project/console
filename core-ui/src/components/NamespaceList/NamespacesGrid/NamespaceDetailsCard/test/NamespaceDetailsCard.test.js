import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';

import NamespaceDetailsCard from './../NamespaceDetailsCard';
import { mockNavigate, deleteNamespaceMock } from './mocks';

jest.mock('@luigi-project/client', () => ({
  linkManager: () => ({
    navigate: mockNavigate,
  }),
  uxManager: () => ({
    addBackdrop: jest.fn(),
    removeBackdrop: jest.fn(),
    showConfirmationModal: () => Promise.resolve(),
  }),
  sendCustomMessage: jest.fn(),
}));

describe('NamespaceDetailsCard', () => {
  it('Displays basic namespace data', () => {
    const applicationsCount = 2;
    const { queryByText } = render(
      <NamespaceDetailsCard
        name="test-namespace-name"
        allPodsCount={10}
        healthyPodsCount={9}
        status="Active"
        isSystemNamespace={false}
        applicationsCount={applicationsCount}
      />,
    );
    expect(queryByText('9/10')).toBeInTheDocument();
    expect(queryByText(applicationsCount.toString())).toBeInTheDocument();
    expect(queryByText('Bound Applications')).toBeInTheDocument();
    expect(queryByText('test-namespace-name')).toBeInTheDocument();
    expect(queryByText('System')).not.toBeInTheDocument();
  });

  it(`Doesn't display applications if null`, () => {
    const { queryByText } = render(
      <NamespaceDetailsCard
        name="test-namespace-name"
        allPodsCount={10}
        healthyPodsCount={9}
        status="Active"
        isSystemNamespace={false}
        applications={null}
      />,
    );
    expect(queryByText('Bound Application')).not.toBeInTheDocument();
  });

  it('Displays "SYSTEM" badge on system namespace', () => {
    const { queryByText } = render(
      <NamespaceDetailsCard
        name="test"
        allPodsCount={10}
        healthyPodsCount={10}
        status="Active"
        isSystemNamespace={true}
        applications={2}
      />,
    );

    expect(queryByText('System')).toBeInTheDocument();
  });

  it('Navigates to details on card click', async () => {
    const { getByRole } = render(
      <NamespaceDetailsCard
        name="test"
        allPodsCount={10}
        healthyPodsCount={10}
        status="Active"
        isSystemNamespace={true}
        applications={3}
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
          name="test"
          allPodsCount={10}
          healthyPodsCount={10}
          status="Active"
          isSystemNamespace={true}
          applications={4}
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
