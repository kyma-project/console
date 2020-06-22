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

import { useConfigMapQuery } from '../useConfigMapQuery';
import { GET_CONFIG_MAP_ERROR_MOCK } from '../testMocks';

describe('useConfigMapQuery', () => {
  const hookInput = {
    name: lambdaMock.name,
    namespace: lambdaMock.namespace,
  };
  const variables = {
    name: lambdaMock.name,
    namespace: lambdaMock.namespace,
  };

  it('should see loading state', async () => {
    const { getByText } = render(
      withApolloMockProvider({
        component: (
          <QueryComponent hook={useConfigMapQuery} hookInput={hookInput} />
        ),
        mocks: [],
      }),
    );

    expect(getByText(TESTING_STATE.LOADING)).toBeInTheDocument();
    await wait();
  });

  it('should see notification if there is an error', async () => {
    const mockProvider = withApolloMockProvider({
      component: (
        <QueryComponent hook={useConfigMapQuery} hookInput={hookInput} />
      ),
      mocks: [GET_CONFIG_MAP_ERROR_MOCK(variables)],
    });

    const { getByText } = render(
      withNotificationProvider({
        component: mockProvider,
      }),
    );
    const message = formatMessage(GQL_QUERIES.CONFIG_MAP.ERROR_MESSAGE, {
      configMapName: lambdaMock.name,
      error: `Network error: ${TESTING_STATE.ERROR}`,
    });

    await wait(() => {
      expect(getByText(message)).toBeInTheDocument();
    });
  });
});
