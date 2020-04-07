import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { render, waitForDomChange } from '@testing-library/react';
import EnititesForScenarioCounter from '../EnititesForScenarioCounter';
import { validMock, errorMock } from './mocks';

describe('EnititesForScenarioCounter', () => {
  it('displays applications count', async () => {
    const { queryByText } = render(
      <MockedProvider addTypename={false} mocks={[validMock]}>
        <EnititesForScenarioCounter
          scenarioName="scenario"
          entityType="applications"
        />
      </MockedProvider>,
    );

    await waitForDomChange();

    const applicationsCount = validMock.result.data.applications.totalCount;
    expect(queryByText(applicationsCount.toString())).toBeInTheDocument();
  });

  it('displays error', async () => {
    console.warn = jest.fn();

    const { queryByText } = render(
      <MockedProvider addTypename={false} mocks={[errorMock]}>
        <EnititesForScenarioCounter
          scenarioName="scenario"
          entityType="applications"
        />
      </MockedProvider>,
    );

    await waitForDomChange();

    expect(console.warn.mock.calls[0][0].message).toMatch(
      errorMock.error.message,
    );
    expect(queryByText('error')).toBeInTheDocument();
  });
});
