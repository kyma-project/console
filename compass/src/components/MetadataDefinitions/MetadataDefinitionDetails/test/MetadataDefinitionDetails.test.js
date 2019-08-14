import React from 'react';
import renderer from 'react-test-renderer';
import MetadataDefinitionDetails from '../MetadataDefinitionDetails.container';
import { MockedProvider } from 'react-apollo/test-utils';
import { mocks } from './mock';

const wait = require('waait');

describe('MetadataDefinitionDetails', () => {
  const originalConsoleError = console.error;
  afterEach(() => {
    console.error = originalConsoleError;
  });

  it('Renders null schema', async () => {
    console.error = jest.fn();
    const component = renderer.create(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MetadataDefinitionDetails definitionKey="noschemalabel" />
      </MockedProvider>,
    );
    await wait(0); // wait for response
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    // catch "Warning: Each child in a list should have a unique \"key\" prop." comming from Fundamental
    expect(console.error.mock.calls.length).toBe(1);
    expect(console.error.mock.calls[0][0]).toMatchSnapshot();
  });
});
