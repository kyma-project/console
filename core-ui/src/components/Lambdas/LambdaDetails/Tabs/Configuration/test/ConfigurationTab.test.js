import React from 'react';
import { render } from '@testing-library/react';

import { lambdaMock } from 'components/Lambdas/helpers/testing';

import {
  EVENT_TRIGGERS_PANEL,
  SERVICE_BINDINGS_PANEL,
} from 'components/Lambdas/constants';

import ConfigurationTab from '../ConfigurationTab';

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
