import React from 'react';
import { render } from '@testing-library/react';
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
  it('Render with minimal props', () => {
    const { getByText } = render(
      <MockedProvider mocks={mocks}>
        <ServiceBindings serviceBindingUsages={[]} refetchLambda={() => {}} />
      </MockedProvider>,
    );

    expect(getByText('No entries found')).toBeInTheDocument();
  });

  it('Render with serviceBindingUsages', () => {
    const { queryByText } = render(
      <MockedProvider mocks={mocks}>
        <ServiceBindings
          serviceBindingUsages={[serviceBindingUsage]}
          refetchLambda={() => {}}
        />
      </MockedProvider>,
    );

    expect(queryByText('No entries found')).not.toBeInTheDocument();
  });
});
