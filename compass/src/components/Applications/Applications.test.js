import { render, queryByText, wait } from '@testing-library/react';
import Applications from './Applications.container';
import { MockedProvider } from '@apollo/react-testing';
import React from 'react';
import { GET_APPLICATIONS } from './gql';

const mockApplication1 = {
  id: 'testapp',
  name: 'still a testapp',
  description: 'ahh, again?',
  providerName: 'I am the creator of this app',
  labels: [],
  status: { condition: 'most likely running' },
  packages: { totalCount: 9 },
};

const mocks = [
  {
    request: { query: GET_APPLICATIONS },
    result: { data: { applications: { data: [mockApplication1] } } },
  },
];

describe('Applications', () => {
  let component;
  beforeEach(() => {
    component = render(
      <MockedProvider addTypename={false} mocks={mocks}>
        <Applications />
      </MockedProvider>,
    );
  });
  it('shows the application name', async () => {
    const { queryByText } = component;

    await wait(() => {
      expect(queryByText(mockApplication1.name)).toBeInTheDocument();
    });
  });

  it('shows the package number', async () => {
    const { queryByText } = component;

    await wait(() => {
      expect(
        queryByText(mockApplication1.packages.totalCount.toString()),
      ).toBeInTheDocument();
    });
  });
});
