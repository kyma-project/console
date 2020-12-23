import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ScalingData from '../ScalingData';
import { WEBHOOK_ENVS } from 'components/Lambdas/config';
import { ignoreConsoleErrors } from 'setupTests';

const mockCmData = {
  [WEBHOOK_ENVS.FUNCTION_RESOURCES_PRESETS_MAP]: JSON.stringify({
    xl: {
      limitCpu: '10',
      requestCpu: '5',
      limitMemory: '100',
      requestMemory: '50',
    },
  }),
};

jest.mock('components/Lambdas/gql', () => ({
  ...jest.requireActual('components/Lambdas/gql'),
  useConfigMapQuery: jest.fn(() => ({ cmData: mockCmData })),
}));

const deployment = {
  requests: {
    memory: '',
    cpu: '',
  },
  limits: {
    memory: '',
    cpu: '',
  },
};

describe('ScalingData', () => {
  ignoreConsoleErrors(['Warning: `NaN` is an invalid value for the']); // ignore Popover error

  it('Renders dropdown with options', async () => {
    const { getByText, queryByText } = render(
      <ScalingData deployment={deployment} setDeployment={() => {}} />,
    );

    fireEvent.click(getByText('Custom'));

    expect(
      queryByText('xl (requests: 50/5, limits: 100/10)'),
    ).toBeInTheDocument();
  });

  it('Manages custom values visibility', async () => {
    const setDeploymentMock = jest.fn();
    const { getByText, queryByText } = render(
      <ScalingData deployment={deployment} setDeployment={setDeploymentMock} />,
    );

    expect(queryByText('Memory requests')).toBeInTheDocument();

    fireEvent.click(getByText('Custom'));
    fireEvent.click(getByText('xl (requests: 50/5, limits: 100/10)')); // choose non-custom

    expect(queryByText('Memory requests')).not.toBeInTheDocument();
    expect(setDeploymentMock).toHaveBeenCalledWith({
      limits: {
        cpu: '10',
        memory: '100',
      },
      requests: {
        cpu: '5',
        memory: '50',
      },
    });
  });
});
