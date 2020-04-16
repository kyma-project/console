import React from 'react';
import { render, wait } from '@testing-library/react';

import {
  QueryComponent,
  withApolloMockProvider,
  TESTING_STATE,
  lambdaMock,
} from 'components/Lambdas/helpers/testing';

import { useServiceInstancesQuery } from '../useServiceInstancesQuery';
import { GET_SERVICE_INSTANCES_DATA_MOCK } from '../testMocks';

describe('useServiceInstancesQuery', () => {
  const hookInput = {
    namespace: lambdaMock.namespace,
    serviceBindingUsages: [],
  };
  const variables = {
    namespace: lambdaMock.namespace,
    status: 'RUNNING',
  };

  it('should see loading state', async () => {
    const { getByText } = render(
      withApolloMockProvider({
        component: (
          <QueryComponent
            hook={useServiceInstancesQuery}
            hookInput={hookInput}
          />
        ),
        mocks: [],
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
            hook={useServiceInstancesQuery}
            hookInput={hookInput}
            dataProp="serviceInstances"
          />
        ),
        mocks: [GET_SERVICE_INSTANCES_DATA_MOCK(variables)],
      }),
    );

    await wait(() => {
      expect(getByText(TESTING_STATE.DATA)).toBeInTheDocument();
    });
  });
});
