import React from 'react';
import { render, wait } from '@testing-library/react';

import {
  withApolloMockProvider,
  lambdaMock,
} from 'components/Lambdas/helpers/testing';
import { LAMBDA_EVENT_SUBSCRIPTION_MOCK } from 'components/Lambdas/gql/hooks/queries/testMocks';

import { TOOLBAR } from 'components/Lambdas/constants';

import Wrapper from '../Wrapper';

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
    }),
  };
});

describe('Wrapper', () => {
  const variables = {
    namespace: lambdaMock.namespace,
  };
  const subscriptionMock = LAMBDA_EVENT_SUBSCRIPTION_MOCK(variables);

  it('should render toolbar', async () => {
    const { getByText } = render(
      withApolloMockProvider({
        component: <Wrapper />,
        mocks: [subscriptionMock],
      }),
    );

    expect(getByText(TOOLBAR.DESCRIPTION)).toBeInTheDocument();
    await wait();
  });
});
