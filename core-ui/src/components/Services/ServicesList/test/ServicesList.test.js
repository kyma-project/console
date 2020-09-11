import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ServicesList from '../ServicesList';
import { MockedProvider } from '@apollo/react-testing';

import { GET_SERVICES } from 'gql/queries';

const namespace = 'test-namespace';

const currentDate = Date.now();
const msInMinute = 60000;
const creationDate = currentDate - msInMinute;
const creationDateFormat = creationDate / 1000;

const servicessQueryMock = {
  request: {
    query: GET_SERVICES,
    variables: { namespace },
  },
  result: {
    data: {
      services: [
        {
          name: 'service-1',
          clusterIP: '10.10.100.100',
          creationTimestamp: creationDateFormat,
          labels: {
            label: 'test-1',
          },
          ports: [
            {
              port: '1000',
              serviceProtocol: 'TCP',
            },
          ],
        },
        {
          name: 'service-2',
          clusterIP: '11.11.111.111',
          creationTimestamp: creationDateFormat,
          labels: {
            label: 'test-2',
          },
          ports: [
            {
              port: '1111',
              serviceProtocol: 'TCP',
            },
          ],
        },
      ],
    },
  },
};

const mockNavigate = jest.fn();
jest.mock('@luigi-project/client', () => ({
  linkManager: () => ({ navigate: mockNavigate }),
}));

describe('ServicesList', () => {
  it('Renders services', async () => {
    const { findByText } = render(
      <MockedProvider addTypename={false} mocks={[servicessQueryMock]}>
        <ServicesList namespace={namespace} />
      </MockedProvider>,
    );

    expect(await findByText('service-1')).toBeInTheDocument();
    expect(await findByText('service-2')).toBeInTheDocument();
  });

  it('Renders service age properly', async () => {
    const { findAllByText } = render(
      <MockedProvider addTypename={false} mocks={[servicessQueryMock]}>
        <ServicesList namespace={namespace} />
      </MockedProvider>,
    );
    expect(await findAllByText('a minute ago'));
  });
});

it('Luigi navigate on service click', async () => {
  const { findByText } = render(
    <MockedProvider addTypename={false} mocks={[servicessQueryMock]}>
      <ServicesList namespace={namespace} />
    </MockedProvider>,
  );

  fireEvent.click(await findByText('service-1'));

  expect(mockNavigate).toHaveBeenCalledWith('details/service-1');
});
