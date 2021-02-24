import React from 'react';
import LuigiClient from '@luigi-project/client';
import { render, fireEvent } from '@testing-library/react';
import ExperimentalFunctionalities from '../ExperimentalFunctionalities';

jest.mock('react-shared', () => ({
  useMicrofrontendContext: () => ({ showExperimentalViews: true }),
}));

describe('ExperimentalFunctionalities', () => {
  it('Sends custom message on toggle', () => {
    const spy = jest.spyOn(LuigiClient, 'sendCustomMessage');
    const { getByLabelText } = render(<ExperimentalFunctionalities />);

    fireEvent.click(getByLabelText('toggle-experimental'));

    expect(spy).toHaveBeenCalledWith({
      id: 'console.showExperimentalViews',
      showExperimentalViews: false,
    });

    spy.mockRestore();
  });
});
