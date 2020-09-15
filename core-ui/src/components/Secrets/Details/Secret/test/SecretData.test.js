import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import SecretData from '../SecretData';

export const secret = {
  data: {
    client_id: 'client-id',
    client_secret: 'client-secret',
  },
};

export const empty_secret = {};

describe('SecretData', () => {
  const expectEncodedState = async ({ findByText, queryByText }) => {
    expect(await findByText(btoa(secret.data.client_id))).toBeInTheDocument();
    expect(
      await findByText(btoa(secret.data.client_secret)),
    ).toBeInTheDocument();

    expect(queryByText(secret.data.client_id)).not.toBeInTheDocument();
    expect(queryByText(secret.data.client_secret)).not.toBeInTheDocument();
  };

  const expectDecodedState = async ({ findByText, queryByText }) => {
    expect(await findByText(secret.data.client_id)).toBeInTheDocument();
    expect(await findByText(secret.data.client_secret)).toBeInTheDocument();

    expect(queryByText(btoa(secret.data.client_id))).not.toBeInTheDocument();
    expect(
      queryByText(btoa(secret.data.client_secret)),
    ).not.toBeInTheDocument();
  };

  it('Renders header', async () => {
    const { queryByText } = render(<SecretData secret={secret} />);

    expect(queryByText('Data')).toBeInTheDocument();
  });

  it('Decodes and encodes secret values', async () => {
    const { findByText, queryByText } = render(<SecretData secret={secret} />);

    fireEvent.click(await findByText('Decode'));
    await expectDecodedState({ findByText, queryByText });

    fireEvent.click(await findByText('Encode'));
    await expectEncodedState({ findByText, queryByText });
  });

  it('Renders secret not found', async () => {
    const { findByText } = render(<SecretData secret={null} />);
    expect(await findByText('Secret not found.')).toBeInTheDocument();
  });

  it('Renders invalid secret', async () => {
    const { findByText } = render(<SecretData secret={empty_secret} />);
    expect(await findByText('Invalid secret.')).toBeInTheDocument();
  });
});
