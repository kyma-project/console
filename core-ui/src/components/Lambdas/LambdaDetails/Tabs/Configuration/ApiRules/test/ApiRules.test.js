import React from 'react';
import { render, wait } from '@testing-library/react';

import {
  withApolloMockProvider,
  lambdaMock,
  serviceMock,
} from 'components/Lambdas/helpers/testing';

import { API_RULE_EVENT_SUBSCRIPTION_MOCK } from 'components/ApiRules/gql/mocks/useApiRulesQuery';
import { GET_SERVICE_DATA_MOCK } from 'components/Lambdas/gql/hooks/queries/testMocks';

import ApiRules from '../ApiRules';

jest.mock('@luigi-project/client', () => {
  return {
    getContext: () => ({
      namespaceId: 'namespace',
    }),
    uxManager: () => ({
      addBackdrop: () => {},
      removeBackdrop: () => {},
    }),
  };
});

jest.mock('@kyma-project/common', () => ({
  getApiUrl: () => 'kyma.cluster.com',
}));

describe('ApiRules', () => {
  const subscriptionMock = API_RULE_EVENT_SUBSCRIPTION_MOCK({
    serviceName: lambdaMock.name,
    namespace: lambdaMock.namespace,
  });
  const variables = {
    name: lambdaMock.name,
    namespace: lambdaMock.namespace,
  };
  const exposeButtonText = 'Expose Function';

  it('should disabled expose button when service is null and status of function is not RUNNING', async () => {
    const queryMock = GET_SERVICE_DATA_MOCK(variables, null);

    const { getByText } = render(
      withApolloMockProvider({
        component: (
          <ApiRules
            lambda={{
              ...lambdaMock,
              status: { ...lambdaMock.status, phase: 'NOT_RUNNING' },
            }}
          />
        ),
        mocks: [subscriptionMock, queryMock],
      }),
    );

    const exposeButton = getByText(exposeButtonText);
    expect(exposeButton).toBeInTheDocument();

    await wait(() => {
      expect(exposeButton).toBeDisabled();
    });
  }, 10000);

  it('should enable expose button when service exists and status of function is not RUNNING', async () => {
    const queryMock = GET_SERVICE_DATA_MOCK(variables, serviceMock);

    const { getByText } = render(
      withApolloMockProvider({
        component: (
          <ApiRules
            lambda={{
              ...lambdaMock,
              status: { ...lambdaMock.status, phase: 'NOT_RUNNING' },
            }}
          />
        ),
        mocks: [subscriptionMock, queryMock],
      }),
    );

    const exposeButton = getByText(exposeButtonText);
    expect(exposeButton).toBeInTheDocument();

    await wait(() => {
      expect(exposeButton).not.toBeDisabled();
    });
  }, 10000);

  it('should enable expose button when function status is RUNNING and service is null', async () => {
    const queryMock = GET_SERVICE_DATA_MOCK(variables, null);

    const { getByText } = render(
      withApolloMockProvider({
        component: (
          <ApiRules
            lambda={{
              ...lambdaMock,
              status: { ...lambdaMock.status, phase: 'RUNNING' },
            }}
          />
        ),
        mocks: [subscriptionMock, queryMock],
      }),
    );

    const exposeButton = getByText(exposeButtonText);
    expect(exposeButton).toBeInTheDocument();

    await wait(() => {
      expect(exposeButton).not.toBeDisabled();
    });
  }, 10000);
});
