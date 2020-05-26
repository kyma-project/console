import React from 'react';
import { render, wait, fireEvent } from '@testing-library/react';

import {
  withApolloMockProvider,
  lambdaMock,
} from 'components/Lambdas/helpers/testing';
import { SERVICE_BINDINGS_PANEL } from 'components/Lambdas/constants';

import CreateServiceBindingModal from '../CreateServiceBindingModal';

import { GET_SERVICE_INSTANCES_DATA_MOCK } from 'components/Lambdas/gql/hooks/queries/testMocks';

jest.mock('@kyma-project/luigi-client', () => {
  return {
    uxManager: () => ({
      addBackdrop: () => {},
      removeBackdrop: () => {},
    }),
  };
});

describe('CreateServiceBindingModal', () => {
  const serviceInstancesVariables = {
    namespace: lambdaMock.namespace,
    status: 'RUNNING',
  };

  it('renders disabled button if there are not available Service Instances', async () => {
    const { getByText } = render(
      withApolloMockProvider({
        component: (
          <CreateServiceBindingModal
            lambda={lambdaMock}
            serviceBindingUsages={[]}
          />
        ),
        mocks: [GET_SERVICE_INSTANCES_DATA_MOCK(serviceInstancesVariables, [])],
      }),
    );

    const button = getByText(
      SERVICE_BINDINGS_PANEL.CREATE_MODAL.OPEN_BUTTON.TEXT,
    );
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it('should render "Open modal" button if there are available Service Instances', async () => {
    const { getByText } = render(
      withApolloMockProvider({
        component: (
          <CreateServiceBindingModal
            lambda={lambdaMock}
            serviceBindingUsages={[]}
          />
        ),
        mocks: [GET_SERVICE_INSTANCES_DATA_MOCK(serviceInstancesVariables)],
      }),
    );

    await wait(() => {
      const button = getByText(
        SERVICE_BINDINGS_PANEL.CREATE_MODAL.OPEN_BUTTON.TEXT,
      );
      expect(button).toBeInTheDocument();
      expect(button).not.toBeDisabled();
    });
  });
});
