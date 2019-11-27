import React from 'react';
import renderer from 'react-test-renderer';
import { MockedProvider } from 'react-apollo/test-utils';

import { mocks } from './mock';

import MetadataDefinitionDetails from '../MetadataDefinitionDetails.container';

const wait = require('waait');

describe('MetadataDefinitionDetails', () => {
  it('Renders null schema', async () => {
    console.warn = jest.fn();
    const component = renderer.create(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MetadataDefinitionDetails definitionKey="noschemalabel" />
      </MockedProvider>,
    );
    await wait(0); // wait for response
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    // catch "Warning: componentWillReceiveProps has been renamed
    expect(console.warn.mock.calls.length).toBe(1);
    expect(console.warn.mock.calls[0][0]).toMatchSnapshot();
  });
});
