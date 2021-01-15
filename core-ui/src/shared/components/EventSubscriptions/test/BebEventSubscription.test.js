import React from 'react';
import { render } from '@testing-library/react';

import BebEventSubscription from '../BebEventSubscription';
import { MockedProvider } from '@apollo/react-testing';
import { mocks, resource, mockNamespace } from './mocks';

jest.mock('react-shared', () => ({
  ...jest.requireActual('react-shared'),
  useMicrofrontendContext: () => ({ namespaceId: mockNamespace }),
}));

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
