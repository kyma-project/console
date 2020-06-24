import React from 'react';
import NamespaceWorkloads, {
  getDeploymentsRatio,
  getPodsRatio,
} from './../NamespaceWorkloads';
import { render, fireEvent } from '@testing-library/react';

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

const namespace = {
  deployments: [
    { status: { replicas: 1, readyReplicas: 1 } },
    { status: { replicas: 0, readyReplicas: 1 } },
    { status: { replicas: 4, readyReplicas: 4 } },
  ],
  pods: [
    { status: 'SUCCEEDED' },
    { status: 'FAILED' },
    { status: 'NONE' },
    { status: 'SUCCEEDED' },
    { status: 'RUNNING' },
  ],
};

describe('getDeploymentsRatio', () => {
  it('returns valid ratio', () => {
    const ratio = getDeploymentsRatio(namespace);

    expect(ratio).toBe(2 / 3);
  });

  it('returns 0 when there are no deployments', () => {
    const ratio = getDeploymentsRatio({ deployments: [] });

    expect(ratio).toBe(0);
  });
});

describe('getPodsRatio', () => {
  it('returns valid ratio', () => {
    const ratio = getPodsRatio(namespace);

    expect(ratio).toBe(3 / 5);
  });

  it('returns 0 when there are no pods', () => {
    const ratio = getPodsRatio({ pods: [] });

    expect(ratio).toBe(0);
  });
});

describe('NamespaceWorkloads', () => {
  it('displays workload statuses', () => {
    const { queryByText } = render(
      <NamespaceWorkloads namespace={namespace} />,
    );

    expect(queryByText('60%')).toBeInTheDocument();
    expect(queryByText('67%')).toBeInTheDocument();
  });

  const testCases = [
    ['67%', '/deployments'],
    ['60%', '/pods'],
  ];

  for (const [clickTarget, destination] of testCases) {
    it(`navigates to ${destination} on click on chart`, () => {
      const { getByText } = render(
        <NamespaceWorkloads namespace={namespace} />,
      );

      fireEvent.click(getByText(clickTarget));

      expect(mockNavigate).toHaveBeenCalledWith(destination);
    });
  }
});
