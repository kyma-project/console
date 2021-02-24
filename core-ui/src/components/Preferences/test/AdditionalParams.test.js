import React from 'react';
import LuigiClient from '@luigi-project/client';
import { render, fireEvent } from '@testing-library/react';
import AdditionalSettings from '../AdditionalSettings';

jest.mock('react-shared', () => ({
  useMicrofrontendContext: () => ({ bebEnabled: false }),
}));

describe('AdditionalSettings', () => {
  it('Sends custom message on changing the BEB', () => {
    const spy = jest.spyOn(LuigiClient, 'sendCustomMessage');
    const { getByLabelText, getByText } = render(<AdditionalSettings />);

    fireEvent.click(getByLabelText('beb-enabled'));

    fireEvent.click(getByText('Update configuration'));

    expect(spy).toHaveBeenCalledWith({
      id: 'console.updateInitParams',
      bebEnabled: true,
    });

    spy.mockRestore();
  });
});
