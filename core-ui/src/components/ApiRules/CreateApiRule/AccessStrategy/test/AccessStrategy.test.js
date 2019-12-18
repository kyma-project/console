import React from 'react';
import AccessStrategy from '../AccessStrategy';
import wait from 'waait';
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
  const consoleError = jest.spyOn(console, 'error').mockImplementation();

  it('Renders default AccessStrategy', async () => {
    const { queryByText, queryAllByRole } = render(
      <AccessStrategy strategy={defaultAccessStrategy} />,
    );

    expect(queryByText(defaultAccessStrategy.path)).toBeTruthy();
    expect(await queryAllByRole('method')).toHaveLength(
      defaultAccessStrategy.methods.length,
    );
    expect(queryByText('Allow')).toBeTruthy();
  });

  afterEach(() => {
    consoleError.mockClear();
  });

  afterAll(() => {
    consoleError.mockRestore();
  });
});
