import React from 'react';
import LuigiClient from '@luigi-project/client';
import { render, fireEvent } from '@testing-library/react';
import KubernetesApiUrl from '../KubernetesApiUrl';

jest.mock('react-shared', () => ({
  useMicrofrontendContext: () => ({ k8sApiUrl: 'test-api-url' }),
}));

describe('KubernetesApiUrl', () => {
  it('Sets input default value', () => {
    const { getByPlaceholderText } = render(<KubernetesApiUrl />);
    expect(getByPlaceholderText('Kubernetes API Url')).toHaveValue(
      'test-api-url',
    );
  });

  it('Sends custom message on button click', () => {
    const url = 'api.url';

    const spy = jest.spyOn(LuigiClient, 'sendCustomMessage');
    const { getByPlaceholderText, getByText } = render(<KubernetesApiUrl />);

    fireEvent.change(getByPlaceholderText('Kubernetes API Url'), {
      target: { value: url },
    });

    fireEvent.click(getByText('Update configuration'));
    expect(spy).toHaveBeenCalledWith({
      id: 'console.updateInitParams',
      k8sApiUrl: url,
    });

    spy.mockRestore();
  });
});
