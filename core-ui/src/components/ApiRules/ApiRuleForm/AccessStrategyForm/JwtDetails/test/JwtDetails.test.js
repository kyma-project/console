import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import JwtDetails from '../JwtDetails';

const idpPresets = [
  {
    name: 'preset-1',
    jwks_urls: 'http://jwks_2',
    trusted_issuers: 'https://issuer_2',
  },
];

const config = {
  jwks_urls: ['http://jwks_2'],
  trusted_issuers: ['https://issuer_2'],
};

describe('JwtDetails', () => {
  it('allows to remove idp', () => {
    const setConfig = jest.fn();
    //for Popovers's Warning: `NaN` is an invalid value for the `left` css style property.
    console.error = jest.fn();

    const { getByText, queryByText, queryByLabelText } = render(
      <JwtDetails
        config={config}
        setConfig={setConfig}
        idpPresets={idpPresets}
        handleFormChanged={() => {}}
      />,
    );

    const deleteButton = queryByLabelText('remove-preset-0');
    fireEvent.click(deleteButton);

    expect(setConfig).toHaveBeenCalled();
  });

  it('loads presets list', () => {
    //for Popovers's Warning: `NaN` is an invalid value for the `left` css style property.
    console.error = jest.fn();

    const { getByText, queryByText } = render(
      <JwtDetails
        config={config}
        setConfig={() => {}}
        idpPresets={idpPresets}
        handleFormChanged={() => {}}
      />,
    );

    // expand the list
    const addPresetDropdown = getByText('Configure identity provider...');
    fireEvent.click(addPresetDropdown);

    expect(queryByText(idpPresets[0].name)).toBeInTheDocument();
  });
});
