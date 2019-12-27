import React from 'react';
import AccessStrategy from '../AccessStrategy';
import { render } from '@testing-library/react';

const defaultAccessStrategy = {
  path: '/.*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  accessStrategies: [
    {
      name: 'allow',
      config: {},
    },
  ],
  mutators: [],
};

describe('AccessStrategy', () => {
  it('Renders default AccessStrategy', async () => {
    const { queryByText, queryAllByLabelText } = render(
      <AccessStrategy strategy={defaultAccessStrategy} />,
    );

    expect(queryByText(defaultAccessStrategy.path)).toBeTruthy();
    expect(await queryAllByLabelText('method')).toHaveLength(
      defaultAccessStrategy.methods.length,
    );
    expect(queryByText('Allow')).toBeTruthy();
  });
});
