import React from 'react';
import { render, wait } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { mocks, serviceBindingUsage } from './gqlMocks';

import ServiceBindings from '../ServiceBindings';

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
        <ServiceBindings serviceBindingUsages={[]} refetchLambda={() => {}} />
      </MockedProvider>,
    );

    expect(getByText('Resources not found.')).toBeInTheDocument();
    await wait();
  });

  it('Render with serviceBindingUsages', async () => {
    const { queryByText } = render(
      <MockedProvider mocks={mocks}>
        <ServiceBindings
          serviceBindingUsages={[serviceBindingUsage]}
          refetchLambda={() => {}}
        />
      </MockedProvider>,
    );

    expect(queryByText('Resources not found.')).not.toBeInTheDocument();
    await wait();
  });
});
