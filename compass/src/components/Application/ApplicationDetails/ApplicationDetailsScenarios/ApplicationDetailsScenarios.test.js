import { render, wait } from '@testing-library/react';
import ApplicationDetailsScenarios from './ApplicationDetailsScenarios';
import { MockedProvider } from '@apollo/react-testing';
import React from 'react';

const mockScenarios = ['DEFAULT', 'second'];

describe('AplicationDetailsScenario', () => {
  it('Shows empty list', async () => {
    const component = render(
      <MockedProvider addTypename={false} mocks={[]}>
        <ApplicationDetailsScenarios applicationId={'testId'} scenarios={[]} />
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
  beforeEach(() => {
    component = render(
      <MockedProvider addTypename={false} mocks={[]}>
        <ApplicationDetailsScenarios
          applicationId={'testId'}
          scenarios={mockScenarios}
        />
      </MockedProvider>,
    );
  });

  it('Shows list title', async () => {
    const { queryByText } = component;

    await wait(() => {
      expect(queryByText('Assigned to Scenario')).toBeInTheDocument();
    });
  });

  it('shows the scenarios names', async () => {
    const { queryByText } = component;

    await wait(() => {
      expect(queryByText(mockScenarios[0])).toBeInTheDocument();
      expect(queryByText(mockScenarios[1])).toBeInTheDocument();
    });
  });
});
