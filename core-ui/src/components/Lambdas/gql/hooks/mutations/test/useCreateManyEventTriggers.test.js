import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';

import {
  MutationComponent,
  withApolloMockProvider,
  withNotificationProvider,
  TESTING_STATE,
  BUTTON_TEST_ID,
  lambdaMock,
} from 'components/Lambdas/helpers/testing';
import { formatMessage } from 'components/Lambdas/helpers/misc';
import {
  createSubscriberRef,
  createOwnerRef,
} from 'components/Lambdas/helpers/eventTriggers';
import {
  GQL_MUTATIONS,
  TRIGGER_SUBSCRIBER,
} from 'components/Lambdas/constants';

import { useCreateManyEventTriggers } from '../useCreateManyEventTriggers';
import {
  CREATE_MANY_EVENT_TRIGGERS_ERROR_MOCK,
  CREATE_MANY_EVENT_TRIGGERS_DATA_MOCK,
} from '../testMocks';

describe('useCreateManyEventTriggers', () => {
  const hookInput = {
    lambda: lambdaMock,
  };
  const events = [
    {
      eventType: '1',
      version: '1',
      source: '1',
    },
  ];
  const variables = {
    triggers: [
      {
        namespace: lambdaMock.namespace,
        broker: TRIGGER_SUBSCRIBER.BROKER,
        filterAttributes: {
          type: '1',
          eventtypeversion: '1',
          source: '1',
        },
        subscriber: createSubscriberRef(lambdaMock),
      },
    ],
    ownerRef: [createOwnerRef(lambdaMock)],
  };

  it('should see notification with error message if there is an error', async () => {
    const mockProvider = withApolloMockProvider({
      component: (
        <MutationComponent
          hook={useCreateManyEventTriggers}
          hookInput={hookInput}
          mutationInput={events}
        />
      ),
      mocks: [CREATE_MANY_EVENT_TRIGGERS_ERROR_MOCK(variables)],
    });

    const { getByText, getByTestId } = render(
      withNotificationProvider({
        component: mockProvider,
      }),
    );

    const message = formatMessage(
      GQL_MUTATIONS.CREATE_TRIGGERS.ERROR_MESSAGE_SINGLE,
      {
        lambdaName: lambdaMock.name,
        error: `Network error: ${TESTING_STATE.ERROR}`,
      },
    );

    const button = getByTestId(BUTTON_TEST_ID);
    fireEvent.click(button);

    await wait(() => {
      expect(getByText(message)).toBeInTheDocument();
    });
  });

  it('should see notification with error message if there is an error', async () => {
    const mockProvider = withApolloMockProvider({
      component: (
        <MutationComponent
          hook={useCreateManyEventTriggers}
          hookInput={hookInput}
          mutationInput={events}
        />
      ),
      mocks: [CREATE_MANY_EVENT_TRIGGERS_DATA_MOCK(variables)],
    });

    const { getByText, getByTestId } = render(
      withNotificationProvider({
        component: mockProvider,
      }),
    );

    const button = getByTestId(BUTTON_TEST_ID);
    fireEvent.click(button);

    await wait(() => {
      expect(
        getByText(GQL_MUTATIONS.CREATE_TRIGGERS.SUCCESS_MESSAGE_SINGLE),
      ).toBeInTheDocument();
    });
  });
});
