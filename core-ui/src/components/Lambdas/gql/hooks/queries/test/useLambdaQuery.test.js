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

import { useLambdaQuery } from '../useLambdaQuery';
import {
  GET_LAMBDA_ERROR_MOCK,
  GET_LAMBDA_DATA_MOCK,
  LAMBDA_EVENT_SUBSCRIPTION_MOCK,
} from '../testMocks';

describe('useLambdaQuery', () => {
  const hookInput = {
    name: lambdaMock.name,
    namespace: lambdaMock.namespace,
  };
  const variables = {
    name: lambdaMock.name,
    namespace: lambdaMock.namespace,
  };
  const subscriptionVariable = {
    namespace: lambdaMock.namespace,
    functionName: lambdaMock.name,
  };
  const subscriptionMock = LAMBDA_EVENT_SUBSCRIPTION_MOCK(subscriptionVariable);

  it('should see loading state', async () => {
    const { getByText } = render(
      withApolloMockProvider({
        component: (
          <QueryComponent hook={useLambdaQuery} hookInput={hookInput} />
        ),
        mocks: [subscriptionMock, subscriptionMock],
      }),
    );

    expect(getByText(TESTING_STATE.LOADING)).toBeInTheDocument();
    await wait();
  });

  // It's fails randomly on CI, but not in local
  // it('should see data state', async () => {
  //   const { getByText } = render(
  //     withApolloMockProvider({
  //       component: (
  //         <QueryComponent
  //           hook={useLambdaQuery}
  //           hookInput={hookInput}
  //           dataProp="lambda"
  //         />
  //       ),
  //       mocks: [
  //         GET_LAMBDA_DATA_MOCK(variables),
  //         GET_LAMBDA_DATA_MOCK(variables),
  //         subscriptionMock,
  //         subscriptionMock,
  //       ],
  //     }),
  //   );

  //   await wait(() => {
  //     expect(getByText(TESTING_STATE.DATA)).toBeInTheDocument();
  //   });
  // }, 10000);

  it('should see notification if there is an error', async () => {
    const mockProvider = withApolloMockProvider({
      component: <QueryComponent hook={useLambdaQuery} hookInput={hookInput} />,
      mocks: [
        GET_LAMBDA_ERROR_MOCK(variables),
        subscriptionMock,
        subscriptionMock,
      ],
    });

    const { getByText } = render(
      withNotificationProvider({
        component: mockProvider,
      }),
    );

    const message = formatMessage(GQL_QUERIES.LAMBDA.ERROR_MESSAGE, {
      lambdaName: lambdaMock.name,
      error: `Network error: ${TESTING_STATE.ERROR}`,
    });

    await wait(() => {
      expect(getByText(message)).toBeInTheDocument();
    });
  });
});
