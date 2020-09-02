import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';

import {
  MutationComponent,
  withApolloMockProvider,
  withNotificationProvider,
  TESTING_STATE,
  BUTTON_TEST_ID,
  repositoryMock,
} from 'components/Lambdas/helpers/testing';
import { formatMessage } from 'components/Lambdas/helpers/misc';
import { GQL_MUTATIONS } from 'components/Lambdas/constants';

import {
  useCreateRepository,
  prepareCreateLambdaInput,
} from '../useCreateRepository';
import {
  CREATE_REPOSITORY_DATA_MOCK,
  CREATE_REPOSITORY_ERROR_MOCK,
} from '../testMocks';

describe('useCreateRepository', () => {
  const variables = {
    name: repositoryMock.name,
    namespace: repositoryMock.namespace,
    spec: repositoryMock.spec,
  };
  const mutationInput = {
    name: repositoryMock.name,
    namespace: repositoryMock.namespace,
    spec: repositoryMock.spec,
  };

  it('should see notification with error message if there is an error', async () => {
    const mockProvider = withApolloMockProvider({
      component: (
        <MutationComponent
          hook={useCreateRepository}
          mutationInput={mutationInput}
        />
      ),
      mocks: [CREATE_REPOSITORY_ERROR_MOCK(variables)],
    });

    const { getByText, getByTestId } = render(
      withNotificationProvider({
        component: mockProvider,
      }),
    );

    const message = formatMessage(
      GQL_MUTATIONS.CREATE_REPOSITORY.ERROR_MESSAGE,
      {
        repositoryName: repositoryMock.name,
        error: `Network error: ${TESTING_STATE.ERROR}`,
      },
    );

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
          hook={useCreateRepository}
          mutationInput={mutationInput}
        />
      ),
      mocks: [CREATE_REPOSITORY_DATA_MOCK(variables)],
    });

    const { getByText, getByTestId } = render(
      withNotificationProvider({
        component: mockProvider,
      }),
    );

    const message = formatMessage(
      GQL_MUTATIONS.CREATE_REPOSITORY.SUCCESS_MESSAGE,
      {
        repositoryName: repositoryMock.name,
      },
    );

    const button = getByTestId(BUTTON_TEST_ID);
    fireEvent.click(button);

    await wait(() => {
      expect(getByText(message)).toBeInTheDocument();
    });
  });
});
