import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import JwtDetails from '../JwtDetails';

const config = {
  jwks_urls: ['http://jwks_2'],
  trusted_issuers: ['https://issuer_2'],
};

describe('JwtDetails', () => {
  it('loads presets', () => {
    const setConfig = jest.fn();
    //for Popovers's Warning: `NaN` is an invalid value for the `left` css style property.
    console.error = jest.fn();

    const { queryByLabelText } = render(
      <JwtDetails
        config={config}
        setConfig={setConfig}
        handleFormChanged={() => {}}
      />,
    );

    expect(queryByLabelText('jwt-jwks-uri-0')).toBeInTheDocument();
    expect(queryByLabelText('jwt-issuer-0')).toBeInTheDocument();
  });

  it('allows to remove idp', () => {
    const setConfig = jest.fn();
    //for Popovers's Warning: `NaN` is an invalid value for the `left` css style property.
    console.error = jest.fn();

    const { queryByLabelText } = render(
      <JwtDetails
        config={config}
        setConfig={setConfig}
        handleFormChanged={() => {}}
      />,
    );
    const deleteButton = queryByLabelText('remove-preset-0');
    fireEvent.click(deleteButton);

    expect(setConfig).toHaveBeenCalled();
  });
});
