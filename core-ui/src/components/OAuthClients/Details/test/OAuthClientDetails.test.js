import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import OAuthClientDetails from '../OAuthClientDetails';

import { name, namespace, secretName, requestMocks } from './mocks';
import { MockedProvider } from '@apollo/react-testing';

describe('OAuthClientDetails', () => {
  it('renders with default props', async () => {
    const { findByText, findByLabelText } = render(
      <MockedProvider addTypename={false} mocks={requestMocks}>
        <OAuthClientDetails name={name} namespace={namespace} />
      </MockedProvider>,
    );

    // header
    expect(await findByLabelText('title')).toHaveTextContent(name);
    // client form
    expect(await findByText('Configuration')).toBeInTheDocument();
    // secret panel
    expect(await findByText(`Secret ${secretName}`)).toBeInTheDocument();
  });

  it('Switches between view and edit mode', async () => {
    const expectViewMode = async byText => {
      expect(await byText('Edit')).toBeInTheDocument();
      expect(await byText('Save')).not.toBeInTheDocument();
      expect(await byText(/Secret name/)).not.toBeInTheDocument();
    };

    const expectEditMode = async byText => {
      expect(await byText('Edit')).not.toBeInTheDocument();
      expect(await byText('Save')).toBeInTheDocument();
      expect(await byText(/Secret name/)).toBeInTheDocument();
    };

    const { findByText, getByText } = render(
      <MockedProvider addTypename={false} mocks={requestMocks}>
        <OAuthClientDetails name={name} namespace={namespace} />
      </MockedProvider>,
    );

    await wait(() => expectViewMode(findByText));

    fireEvent.click(getByText('Edit'));
    expectEditMode(findByText);
  });
});
