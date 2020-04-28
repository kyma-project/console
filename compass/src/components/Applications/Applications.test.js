import { render, wait } from '@testing-library/react';
import Applications from './Applications.container';
import { MockedProvider } from '@apollo/react-testing';
import React from 'react';
import { GET_APPLICATIONS } from './gql';

const mockApplication1 = {
  id: 'testapp',
  name: 'still a testapp',
  description: 'ahh, again?',
  providerName: 'I am the creator of this app',
  labels: {
    scenarios: ['DEFAULT'],
  },
  status: { condition: 'most likely running' },
  packages: { totalCount: 9 },
};

const mocks = [
  {
    request: { query: GET_APPLICATIONS },
    result: { data: { applications: { data: [mockApplication1] } } },
  },
];

jest.mock('../../store/getConfigValue', () => ({
  getConfigValue: item => true,
}));

describe('Applications', () => {
  let component;
  beforeEach(() => {
    component = render(
      <MockedProvider addTypename={false} mocks={mocks}>
        <Applications />
      </MockedProvider>,
    );
  });

  afterAll(() => {
    jest.resetModules();
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

  it('shows the scenarios', async () => {
    const { queryByText } = component;

    await wait(() => {
      expect(
        queryByText(mockApplication1.labels.scenarios[0]),
      ).toBeInTheDocument();
    });
  });
});
