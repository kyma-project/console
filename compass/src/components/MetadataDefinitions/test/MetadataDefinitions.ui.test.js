import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { mount } from 'enzyme';
import { mocks } from './mock';

import MetadataDefinitions from '../MetadataDefinitions.container';
import { GenericList } from 'react-shared';

describe('MetadataDefinitions UI', () => {
  // for "Warning: componentWillReceiveProps has been renamed"
  console.error = jest.fn();
  console.warn = jest.fn();

  afterEach(() => {
    console.error.mockReset();
    console.warn.mockReset();
  });

  afterAll(() => {
    expect(console.error.mock.calls[0][0]).toMatchSnapshot();
    expect(console.warn).not.toHaveBeenCalled();
  });

  it(`Renders "loading" when there's no GQL response`, async () => {
    const component = mount(
      <MockedProvider addTypename={false}>
        <MetadataDefinitions />
      </MockedProvider>,
    );

    await wait(0); // wait for response

    expect(component.text()).toEqual('Loading...');
    expect(component.exists(GenericList)).not.toBeTruthy(); // there's no list displayed
  });

  it(`Renders the table `, async () => {
    const component = mount(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MetadataDefinitions />
      </MockedProvider>,
    );

    await wait(0); // wait for response

    component.update();
    expect(component.exists(GenericList)).toBeTruthy(); // there is a list displayed
  });
});
