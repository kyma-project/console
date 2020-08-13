import React from 'react';
import NamespaceWorkloads from './../NamespaceWorkloads';
import {
  getHealthyDeploymentsCount,
  getHealthyPodsCount,
} from './../namespaceWorkloadsHelpers';
import { render, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { namespace, subscriptionMocks } from './mocks';

const mockNavigate = jest.fn();

jest.mock('@luigi-project/client', () => {
  return {
    linkManager: () => ({
      fromContext: () => ({
        navigate: mockNavigate,
      }),
    }),
  };
});

describe('getHealthyDeploymentsCount', () => {
  it('counts healthy deployments', () => {
    const count = getHealthyDeploymentsCount(namespace.deployments);

    expect(count).toBe(2);
  });
});

describe('getHealthyPodsCount', () => {
  it('counts healthy pods', () => {
    const count = getHealthyPodsCount(namespace.pods);

    expect(count).toBe(3);
  });
});

describe('NamespaceWorkloads', () => {
  it('displays workload statuses', async () => {
    const { queryByText } = render(
      <MockedProvider addTypename={false} mocks={subscriptionMocks}>
        <NamespaceWorkloads namespace={namespace} />
      </MockedProvider>,
    );
    await wait(() => {
      expect(queryByText('3/5')).toBeInTheDocument();
      expect(queryByText('2/3')).toBeInTheDocument();
    });
  });

  const testCases = [
    ['2/3', '/deployments'],
    ['3/5', '/pods'],
  ];

  for (const [clickTarget, destination] of testCases) {
    it(`navigates to ${destination} on click on chart`, async () => {
      const { getByText } = render(
        <MockedProvider addTypename={false} mocks={subscriptionMocks}>
          <NamespaceWorkloads namespace={namespace} />
        </MockedProvider>,
      );

      fireEvent.click(getByText(clickTarget));

      await wait(() => expect(mockNavigate).toHaveBeenCalledWith(destination));
    });
  }
});
