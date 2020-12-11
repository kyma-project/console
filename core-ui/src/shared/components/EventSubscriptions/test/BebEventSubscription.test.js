import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import BebEventSubscription from '../BebEventSubscription';
import { MockedProvider } from '@apollo/react-testing';
import { mocks, resource } from './mocks';

describe('BebEventSubscription', () => {
  it('renders event subscriptions', async () => {
    const { findByText } = render(
      <MockedProvider addTypename={false} mocks={mocks}>
        <BebEventSubscription
          resource={resource}
          createResourceRef={() => {}}
        />
      </MockedProvider>,
    );

    expect(await findByText('test-event')).toBeInTheDocument();
  });
});
