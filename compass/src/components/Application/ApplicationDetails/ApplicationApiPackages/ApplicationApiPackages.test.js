import { render, queryByText } from '@testing-library/react';
import ApplicationApiPackages from './ApplicationApiPackages';
import { MockedProvider } from '@apollo/react-testing';
import React from 'react';

const mockApiPackages = [
  {
    name: 'package one',
    description: 'It contains six spring tine cultivators and a dwarf.',
    apiDefinitions: {
      totalCount: 3,
    },
    eventDefinitions: {
      totalCount: 6,
    },
  },
];

describe('ApplicationApiPackages', () => {
  let component;
  beforeEach(() => {
    component = render(
      <MockedProvider>
        <ApplicationApiPackages
          apiPackages={mockApiPackages}
          applicationId="someapp"
        />
      </MockedProvider>,
    );
  });

  it('shows the package name', () => {
    const { queryByText } = component;
    expect(queryByText(mockApiPackages[0].name)).toBeInTheDocument();
  });

  it('shows the APIDefinition number', () => {
    const { queryAllByLabelText } = component;

    expect(
      queryByText(
        queryAllByLabelText('Unread count')[0],
        mockApiPackages[0].apiDefinitions.totalCount.toString(),
      ),
    ).toBeInTheDocument();
  });

  it('shows the EventDefinition number', () => {
    const { queryAllByLabelText } = component;

    expect(
      queryByText(
        queryAllByLabelText('Unread count')[1],
        mockApiPackages[0].eventDefinitions.totalCount.toString(),
      ),
    ).toBeInTheDocument();
  });
});
