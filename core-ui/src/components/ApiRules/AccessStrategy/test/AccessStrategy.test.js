import React from 'react';
import AccessStrategy from '../AccessStrategy';
import { render } from '@testing-library/react';
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

describe('AccessStrategy', () => {
  it('Renders default AccessStrategy', async () => {
    const { queryByText, queryAllByLabelText } = render(
      <AccessStrategy strategy={defaultAccessStrategy} />,
    );

    expect(queryByText(defaultAccessStrategy.path)).toBeTruthy();
    expect(await queryAllByLabelText('method')).toHaveLength(
      defaultAccessStrategy.methods.length,
    );
    expect(queryByText('noop')).toBeTruthy();
  });

  it('Renders AccessStrategy with custom name', async () => {
    const customAccessStrategy = {
      path: '/.*',
      methods: ['GET'],
      accessStrategies: [
        {
          name: 'custom',
          config: {},
        },
      ],
    };

    const { queryByText, queryByLabelText } = render(
      <AccessStrategy strategy={customAccessStrategy} />,
    );

    expect(queryByText('custom')).toBeInTheDocument();

    const label = queryByLabelText('method');
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent('GET');
  });
});
