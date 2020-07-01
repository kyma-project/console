import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';

import {
  MutationComponent,
  withApolloMockProvider,
  withNotificationProvider,
  TESTING_STATE,
  BUTTON_TEST_ID,
  lambdaMock,
  eventTriggerMock,
} from 'components/Lambdas/helpers/testing';
import { formatMessage } from 'components/Lambdas/helpers/misc';
import { GQL_MUTATIONS } from 'components/Lambdas/constants';

import {
  useDeleteEventTrigger,
  processTriggerName,
} from '../useDeleteEventTrigger';
import {
  DELETE_ONE_EVENT_TRIGGER_ERROR_MOCK,
  DELETE_ONE_EVENT_TRIGGER_DATA_MOCK,
} from '../testMocks';

jest.mock('@luigi-project/client', () => {
  return {
    uxManager: () => ({
      showConfirmationModal: () => {
        return new Promise(resolve => resolve());
      },
      addBackdrop: () => {},
      removeBackdrop: () => {},
    }),
  };
});

describe('useDeleteEventTrigger', () => {
  const hookInput = {
    name: lambdaMock.name,
  };
  const variables = {
    namespace: eventTriggerMock.namespace,
    trigger: {
      name: eventTriggerMock.name,
      namespace: eventTriggerMock.namespace,
    },
  };

  it('should see notification with error message if there is an error', async () => {
    const mockProvider = withApolloMockProvider({
      component: (
        <MutationComponent
          hook={useDeleteEventTrigger}
          hookInput={hookInput}
          mutationInput={eventTriggerMock}
        />
      ),
      mocks: [DELETE_ONE_EVENT_TRIGGER_ERROR_MOCK(variables)],
    });

    const { getByText, getByTestId } = render(
      withNotificationProvider({
        component: mockProvider,
      }),
    );

    const triggerName = processTriggerName(eventTriggerMock);
    const message = formatMessage(GQL_MUTATIONS.DELETE_TRIGGER.ERROR_MESSAGE, {
      triggerName,
      lambdaName: lambdaMock.name,
      error: `Network error: ${TESTING_STATE.ERROR}`,
    });

    const button = getByTestId(BUTTON_TEST_ID);
    fireEvent.click(button);

    await wait(() => {
      expect(getByText(message)).toBeInTheDocument();
    });
  });

  it("should see notification with success message if there isn't an error", async () => {
    const mockProvider = withApolloMockProvider({
      component: (
        <MutationComponent
          hook={useDeleteEventTrigger}
          hookInput={hookInput}
          mutationInput={eventTriggerMock}
        />
      ),
      mocks: [DELETE_ONE_EVENT_TRIGGER_DATA_MOCK(variables)],
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
        getByText(GQL_MUTATIONS.DELETE_TRIGGER.SUCCESS_MESSAGE),
      ).toBeInTheDocument();
    });
  });
});
