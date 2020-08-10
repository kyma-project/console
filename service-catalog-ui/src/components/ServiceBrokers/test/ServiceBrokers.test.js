import React from 'react';
import { render } from '@testing-library/react';
import ServiceBrokers from '../ServiceBrokers';
import { MockedProvider } from '@apollo/react-testing';
import { fixBrokersQuery, namespace as mockNamespace, broker } from './mocks';

jest.mock('@luigi-project/client', () => ({
  getContext: () => ({ namespaceId: mockNamespace }),
}));

describe('ServiceBrokers', () => {
  it('renders brokers list, omitting empty entries', async () => {
    const { findByText, findByRole, findAllByRole } = render(
      <MockedProvider
        addTypename={false}
        mocks={[fixBrokersQuery([broker, null])]}
      >
        <ServiceBrokers />
      </MockedProvider>,
    );

    expect(await findByText(broker.name)).toBeInTheDocument();
    expect(await findByText(broker.url)).toBeInTheDocument();
    expect(await findByRole('status')).toHaveTextContent('RUNNING');
    expect(await findAllByRole('row')).toHaveLength(2); // header + 1 entry
  });
});
