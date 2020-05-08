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
import { CONFIG } from 'components/Lambdas/config';

import { useServiceBindingUsagesQuery } from '../useServiceBindingUsagesQuery';
import {
  GET_SERVICE_BINDING_USAGES_DATA_MOCK,
  GET_SERVICE_BINDING_USAGES_ERROR_MOCK,
  SERVICE_BINDING_USAGE_EVENT_SUBSCRIPTION_MOCK,
} from '../testMocks';

describe('useServiceBindingUsagesQuery', () => {
  const hookInput = {
    lambda: lambdaMock,
  };
  const variables = {
    namespace: lambdaMock.namespace,
    resourceKind: CONFIG.functionUsageKind,
    resourceName: lambdaMock.name,
  };
  const subscriptionMock = SERVICE_BINDING_USAGE_EVENT_SUBSCRIPTION_MOCK(
    variables,
  );

  it('should see loading state', async () => {
    const { getByText } = render(
      withApolloMockProvider({
        component: (
          <QueryComponent
            hook={useServiceBindingUsagesQuery}
            hookInput={hookInput}
          />
        ),
        mocks: [subscriptionMock],
      }),
    );

    expect(getByText(TESTING_STATE.LOADING)).toBeInTheDocument();
    await wait();
  });

  it('should see data state', async () => {
    const { getByText } = render(
      withApolloMockProvider({
        component: (
          <QueryComponent
            hook={useServiceBindingUsagesQuery}
            hookInput={hookInput}
            dataProp="bindingUsages"
          />
        ),
        mocks: [
          GET_SERVICE_BINDING_USAGES_DATA_MOCK(variables),
          subscriptionMock,
        ],
      }),
    );

    await wait(() => {
      expect(getByText(TESTING_STATE.DATA)).toBeInTheDocument();
    });
  });

  it('should see notification if there is an error', async () => {
    const mockProvider = withApolloMockProvider({
      component: (
        <QueryComponent
          hook={useServiceBindingUsagesQuery}
          hookInput={hookInput}
        />
      ),
      mocks: [
        GET_SERVICE_BINDING_USAGES_ERROR_MOCK(variables),
        subscriptionMock,
      ],
    });

    const { getByText } = render(
      withNotificationProvider({
        component: mockProvider,
      }),
    );

    const message = formatMessage(
      GQL_QUERIES.SERVICE_BINDING_USAGES.ERROR_MESSAGE,
      {
        lambdaName: lambdaMock.name,
        error: `Network error: ${TESTING_STATE.ERROR}`,
      },
    );

    await wait(() => {
      expect(getByText(message)).toBeInTheDocument();
    });
  });
});
