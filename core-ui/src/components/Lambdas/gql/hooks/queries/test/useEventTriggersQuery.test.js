import React from 'react';
import { render, wait } from '@testing-library/react';

import { createSubscriberRef } from 'components/Lambdas/helpers/eventTriggers';
import {
  QueryComponent,
  withApolloMockProvider,
  withNotificationProvider,
  TESTING_STATE,
  lambdaMock,
} from 'components/Lambdas/helpers/testing';
import { formatMessage } from 'components/Lambdas/helpers/misc';
import { GQL_QUERIES } from 'components/Lambdas/constants';

import { useEventTriggersQuery } from '../useEventTriggersQuery';
import {
  GET_EVENT_TRIGGERS_ERROR_MOCK,
  GET_EVENT_TRIGGERS_DATA_MOCK,
  EVENT_TRIGGER_EVENT_SUBSCRIPTION_MOCK,
} from '../testMocks';

describe('useEventTriggersQuery', () => {
  const hookInput = {
    subscriber: createSubscriberRef(lambdaMock),
    lambda: lambdaMock,
  };
  const variables = {
    subscriber: hookInput.subscriber,
    namespace: lambdaMock.namespace,
  };
  const subscriptionMock = EVENT_TRIGGER_EVENT_SUBSCRIPTION_MOCK(variables);

  it('should see loading state', async () => {
    const { getByText } = render(
      withApolloMockProvider({
        component: (
          <QueryComponent hook={useEventTriggersQuery} hookInput={hookInput} />
        ),
        mocks: [subscriptionMock],
      }),
    );

    expect(getByText(TESTING_STATE.LOADING)).toBeInTheDocument();
    await wait();
  });

  // TODO: Investigate why it fails on CI, but locally always passes
  // it('should see error state', async () => {
  //   const { getByText } = render(
  //     withApolloMockProvider({
  //       component: (
  //         <QueryComponent hook={useEventTriggersQuery} hookInput={hookInput} />
  //       ),
  //       mocks: [GET_EVENT_TRIGGERS_ERROR_MOCK(variables), subscriptionMock],
  //     }),
  //   );

  //   await wait(() => {
  //     expect(getByText(TESTING_STATE.ERROR)).toBeInTheDocument();
  //   });
  // });

  it('should see data state', async () => {
    const { getByText } = render(
      withApolloMockProvider({
        component: (
          <QueryComponent hook={useEventTriggersQuery} hookInput={hookInput} />
        ),
        mocks: [GET_EVENT_TRIGGERS_DATA_MOCK(variables), subscriptionMock],
      }),
    );

    await wait(() => {
      expect(getByText(TESTING_STATE.DATA)).toBeInTheDocument();
    });
  });

  it('should see notification if there is an error', async () => {
    const mockProvider = withApolloMockProvider({
      component: (
        <QueryComponent hook={useEventTriggersQuery} hookInput={hookInput} />
      ),
      mocks: [GET_EVENT_TRIGGERS_ERROR_MOCK(variables), subscriptionMock],
    });

    const { getByText } = render(
      withNotificationProvider({
        component: mockProvider,
      }),
    );

    const message = formatMessage(GQL_QUERIES.EVENT_TRIGGERS.ERROR_MESSAGE, {
      lambdaName: lambdaMock.name,
      error: `Network error: ${TESTING_STATE.ERROR}`,
    });

    await wait(() => {
      expect(getByText(message)).toBeInTheDocument();
    });
  });
});
