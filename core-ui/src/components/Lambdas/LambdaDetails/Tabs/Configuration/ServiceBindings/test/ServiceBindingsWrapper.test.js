import React from 'react';
import { render, wait } from '@testing-library/react';

import {
  withApolloMockProvider,
  lambdaMock,
  serviceBindingUsageMock,
} from 'components/Lambdas/helpers/testing';

import {
  GET_SERVICE_BINDING_USAGES_DATA_MOCK,
  SERVICE_BINDING_USAGE_EVENT_SUBSCRIPTION_MOCK,
} from 'components/Lambdas/gql/hooks/queries/testMocks';

import ServiceBindingsWrapper from '../ServiceBindingsWrapper';

import { SERVICE_BINDINGS_PANEL } from 'components/Lambdas/constants';
import { CONFIG } from 'components/Lambdas/config';

jest.mock('@kyma-project/luigi-client', () => {
  return {
    uxManager: () => ({
      addBackdrop: () => {},
      removeBackdrop: () => {},
    }),
  };
});

describe('ServiceBindingsWrapper + ServiceBindings', () => {
  const variables = {
    namespace: lambdaMock.namespace,
    resourceKind: CONFIG.functionUsageKind,
    resourceName: lambdaMock.name,
  };
  const subscriptionMock = SERVICE_BINDING_USAGE_EVENT_SUBSCRIPTION_MOCK(
    variables,
  );

  it('should render Spinner', async () => {
    const { getByLabelText } = render(
      withApolloMockProvider({
        component: <ServiceBindingsWrapper lambda={lambdaMock} />,
        mocks: [subscriptionMock],
      }),
    );

    expect(getByLabelText('Loading')).toBeInTheDocument();
    await wait();
  });

  it('should render table', async () => {
    const { getByText, queryByRole, queryAllByRole } = render(
      withApolloMockProvider({
        component: <ServiceBindingsWrapper lambda={lambdaMock} />,
        mocks: [
          subscriptionMock,
          GET_SERVICE_BINDING_USAGES_DATA_MOCK(variables, [
            {
              ...serviceBindingUsageMock,
              name: 'name1',
            },
            {
              ...serviceBindingUsageMock,
              name: 'name2',
            },
          ]),
        ],
      }),
    );

    await wait(() => {
      expect(getByText(SERVICE_BINDINGS_PANEL.LIST.TITLE)).toBeInTheDocument();
      const table = queryByRole('table');
      expect(table).toBeInTheDocument();
      expect(queryAllByRole('row')).toHaveLength(3); // header + 2 element;
    });
  });
});
