import React from 'react';
import { render, wait } from '@testing-library/react';

import {
  QueryComponent,
  withApolloMockProvider,
  withNotificationProvider,
  TESTING_STATE,
  lambdaMock,
} from 'components/Lambdas/helpers/testing';
import { formatMessage } from 'components/Lambdas/helpers/misc';
import { GQL_QUERIES } from 'components/Lambdas/constants';

import { useLambdasQuery } from '../useLambdasQuery';
import {
  GET_LAMBDAS_ERROR_MOCK,
  GET_LAMBDAS_DATA_MOCK,
  LAMBDA_EVENT_SUBSCRIPTION_MOCK,
} from '../testMocks';

describe('useLambdasQuery', () => {
  const hookInput = {
    namespace: lambdaMock.namespace,
  };
  const variables = {
    namespace: lambdaMock.namespace,
  };
  const subscriptionMock = LAMBDA_EVENT_SUBSCRIPTION_MOCK(variables);

  it('should see loading state', async () => {
    const { getByText } = render(
      withApolloMockProvider({
        component: (
          <QueryComponent hook={useLambdasQuery} hookInput={hookInput} />
        ),
        mocks: [subscriptionMock],
      }),
    );

    expect(getByText(TESTING_STATE.LOADING)).toBeInTheDocument();
    await wait();
  });

  it('should see error state', async () => {
    const { getByText } = render(
      withApolloMockProvider({
        component: (
          <QueryComponent hook={useLambdasQuery} hookInput={hookInput} />
        ),
        mocks: [GET_LAMBDAS_ERROR_MOCK(variables), subscriptionMock],
      }),
    );

    await wait(() => {
      expect(getByText(TESTING_STATE.ERROR)).toBeInTheDocument();
    });
  }, 15000);

  it('should see data state', async () => {
    const { getByText } = render(
      withApolloMockProvider({
        component: (
          <QueryComponent
            hook={useLambdasQuery}
            hookInput={hookInput}
            dataProp="lambdas"
          />
        ),
        mocks: [GET_LAMBDAS_DATA_MOCK(variables), subscriptionMock],
      }),
    );

    await wait(() => {
      expect(getByText(TESTING_STATE.DATA)).toBeInTheDocument();
    });
  });

  it('should see notification if there is an error', async () => {
    const mockProvider = withApolloMockProvider({
      component: (
        <QueryComponent hook={useLambdasQuery} hookInput={hookInput} />
      ),
      mocks: [GET_LAMBDAS_ERROR_MOCK(variables), subscriptionMock],
    });

    const { getByText } = render(
      withNotificationProvider({
        component: mockProvider,
      }),
    );

    const message = formatMessage(GQL_QUERIES.LAMBDAS.ERROR_MESSAGE, {
      namespace: lambdaMock.namespace,
      error: `Network error: ${TESTING_STATE.ERROR}`,
    });

    await wait(() => {
      expect(getByText(message)).toBeInTheDocument();
    });
  });
});
