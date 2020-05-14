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

import { useEventActivationsQuery } from '../useEventActivationsQuery';
import {
  GET_EVENT_ACTIVATIONS_ERROR_MOCK,
  GET_EVENT_ACTIVATIONS_DATA_MOCK,
} from '../testMocks';

describe('useEventTriggersQuery', () => {
  const hookInput = {
    namespace: lambdaMock.namespace,
  };
  const variables = {
    namespace: lambdaMock.namespace,
  };

  it('should see loading state', async () => {
    const { getByText } = render(
      withApolloMockProvider({
        component: (
          <QueryComponent
            hook={useEventActivationsQuery}
            hookInput={hookInput}
          />
        ),
        mocks: [],
      }),
    );

    expect(getByText(TESTING_STATE.LOADING)).toBeInTheDocument();
    await wait();
  });

  it('should see error state', async () => {
    const { getByText } = render(
      withApolloMockProvider({
        component: (
          <QueryComponent
            hook={useEventActivationsQuery}
            hookInput={hookInput}
          />
        ),
        mocks: [GET_EVENT_ACTIVATIONS_ERROR_MOCK(variables)],
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
            hook={useEventActivationsQuery}
            hookInput={hookInput}
          />
        ),
        mocks: [GET_EVENT_ACTIVATIONS_DATA_MOCK(variables)],
      }),
    );

    await wait(() => {
      expect(getByText(TESTING_STATE.DATA)).toBeInTheDocument();
    });
  });

  it('should see notification if there is an error', async () => {
    const mockProvider = withApolloMockProvider({
      component: (
        <QueryComponent hook={useEventActivationsQuery} hookInput={hookInput} />
      ),
      mocks: [GET_EVENT_ACTIVATIONS_ERROR_MOCK(variables)],
    });

    const { getByText } = render(
      withNotificationProvider({
        component: mockProvider,
      }),
    );
    const message = formatMessage(GQL_QUERIES.EVENT_ACTIVATIONS.ERROR_MESSAGE, {
      namespace: lambdaMock.namespace,
      error: `Network error: ${TESTING_STATE.ERROR}`,
    });

    await wait(() => {
      expect(getByText(message)).toBeInTheDocument();
    });
  });
});
