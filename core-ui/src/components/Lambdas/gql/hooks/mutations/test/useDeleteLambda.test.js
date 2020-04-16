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
import { GQL_MUTATIONS } from 'components/Lambdas/constants';

import { useDeleteLambda } from '../useDeleteLambda';
import {
  DELETE_LAMBDA_ERROR_MOCK,
  DELETE_LAMBDA_DATA_MOCK,
} from '../testMocks';

jest.mock('@kyma-project/luigi-client', () => {
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

describe('useDeleteLambda', () => {
  const hookInput = {
    redirect: false,
  };

  const variables = {
    function: {
      name: lambdaMock.name,
      namespace: lambdaMock.namespace,
    },
  };
  const mutationInput = lambdaMock;

  it('should see notification with error message if there is an error', async () => {
    const mockProvider = withApolloMockProvider({
      component: (
        <MutationComponent
          hook={useDeleteLambda}
          hookInput={hookInput}
          mutationInput={mutationInput}
        />
      ),
      mocks: [DELETE_LAMBDA_ERROR_MOCK(variables)],
    });

    const { getByText, getByTestId } = render(
      withNotificationProvider({
        component: mockProvider,
      }),
    );

    const message = formatMessage(GQL_MUTATIONS.DELETE_LAMBDA.ERROR_MESSAGE, {
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
          hook={useDeleteLambda}
          hookInput={hookInput}
          mutationInput={mutationInput}
        />
      ),
      mocks: [DELETE_LAMBDA_DATA_MOCK(variables)],
    });

    const { getByText, getByTestId } = render(
      withNotificationProvider({
        component: mockProvider,
      }),
    );

    const message = formatMessage(GQL_MUTATIONS.DELETE_LAMBDA.SUCCESS_MESSAGE, {
      lambdaName: lambdaMock.name,
    });

    const button = getByTestId(BUTTON_TEST_ID);
    fireEvent.click(button);

    await wait(() => {
      expect(getByText(message)).toBeInTheDocument();
    });
  });
});
