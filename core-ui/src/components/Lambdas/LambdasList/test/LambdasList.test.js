import React from 'react';
import { render, wait } from '@testing-library/react';

import {
  withApolloMockProvider,
  lambdaMock,
} from 'components/Lambdas/helpers/testing';
import {
  LAMBDA_EVENT_SUBSCRIPTION_MOCK,
  GET_LAMBDAS_DATA_MOCK,
} from 'components/Lambdas/gql/hooks/queries/testMocks';

import { TOOLBAR } from 'components/Lambdas/constants';

import LambdasListWrapper from '../LambdasListWrapper';

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

describe('LambdasListWrapper + LambdasList', () => {
  const variables = {
    namespace: lambdaMock.namespace,
  };
  const subscriptionMock = LAMBDA_EVENT_SUBSCRIPTION_MOCK(variables);

  it('should render toolbar', async () => {
    const { getByText } = render(
      withApolloMockProvider({
        component: <LambdasListWrapper />,
        mocks: [subscriptionMock],
      }),
    );

    expect(getByText(TOOLBAR.TITLE)).toBeInTheDocument();
    expect(getByText(TOOLBAR.DESCRIPTION)).toBeInTheDocument();
    await wait();
  });

  it('should render Spinner if lambdas is fetching from server', async () => {
    const { getByLabelText } = render(
      withApolloMockProvider({
        component: <LambdasListWrapper />,
        mocks: [subscriptionMock],
      }),
    );

    expect(getByLabelText('Loading')).toBeInTheDocument();
    await wait();
  });

  it('should render table with data', async () => {
    const { queryByRole, queryAllByRole } = render(
      withApolloMockProvider({
        component: <LambdasListWrapper />,
        mocks: [subscriptionMock, GET_LAMBDAS_DATA_MOCK(variables)],
      }),
    );

    await wait(() => {
      const table = queryByRole('table');
      expect(table).toBeInTheDocument();
      expect(queryAllByRole('row')).toHaveLength(2); // header + 1 element;
    });
  });
});
