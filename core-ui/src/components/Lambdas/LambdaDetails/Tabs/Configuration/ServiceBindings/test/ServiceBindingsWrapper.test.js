import React from 'react';
import { render, wait } from '@testing-library/react';

import {
  withApolloMockProvider,
  lambdaMock,
} from 'components/Lambdas/helpers/testing';

import { SERVICE_BINDING_USAGE_EVENT_SUBSCRIPTION_MOCK } from 'components/Lambdas/gql/hooks/queries/testMocks';

import ServiceBindingsWrapper from '../ServiceBindingsWrapper';

import {
  SERVICE_BINDINGS_PANEL,
  FUNCTION_USAGE_KIND,
} from 'components/Lambdas/constants';

jest.mock('@kyma-project/luigi-client', () => {
  return {
    getEventData: () => ({ environmentId: 'testnamespace' }),
    uxManager: () => ({
      addBackdrop: () => {},
      removeBackdrop: () => {},
    }),
  };
});

describe('ServiceBindingsWrapper', () => {
  const variables = {
    namespace: lambdaMock.namespace,
    resourceKind: FUNCTION_USAGE_KIND,
    resourceName: lambdaMock.name,
  };
  const subscriptionMock = SERVICE_BINDING_USAGE_EVENT_SUBSCRIPTION_MOCK(
    variables,
  );

  it('should render Spinner', async () => {
    const { getByLabelText } = render(
      withApolloMockProvider({
        component: (
          <ServiceBindingsWrapper
            lambda={lambdaMock}
            setBindingUsages={() => {}}
          />
        ),
        mocks: [subscriptionMock],
      }),
    );

    expect(getByLabelText('Loading')).toBeInTheDocument();
    await wait();
  });
});
