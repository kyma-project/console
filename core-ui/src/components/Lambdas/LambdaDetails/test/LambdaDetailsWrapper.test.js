import React from 'react';
import { render, wait } from '@testing-library/react';

import {
  withApolloMockProvider,
  lambdaMock,
} from 'components/Lambdas/helpers/testing';
import { LAMBDA_EVENT_SUBSCRIPTION_MOCK } from 'components/Lambdas/gql/hooks/queries/testMocks';

import LambdaDetailsWrapper from '../LambdaDetailsWrapper';

jest.mock('@luigi-project/client', () => {
  return {
    linkManager: () => ({
      navigate: () => {},
    }),
    uxManager: () => ({
      addBackdrop: () => {},
      removeBackdrop: () => {},
    }),
    getEventData: () => ({
      environmentId: 'namespace',
      backendModules: [],
    }),
  };
});

describe('LambdaDetailsWrapper', () => {
  const subscriptionVariable = {
    namespace: lambdaMock.namespace,
    functionName: lambdaMock.name,
  };
  const subscriptionMock = LAMBDA_EVENT_SUBSCRIPTION_MOCK(subscriptionVariable);

  it('should render Spinner', async () => {
    const { getByLabelText } = render(
      withApolloMockProvider({
        component: <LambdaDetailsWrapper lambdaName={lambdaMock.name} />,
        mocks: [subscriptionMock, subscriptionMock],
      }),
    );

    expect(getByLabelText('Loading')).toBeInTheDocument();
    await wait();
  });
});
