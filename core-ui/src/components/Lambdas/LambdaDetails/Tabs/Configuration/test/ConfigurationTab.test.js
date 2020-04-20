import React from 'react';
import { render } from '@testing-library/react';

import { lambdaMock } from 'components/Lambdas/helpers/testing';

import {
  EVENT_TRIGGERS_PANEL,
  SERVICE_BINDINGS_PANEL,
} from 'components/Lambdas/constants';

import ConfigurationTab from '../ConfigurationTab';

// remove it after add 'mutationobserver-shim' to jest config https://github.com/jsdom/jsdom/issues/639
const mutationObserverMock = jest.fn(function MutationObserver(callback) {
  this.observe = jest.fn();
  this.disconnect = jest.fn();
  // Optionally add a trigger() method to manually trigger a change
  this.trigger = mockedMutationsList => {
    callback(mockedMutationsList, this);
  };
});
global.MutationObserver = mutationObserverMock;

jest.mock('@kyma-project/luigi-client', () => {
  return {
    getEventData: () => ({
      backendModules: [],
    }),
  };
});

describe('ConfigurationTab', () => {
  it('should not render panels for Event Triggers and Service Bindings - any required backendModules', async () => {
    const { queryByText } = render(<ConfigurationTab lambda={lambdaMock} />);

    expect(
      queryByText(EVENT_TRIGGERS_PANEL.LIST.TITLE),
    ).not.toBeInTheDocument();
    expect(
      queryByText(SERVICE_BINDINGS_PANEL.LIST.TITLE),
    ).not.toBeInTheDocument();
  });
});
