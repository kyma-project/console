import React from 'react';
import { render } from '@testing-library/react';
import OAuthClientHeader from '../OAuthClientHeader';

describe('OAuthClientHeader', () => {
  it('Renders with minimal props', () => {
    const { queryByText, queryByRole } = render(
      <OAuthClientHeader
        client={{ name: 'client-name' }}
        isEditMode={false}
        canSave={false}
        setEditMode={() => {}}
        updatedSpec={{}}
      />,
    );

    expect(queryByText('client-name')).toBeInTheDocument();
    expect(queryByRole('status')).toBeInTheDocument();
  });
});
