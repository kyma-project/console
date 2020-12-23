import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import BasicData from '../BasicData';

describe('BasicData', () => {
  it('Updates name and docker image', () => {
    const setDeploymentMock = jest.fn();
    const { getByLabelText } = render(
      <BasicData deployment={{}} setDeployment={setDeploymentMock} />,
    );
    fireEvent.change(getByLabelText(/Name/), {
      target: { value: 'test-name' },
    });

    expect(setDeploymentMock).toHaveBeenCalledWith({ name: 'test-name' });

    fireEvent.change(getByLabelText(/Docker image/), {
      target: { value: 'test-image' },
    });

    expect(setDeploymentMock).toHaveBeenCalledWith({
      dockerImage: 'test-image',
    });
  });

  it('Switches service creation', () => {
    const setDeploymentMock = jest.fn();
    const { getByLabelText } = render(
      <BasicData deployment={{}} setDeployment={setDeploymentMock} />,
    );
    fireEvent.click(getByLabelText(/Create Service/));

    expect(setDeploymentMock).toHaveBeenCalledWith({
      createService: true,
    });

    fireEvent.click(getByLabelText(/Create Service/));

    expect(setDeploymentMock).toHaveBeenCalledWith({
      createService: false,
    });
  });
});
