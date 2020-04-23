import { render, wait, waitForDomChange } from '@testing-library/react';
import ApplicationDetailsScenarios from './ApplicationDetailsScenarios';
import { MockedProvider } from '@apollo/react-testing';
import React from 'react';
import { ApplicationQueryContext } from '../ApplicationDetails';
const mockScenarios = ['DEFAULT', 'second'];

describe('AplicationDetailsScenario', () => {
  it('Shows empty list', async () => {
    const component = render(
      <MockedProvider addTypename={false} mocks={[]}>
        <ApplicationQueryContext.Provider value={{ refetch: jest.fn() }}>
          <ApplicationDetailsScenarios
            applicationId={'testId'}
            scenarios={[]}
          />
        </ApplicationQueryContext.Provider>
      </MockedProvider>,
    );
    const { queryByText } = component;

    await wait(() => {
      expect(
        queryByText("This Applications isn't assigned to any scenario"),
      ).toBeInTheDocument();
    });
  });
});

describe('AplicationDetailsScenario', () => {
  let component;
  beforeEach(async () => {
    component = render(
      <MockedProvider addTypename={false} mocks={[]}>
        <ApplicationQueryContext.Provider value={{ refetch: jest.fn() }}>
          <ApplicationDetailsScenarios
            applicationId={'testId'}
            scenarios={mockScenarios}
          />
        </ApplicationQueryContext.Provider>
      </MockedProvider>,
    );
    // wait for data to load
    await waitForDomChange();
  });

  it('Shows list title', async () => {
    const { queryByText } = component;

    expect(queryByText('Assigned to Scenario')).toBeInTheDocument();
  });

  it('shows the scenarios names', async () => {
    const { queryByText } = component;

    expect(queryByText(mockScenarios[0])).toBeInTheDocument();
    expect(queryByText(mockScenarios[1])).toBeInTheDocument();
  });
});
