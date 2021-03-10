import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ServiceData from '../ServiceData';

describe('ServiceData', () => {
  const deployment = {
    createService: true,
    port: {
      port: 80,
      targetPort: 90,
    },
  };

  it('Renders nothing when createService is false', () => {
    const { queryByLabelText } = render(
      <ServiceData deployment={{}} setDeployment={() => {}} />,
    );

    expect(queryByLabelText(/Port/)).not.toBeInTheDocument();
  });

  it('Updates port', () => {
    const setDeploymentMock = jest.fn();
    const { getByLabelText } = render(
      <ServiceData deployment={deployment} setDeployment={setDeploymentMock} />,
    );

    fireEvent.change(getByLabelText(/Port/), {
      target: {
        value:
          'even though we use only valueAsNumber, without "value" onChange will not be called',
        valueAsNumber: 100,
      },
    });

    expect(setDeploymentMock).toHaveBeenCalledWith({
      createService: true,
      port: { port: 100, targetPort: 90 },
    });
  });

  it('Updates target port', () => {
    const setDeploymentMock = jest.fn();
    const { getByLabelText } = render(
      <ServiceData deployment={deployment} setDeployment={setDeploymentMock} />,
    );

    fireEvent.change(getByLabelText(/Target port/), {
      target: {
        value: 'what a disgrace',
        valueAsNumber: 120,
      },
    });

    expect(setDeploymentMock).toHaveBeenCalledWith({
      createService: true,
      port: { port: 80, targetPort: 120 },
    });
  });
});
