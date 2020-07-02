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
import { GQL_QUERIES } from '../../constants';

import { useApiRulesQuery } from '../useApiRulesQuery';
import {
  GET_API_RULES_ERROR_MOCK,
  API_RULE_EVENT_SUBSCRIPTION_MOCK,
} from '../mocks/useApiRulesQuery';

describe('useApiRulesQuery', () => {
  const hookInput = {
    namespace: 'namespace',
    serviceName: 'serviceName',
  };
  const variables = hookInput;
  const subscriptionMock = API_RULE_EVENT_SUBSCRIPTION_MOCK(variables);

  it('should see loading state', async () => {
    const { getByText } = render(
      withApolloMockProvider({
        component: (
          <QueryComponent hook={useApiRulesQuery} hookInput={hookInput} />
        ),
        mocks: [subscriptionMock],
      }),
    );

    expect(getByText(TESTING_STATE.LOADING)).toBeInTheDocument();
    await wait();
  });

  it('should see notification if there is an error', async () => {
    const mockProvider = withApolloMockProvider({
      component: (
        <QueryComponent hook={useApiRulesQuery} hookInput={hookInput} />
      ),
      mocks: [GET_API_RULES_ERROR_MOCK(variables), subscriptionMock],
    });

    const { getByText } = render(
      withNotificationProvider({
        component: mockProvider,
      }),
    );

    const message = formatMessage(GQL_QUERIES.API_RULES.ERROR_MESSAGE, {
      lambdaName: lambdaMock.name,
      error: `Network error: ${TESTING_STATE.ERROR}`,
    });

    await wait(() => {
      expect(getByText(message)).toBeInTheDocument();
    });
  });
});
