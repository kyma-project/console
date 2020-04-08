import React from 'react';
import { render, wait } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { mocks, lambda, serviceBindingUsage } from './gqlMocks';

import ServiceBindingsWrapper from '../ServiceBindingsWrapper';

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

describe('ServiceBindingsWrapper', () => {
  it('Render with minimal props', async () => {
    const { getByText } = render(
      <MockedProvider mocks={mocks}>
        <ServiceBindingsWrapper lambda={lambda} refetchLambda={() => {}} />
      </MockedProvider>,
    );

    expect(
      getByText(SERVICE_BINDINGS_PANEL.LIST.ERRORS.RESOURCES_NOT_FOUND),
    ).toBeInTheDocument();
    await wait();
  });

  it('Render with serviceBindingUsages', async () => {
    const lambdaWithSBU = {
      ...lambda,
      serviceBindingUsages: [serviceBindingUsage],
    };

    const { queryByText } = render(
      <MockedProvider mocks={mocks}>
        <ServiceBindingsWrapper
          lambda={lambdaWithSBU}
          refetchLambda={() => {}}
        />
      </MockedProvider>,
    );

    expect(
      queryByText(SERVICE_BINDINGS_PANEL.LIST.ERRORS.RESOURCES_NOT_FOUND),
    ).not.toBeInTheDocument();
    await wait();
  });
});
