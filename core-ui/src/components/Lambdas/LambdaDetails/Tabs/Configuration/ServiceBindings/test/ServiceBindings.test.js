import React from 'react';
import { render, wait } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { mocks, serviceBindingUsage } from './gqlMocks';

import ServiceBindings from '../ServiceBindings';

import { SERVICE_BINDINGS_PANEL } from 'components/Lambdas/constants';

jest.mock('@kyma-project/luigi-client', () => {
  return {
    getEventData: () => ({ environmentId: 'testnamespace' }),
    uxManager: () => ({
      addBackdrop: () => {},
      removeBackdrop: () => {},
    }),
  };
});

describe('ServiceBindings', () => {
  it('Render with minimal props', async () => {
    const { getByText } = render(
      <MockedProvider mocks={mocks}>
        <ServiceBindings lambda={{}} refetchLambda={() => {}} />
      </MockedProvider>,
    );

    expect(
      getByText(SERVICE_BINDINGS_PANEL.LIST.ERRORS.RESOURCES_NOT_FOUND),
    ).toBeInTheDocument();
    await wait();
  });

  it('Render with serviceBindingUsages', async () => {
    const { queryByText } = render(
      <MockedProvider mocks={mocks}>
        <ServiceBindings
          lambda={{
            serviceBindingUsages: [serviceBindingUsage],
          }}
          refetchLambda={() => {}}
        />
      </MockedProvider>,
    );

    expect(queryByText('No entries found')).not.toBeInTheDocument();
    await wait();
  });
});
