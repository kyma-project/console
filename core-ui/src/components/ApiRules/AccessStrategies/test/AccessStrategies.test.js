import React from 'react';
import { render } from '@testing-library/react';

import AccessStrategies from '../AccessStrategies';
import { supportedMethodsList } from '../../accessStrategyTypes';

const defaultAccessStrategy = {
  path: '/.*',
  methods: supportedMethodsList,
  accessStrategies: [
    {
      name: 'noop',
      config: {},
    },
  ],
};

describe('AccessStrategies', () => {
  it('Renders single AccessStrategy', async () => {
    const { queryByText, queryAllByLabelText } = render(
      <AccessStrategies strategies={[defaultAccessStrategy]} />,
    );

    expect(queryByText(defaultAccessStrategy.path)).toBeTruthy();
    expect(await queryAllByLabelText('method')).toHaveLength(
      defaultAccessStrategy.methods.length,
    );
    expect(queryByText('noop')).toBeTruthy();
  });

  it('Apply empty array', async () => {
    const { queryByText, queryAllByLabelText } = render(
      <AccessStrategies strategies={[]} />,
    );

    expect(queryByText(defaultAccessStrategy.path)).toBeFalsy();
    expect(await queryAllByLabelText('method')).toHaveLength(0);
    expect(queryByText('noop')).toBeFalsy();
  });
});
