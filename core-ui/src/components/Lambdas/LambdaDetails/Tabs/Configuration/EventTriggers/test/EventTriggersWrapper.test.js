import React from 'react';
import { render, wait } from '@testing-library/react';

import {
  withApolloMockProvider,
  lambdaMock,
  eventTriggerMock,
} from 'components/Lambdas/helpers/testing';
import { createSubscriberRef } from 'components/Lambdas/helpers/eventTriggers';
import {
  GET_EVENT_ACTIVATIONS_ERROR_MOCK,
  GET_EVENT_ACTIVATIONS_DATA_MOCK,
  GET_EVENT_TRIGGERS_ERROR_MOCK,
  GET_EVENT_TRIGGERS_DATA_MOCK,
  EVENT_TRIGGER_EVENT_SUBSCRIPTION_MOCK,
} from 'components/Lambdas/gql/hooks/queries/testMocks';
import { ERRORS, EVENT_TRIGGERS_PANEL } from 'components/Lambdas/constants';

import EventTriggersWrapper from '../EventTriggersWrapper';

jest.mock('@luigi-project/client', () => {
  return {
    linkManager: () => ({
      navigate: () => {},
    }),
    uxManager: () => ({
      addBackdrop: () => {},
      removeBackdrop: () => {},
    }),
  };
});

describe('EventTriggersWrapper + EventTriggers', () => {
  const eventTriggersVariables = {
    subscriber: createSubscriberRef(lambdaMock),
    namespace: lambdaMock.namespace,
  };
  const eventActivationsVariables = {
    namespace: lambdaMock.namespace,
  };
  const subscriptionMock = EVENT_TRIGGER_EVENT_SUBSCRIPTION_MOCK(
    eventTriggersVariables,
  );

  it('should render Spinner', async () => {
    const { getByLabelText } = render(
      withApolloMockProvider({
        component: <EventTriggersWrapper lambda={lambdaMock} />,
        mocks: [subscriptionMock],
      }),
    );

    expect(getByLabelText('Loading')).toBeInTheDocument();
    await wait();
  });

  it('should render table', async () => {
    const { getByText, queryByRole, queryAllByRole } = render(
      withApolloMockProvider({
        component: <EventTriggersWrapper lambda={lambdaMock} />,
        mocks: [
          subscriptionMock,
          GET_EVENT_ACTIVATIONS_DATA_MOCK(eventActivationsVariables),
          GET_EVENT_TRIGGERS_DATA_MOCK(eventTriggersVariables, [
            {
              ...eventTriggerMock,
              name: 'name1',
            },
            {
              ...eventTriggerMock,
              name: 'name2',
            },
          ]),
        ],
      }),
    );

    await wait(() => {
      expect(getByText(EVENT_TRIGGERS_PANEL.LIST.TITLE)).toBeInTheDocument();
      const table = queryByRole('table');
      expect(table).toBeInTheDocument();
      expect(queryAllByRole('row')).toHaveLength(3); // header + 2 element;
    });
  });
});
