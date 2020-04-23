import React from 'react';
import { render, waitForDomChange } from '@testing-library/react';
import ApplicationDetails from '../ApplicationDetails';
import { MockedProvider } from '@apollo/react-testing';
import { GET_APPLICATION } from '../../gql';

describe('ApplicationDetails', () => {
  let component;

  beforeEach(async () => {
    component = render(
      <MockedProvider addTypename={false} mocks={[MOCK_GET_APPLICATION]}>
        <ApplicationDetails applicationId="123" />
      </MockedProvider>,
    );
    // wait for data to load
    await waitForDomChange();
  });

  it('Shows application providerName', async () => {
    const { queryByText } = component;
    expect(
      queryByText(MOCK_GET_APPLICATION.result.data.application.providerName),
    ).toBeInTheDocument();
  });

  it('Shows application description', async () => {
    const { queryByText } = component;
    expect(
      queryByText(MOCK_GET_APPLICATION.result.data.application.description),
    ).toBeInTheDocument();
  });

  it('Shows application status', async () => {
    const { queryByText } = component;
    expect(
      queryByText(
        MOCK_GET_APPLICATION.result.data.application.status.condition,
      ),
    ).toBeInTheDocument();
  });

  it('Shows application scenarios', async () => {
    const { queryByText } = component;

    MOCK_GET_APPLICATION.result.data.application.labels.scenarios.forEach(s => {
      expect(queryByText(s)).toBeInTheDocument();
    });
  });

  it('Shows application empty packages list', async () => {
    const { queryByText } = component;
    expect(
      queryByText('There are no Packages defined for this Application'),
    ).toBeInTheDocument();
  });
});

const MOCK_GET_APPLICATION = {
  request: {
    query: GET_APPLICATION,
    variables: {
      id: '123',
    },
  },

  result: {
    data: {
      application: {
        id: '123',
        providerName: 'testProviderName',
        description: 'testDescription',
        name: 'testName',
        labels: {
          integrationSystemID: '',
          name: 'testName',
          scenarios: ['DEFAULT', 'new'],
        },
        healthCheckURL: null,
        integrationSystemID: null,
        status: { condition: 'INITIAL' },
        packages: {
          data: [],
        },
      },
    },
  },
};
